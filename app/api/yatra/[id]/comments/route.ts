import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { notifyStoryComment } from '@/lib/notifications'

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

    const comments = await withRetry(() =>
      prisma.yatraComment.findMany({
        where: { storyId: id },
        orderBy: { createdAt: 'desc' },
      })
    )

    const userIds = [...new Set(comments.map((c) => c.userId))]
    const users = await withRetry(() =>
      prisma.profile.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      })
    )

    const userMap = new Map(users.map((u) => [u.id, u]))

    const commentsWithUsers = comments.map((comment) => ({
      ...comment,
      user: userMap.get(comment.userId) || { id: comment.userId, name: 'Unknown' },
    }))

    return NextResponse.json({ comments: commentsWithUsers })
  } catch (error: any) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

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
    const body = await request.json()
    const { comment } = body

    if (!comment || !comment.trim()) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      )
    }

    const newComment = await withRetry(() =>
      prisma.yatraComment.create({
        data: {
          storyId: id,
          userId: session.userId,
          comment: comment.trim(),
        },
      })
    )

    const [user, story] = await Promise.all([
      withRetry(() =>
        prisma.profile.findUnique({
          where: { id: session.userId },
          select: { id: true, name: true },
        })
      ),
      withRetry(() =>
        prisma.yatraStory.findUnique({
          where: { id },
          select: { userId: true, title: true },
        })
      ),
    ])

    if (story && user) {
      await notifyStoryComment(
        id,
        story.userId,
        user.name,
        session.userId,
        story.title
      )
    }

    return NextResponse.json({
      success: true,
      comment: {
        ...newComment,
        user: user || { id: session.userId, name: 'Unknown' },
      },
    })
  } catch (error: any) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
