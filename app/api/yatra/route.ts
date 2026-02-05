import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'
import { LocationVerificationStatus } from '@prisma/client'
import { purgePaths } from '@/lib/cloudflare/cdn'

async function verifyLocationContent(storyId: string, textFields: { title: string; discoveryContext: string; journeyNarrative: string }) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not configured, skipping location verification')
    return
  }

  try {
    const combinedText = `
Title: ${textFields.title}

Discovery Context: ${textFields.discoveryContext}

Journey Narrative: ${textFields.journeyNarrative}
    `.trim()

    const prompt = `You are a content moderator for a heritage site protection platform. Your task is to analyze text and detect if it contains specific location information that could reveal the exact location of a heritage site.

Analyze the following yatra story submission:

"""
${combinedText}
"""

Check if the text contains any of the following location-revealing information:
1. Exact GPS coordinates or latitude/longitude
2. Specific village, town, or city names
3. Specific district or state/region names combined with landmarks
4. Exact addresses or road names
5. Distance and direction from known landmarks (e.g., "5 km north of XYZ temple")
6. Google Maps links or coordinates
7. Specific landmarks that could pinpoint the location

IMPORTANT: Generic descriptions like "in a forest", "near a river", "in the hills", "in South India" are ACCEPTABLE and should NOT be flagged.

Respond in JSON format only:
{
  "containsLocation": true/false,
  "confidence": "high"/"medium"/"low",
  "detectedLocations": ["list of detected specific locations if any"],
  "reason": "brief explanation"
}

Only set containsLocation to true if you find SPECIFIC location identifiers that could help someone pinpoint the exact heritage site location.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Gemini API error:', await response.text())
      await prisma.yatraStory.update({
        where: { id: storyId },
        data: {
          locationVerificationStatus: LocationVerificationStatus.ERROR,
          locationVerificationResult: { error: 'API request failed' },
          locationVerifiedAt: new Date(),
        },
      })
      return
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      await prisma.yatraStory.update({
        where: { id: storyId },
        data: {
          locationVerificationStatus: LocationVerificationStatus.ERROR,
          locationVerificationResult: { error: 'No response from API' },
          locationVerifiedAt: new Date(),
        },
      })
      return
    }

    let jsonStr = responseText
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1]
    }

    const result = JSON.parse(jsonStr.trim())

    const status: LocationVerificationStatus = result.containsLocation
      ? LocationVerificationStatus.FLAGGED
      : LocationVerificationStatus.PASSED

    await prisma.yatraStory.update({
      where: { id: storyId },
      data: {
        locationVerificationStatus: status,
        locationVerificationResult: result,
        locationVerifiedAt: new Date(),
      },
    })

    console.log(`Location verification completed for story ${storyId}: ${status}`)
  } catch (error) {
    console.error('Location verification error:', error)
    await prisma.yatraStory.update({
      where: { id: storyId },
      data: {
        locationVerificationStatus: LocationVerificationStatus.ERROR,
        locationVerificationResult: { error: error instanceof Error ? error.message : 'Unknown error' },
        locationVerifiedAt: new Date(),
      },
    })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const heritageSiteId = searchParams.get('heritageSiteId')

    const where: any = {}

    if (heritageSiteId) {
      where.heritageSiteId = heritageSiteId
    }
    if (session.role !== 'admin') {
      where.OR = [
        { publishStatus: { in: ['APPROVED_PUBLIC', 'FEATURED_YATRA'] } },
        { userId: session.userId }
      ]
    }

    const stories = await withRetry(() =>
      prisma.yatraStory.findMany({
        where,
        include: {
          heritageSite: {
            select: {
              id: true,
              title: true,
              type: true,
              images: {
                select: {
                  id: true,
                  r2Url: true,
                  cloudinaryUrl: true,
                  location: true,
                },
                take: 1,
              },
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    )

    const userLikes = await withRetry(() =>
      prisma.yatraLike.findMany({
        where: {
          userId: session.userId,
          storyId: { in: stories.map((s) => s.id) },
        },
        select: { storyId: true },
      })
    )
    const likedStoryIds = new Set(userLikes.map((like) => like.storyId))

    const userSaves = await withRetry(() =>
      prisma.yatraSaved.findMany({
        where: {
          userId: session.userId,
          storyId: { in: stories.map((s) => s.id) },
        },
        select: { storyId: true },
      })
    )
    const savedStoryIds = new Set(userSaves.map((save) => save.storyId))

    const userIds = [...new Set(stories.map((s) => s.userId))]
    const users = await withRetry(() =>
      prisma.profile.findMany({
        where: { id: { in: userIds } },
        select: {
          id: true,
          name: true,
        },
      })
    )
    const userMap = new Map(users.map((u) => [u.id, u]))

    const storiesWithUsers = stories.map((story) => {
      const baseStory = {
        id: story.id,
        userId: story.userId,
        heritageSiteId: story.heritageSiteId,
        title: story.title,
        discoveryContext: story.discoveryContext,
        journeyNarrative: story.journeyNarrative,
        historicalIndicators: story.historicalIndicators,
        historicalIndicatorsDetails: story.historicalIndicatorsDetails,
        evidenceTypes: story.evidenceTypes,
        safeVisuals: story.safeVisuals,
        personalReflection: story.personalReflection,
        submissionConfirmed: story.submissionConfirmed,
        publishStatus: story.publishStatus,
        culturalInsights: story.culturalInsights,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
        heritageSite: story.heritageSite,
        author: userMap.get(story.userId) || null,
        likeCount: story._count.likes,
        commentCount: story._count.comments,
        isLikedByUser: likedStoryIds.has(story.id),
        isSavedByUser: savedStoryIds.has(story.id),
      }

      if (session.role === 'admin') {
        return {
          ...baseStory,
          locationVerificationStatus: story.locationVerificationStatus,
          locationVerificationResult: story.locationVerificationResult,
          locationVerifiedAt: story.locationVerifiedAt,
        }
      }

      return baseStory
    })

    const response = { stories: storiesWithUsers }
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching Yatra stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Yatra stories', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      heritageSiteId,
      title,
      discoveryContext,
      journeyNarrative,
      historicalIndicators,
      historicalIndicatorsDetails,
      evidenceTypes,
      safeVisuals = [],
      personalReflection,
      submissionConfirmed,
      culturalInsights,
    } = body

    if (!heritageSiteId || !title) {
      return NextResponse.json(
        { error: 'Heritage site and title are required' },
        { status: 400 }
      )
    }

    if (discoveryContext !== undefined) {
      if (!discoveryContext || !journeyNarrative || !historicalIndicators?.length || !evidenceTypes?.length || !submissionConfirmed) {
        return NextResponse.json(
          { error: 'Please complete all required fields and confirm your submission' },
          { status: 400 }
        )
      }
    } else {
      if (!journeyNarrative || !culturalInsights) {
        return NextResponse.json(
          { error: 'Journey narrative and cultural insights are required' },
          { status: 400 }
        )
      }
    }

    const heritageSite = await withRetry(() =>
      prisma.heritageSite.findUnique({
        where: { id: heritageSiteId },
        include: {
          yatraStory: true,
        },
      })
    )

    if (!heritageSite) {
      return NextResponse.json(
        { error: 'Heritage site not found' },
        { status: 404 }
      )
    }

    if (heritageSite.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only create stories for your own heritage sites' },
        { status: 403 }
      )
    }

    if (heritageSite.paymentStatus !== 'COMPLETED' && heritageSite.paymentStatus !== 'IN_PROGRESS') {
      return NextResponse.json(
        {
          error:
            'You can only create Yatra stories for heritage sites that have been paid for or have payment in progress',
        },
        { status: 403 }
      )
    }

    if (heritageSite.yatraStory) {
      return NextResponse.json(
        { error: 'A Yatra story already exists for this heritage site' },
        { status: 400 }
      )
    }

    const yatraStory = await withRetry(() =>
      prisma.yatraStory.create({
        data: {
          userId: session.userId,
          heritageSiteId,
          title,
          journeyNarrative,
          discoveryContext: discoveryContext || '',
          historicalIndicators: historicalIndicators || [],
          historicalIndicatorsDetails: historicalIndicatorsDetails || null,
          evidenceTypes: evidenceTypes || [],
          safeVisuals: safeVisuals || [],
          personalReflection: personalReflection || null,
          submissionConfirmed: submissionConfirmed || false,
          publishStatus: 'PENDING_REVIEW',
          culturalInsights: culturalInsights || null,
        },
        include: {
          heritageSite: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      })
    )

    await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: heritageSiteId },
        data: { yatraStoryPrompted: true },
      })
    )

    // Purge CDN cache for yatra listing pages
    purgePaths(['/dashboard/yatra', '/']).catch((err) =>
      console.error('CDN purge error:', err)
    )

    verifyLocationContent(yatraStory.id, {
      title,
      discoveryContext: discoveryContext || '',
      journeyNarrative,
    }).catch((err) => console.error('Background verification error:', err))

    return NextResponse.json({
      success: true,
      story: yatraStory,
    })
  } catch (error: any) {
    console.error('Error creating Yatra story:', error)
    return NextResponse.json(
      { error: 'Failed to create Yatra story', details: error.message },
      { status: 500 }
    )
  }
}
