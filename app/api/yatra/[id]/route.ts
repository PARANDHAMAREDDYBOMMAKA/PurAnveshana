import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'

// GET /api/yatra/[id] - Get a specific Yatra story
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

    const story = await withRetry(() =>
      prisma.yatraStory.findUnique({
        where: { id },
        include: {
          heritageSite: {
            select: {
              id: true,
              title: true,
              type: true,
              description: true,
              images: {
                select: {
                  id: true,
                  r2Url: true,
                  cloudinaryUrl: true,
                  location: true,
                  gpsLatitude: true,
                  gpsLongitude: true,
                },
              },
            },
          },
        },
      })
    )

    if (!story) {
      return NextResponse.json(
        { error: 'Yatra story not found' },
        { status: 404 }
      )
    }

    if (story.publishStatus === 'PENDING_REVIEW') {
      return NextResponse.json(
        { error: 'This story is not published' },
        { status: 403 }
      )
    }

    // Non-admin users can only view their own stories
    if (session.role !== 'admin' && story.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You do not have permission to view this story' },
        { status: 403 }
      )
    }

    // Fetch author details
    const author = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: story.userId },
        select: {
          id: true,
          name: true,
        },
      })
    )

    return NextResponse.json({
      story: {
        ...story,
        author,
      },
    })
  } catch (error: any) {
    console.error('Error fetching Yatra story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Yatra story', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/yatra/[id] - Update a Yatra story
export async function PUT(
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
    const { title, journeyNarrative, culturalInsights, safeVisuals } = body

    // Check if story exists
    const existingStory = await withRetry(() =>
      prisma.yatraStory.findUnique({
        where: { id },
      })
    )

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Yatra story not found' },
        { status: 404 }
      )
    }

    // Only the author can update their story
    if (existingStory.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only update your own stories' },
        { status: 403 }
      )
    }

    // Update the story
    const updatedStory = await withRetry(() =>
      prisma.yatraStory.update({
        where: { id },
        data: {
          title,
          journeyNarrative,
          culturalInsights,
          safeVisuals,
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

    return NextResponse.json({
      success: true,
      story: updatedStory,
    })
  } catch (error: any) {
    console.error('Error updating Yatra story:', error)
    return NextResponse.json(
      { error: 'Failed to update Yatra story', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/yatra/[id] - Delete a Yatra story
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if story exists
    const existingStory = await withRetry(() =>
      prisma.yatraStory.findUnique({
        where: { id },
      })
    )

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Yatra story not found' },
        { status: 404 }
      )
    }

    // Only the author or admin can delete
    if (
      existingStory.userId !== session.userId &&
      session.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'You can only delete your own stories' },
        { status: 403 }
      )
    }

    // Delete the story
    await withRetry(() =>
      prisma.yatraStory.delete({
        where: { id },
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Yatra story deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting Yatra story:', error)
    return NextResponse.json(
      { error: 'Failed to delete Yatra story', details: error.message },
      { status: 500 }
    )
  }
}
