import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { notifyStoryLike } from '@/lib/notifications'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingLike = await withRetry(() =>
      prisma.yatraLike.findUnique({
        where: {
          storyId_userId: {
            storyId: id,
            userId: session.userId,
          },
        },
      })
    )

    if (existingLike) {
      await withRetry(() =>
        prisma.yatraLike.delete({
          where: { id: existingLike.id },
        })
      )

      const likeCount = await withRetry(() =>
        prisma.yatraLike.count({
          where: { storyId: id },
        })
      )

      return NextResponse.json({
        success: true,
        liked: false,
        likeCount,
      })
    } else {
      await withRetry(() =>
        prisma.yatraLike.create({
          data: {
            storyId: id,
            userId: session.userId,
          },
        })
      )

      const [likeCount, user, story] = await Promise.all([
        withRetry(() =>
          prisma.yatraLike.count({
            where: { storyId: id },
          })
        ),
        withRetry(() =>
          prisma.profile.findUnique({
            where: { id: session.userId },
            select: { name: true },
          })
        ),
        withRetry(() =>
          prisma.yatraStory.findUnique({
            where: { id },
            select: { userId: true, title: true },
          })
        ),
      ])

      // Send notification to story owner
      if (story && user) {
        await notifyStoryLike(
          id,
          story.userId,
          user.name,
          session.userId,
          story.title
        )
      }

      return NextResponse.json({
        success: true,
        liked: true,
        likeCount,
      })
    }
  } catch (error: any) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const likeCount = await withRetry(() =>
      prisma.yatraLike.count({
        where: { storyId: id },
      })
    )

    const userLike = await withRetry(() =>
      prisma.yatraLike.findUnique({
        where: {
          storyId_userId: {
            storyId: id,
            userId: session.userId,
          },
        },
      })
    )

    return NextResponse.json({
      likeCount,
      liked: !!userLike,
    })
  } catch (error: any) {
    console.error('Error fetching like data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch like data' },
      { status: 500 }
    )
  }
}
