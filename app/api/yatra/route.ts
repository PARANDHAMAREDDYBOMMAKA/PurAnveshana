import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'

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

    // Filter stories based on user role
    if (session.role !== 'admin') {
      // For regular users: show approved stories OR their own stories
      where.OR = [
        { publishStatus: { in: ['APPROVED_PUBLIC', 'FEATURED_YATRA'] } },
        { userId: session.userId }
      ]
    }
    // For admins: show all stories (no additional filter)

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

    // Fetch all user likes in a single query
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
          author: user,
          likeCount: story._count.likes,
          commentCount: story._count.comments,
          isLikedByUser: likedStoryIds.has(story.id),
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

    if (heritageSite.paymentStatus !== 'COMPLETED') {
      return NextResponse.json(
        {
          error:
            'You can only create Yatra stories for heritage sites that have been paid for',
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
