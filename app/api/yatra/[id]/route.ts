import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'
import { invalidatePattern, CACHE_KEYS } from '@/lib/redis'

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
    const { title, journeyNarrative, culturalInsights, safeVisuals, changeDescription } = body

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

    if (existingStory.userId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only update your own stories' },
        { status: 403 }
      )
    }

    const latestVersion = await withRetry(() =>
      prisma.yatraStoryVersion.findFirst({
        where: { storyId: id },
        orderBy: { versionNumber: 'desc' },
        select: { versionNumber: true },
      })
    )

    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1

    const updatedStory = await prisma.$transaction(async (tx) => {
      await tx.yatraStoryVersion.create({
        data: {
          storyId: id,
          versionNumber: nextVersionNumber,
          title: existingStory.title,
          discoveryContext: existingStory.discoveryContext,
          journeyNarrative: existingStory.journeyNarrative,
          historicalIndicators: existingStory.historicalIndicators,
          historicalIndicatorsDetails: existingStory.historicalIndicatorsDetails,
          evidenceTypes: existingStory.evidenceTypes,
          safeVisuals: existingStory.safeVisuals,
          personalReflection: existingStory.personalReflection,
          culturalInsights: existingStory.culturalInsights,
          publishStatus: existingStory.publishStatus,
          editedBy: session.userId,
          changeDescription: changeDescription || 'Story updated',
        },
      })

      return await tx.yatraStory.update({
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
    })

    await invalidatePattern(`${CACHE_KEYS.YATRA_STORY}${id}*`)
    await invalidatePattern(`${CACHE_KEYS.YATRA_STORIES}*`)

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

    if (
      existingStory.userId !== session.userId &&
      session.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'You can only delete your own stories' },
        { status: 403 }
      )
    }

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
