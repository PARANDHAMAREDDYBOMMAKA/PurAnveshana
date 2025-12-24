import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'

// GET /api/yatra - List Yatra stories (user sees only their own, admin sees all)
export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const heritageSiteId = searchParams.get('heritageSiteId')

    const where: any = {}

    // All logged-in users can see ALL Yatra stories from everyone
    // No filtering by publish status - all stories are public

    if (heritageSiteId) {
      where.heritageSiteId = heritageSiteId
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    )

    // Fetch user details for each story
    const storiesWithUsers = await Promise.all(
      stories.map(async (story) => {
        const user = await withRetry(() =>
          prisma.profile.findUnique({
            where: { id: story.userId },
            select: {
              id: true,
              name: true,
            },
          })
        )

        return {
          ...story,
          author: user,
        }
      })
    )

    return NextResponse.json({ stories: storiesWithUsers })
  } catch (error: any) {
    console.error('Error fetching Yatra stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Yatra stories', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/yatra - Create a new Yatra story
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
      // Legacy field for backwards compatibility
      culturalInsights,
    } = body

    // Validate required fields
    if (!heritageSiteId || !title) {
      return NextResponse.json(
        { error: 'Heritage site and title are required' },
        { status: 400 }
      )
    }

    // For new wizard submissions
    if (discoveryContext !== undefined) {
      if (!discoveryContext || !journeyNarrative || !historicalIndicators?.length || !evidenceTypes?.length || !submissionConfirmed) {
        return NextResponse.json(
          { error: 'Please complete all required fields and confirm your submission' },
          { status: 400 }
        )
      }
    } else {
      // For legacy form submissions
      if (!journeyNarrative || !culturalInsights) {
        return NextResponse.json(
          { error: 'Journey narrative and cultural insights are required' },
          { status: 400 }
        )
      }
    }

    // Verify the heritage site exists and belongs to the user
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

    // Check if the heritage site has been paid for
    if (heritageSite.paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        {
          error:
            'You can only create Yatra stories for heritage sites that have been paid for',
        },
        { status: 403 }
      )
    }

    // Check if a story already exists for this site
    if (heritageSite.yatraStory) {
      return NextResponse.json(
        { error: 'A Yatra story already exists for this heritage site' },
        { status: 400 }
      )
    }

    // Create the Yatra story
    const yatraStory = await withRetry(() =>
      prisma.yatraStory.create({
        data: {
          userId: session.userId,
          heritageSiteId,
          title,
          journeyNarrative,
          // New wizard fields
          discoveryContext: discoveryContext || '',
          historicalIndicators: historicalIndicators || [],
          historicalIndicatorsDetails: historicalIndicatorsDetails || null,
          evidenceTypes: evidenceTypes || [],
          safeVisuals: safeVisuals || [],
          personalReflection: personalReflection || null,
          submissionConfirmed: submissionConfirmed || false,
          publishStatus: 'PENDING_REVIEW',
          // Legacy field for backwards compatibility
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

    // Mark the heritage site as prompted
    await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: heritageSiteId },
        data: { yatraStoryPrompted: true },
      })
    )

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
