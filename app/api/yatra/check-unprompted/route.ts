import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unpromptedSites = await withRetry(() =>
      prisma.heritageSite.findMany({
        where: {
          userId: session.userId,
          paymentStatus: {
            in: ['COMPLETED', 'IN_PROGRESS']
          },
          yatraStoryPrompted: false,
          yatraStory: null,
        },
        select: {
          id: true,
          title: true,
          type: true,
          images: {
            select: {
              r2Url: true,
              cloudinaryUrl: true,
              location: true,
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    )

    return NextResponse.json({
      hasUnpromptedSites: unpromptedSites.length > 0,
      sites: unpromptedSites,
    })
  } catch (error: any) {
    console.error('Error checking unprompted sites:', error)
    return NextResponse.json(
      { error: 'Failed to check unprompted sites', details: error.message },
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
    const { heritageSiteId } = body

    if (!heritageSiteId) {
      return NextResponse.json(
        { error: 'Heritage site ID is required' },
        { status: 400 }
      )
    }

    const site = await withRetry(() =>
      prisma.heritageSite.findUnique({
        where: { id: heritageSiteId },
      })
    )

    if (!site) {
      return NextResponse.json(
        { error: 'Heritage site not found' },
        { status: 404 }
      )
    }

    if (site.userId !== session.userId) {
      return NextResponse.json(
        { error: 'This site does not belong to you' },
        { status: 403 }
      )
    }

    await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: heritageSiteId },
        data: { yatraStoryPrompted: true },
      })
    )

    return NextResponse.json({
      success: true,
      message: 'Site marked as prompted',
    })
  } catch (error: any) {
    console.error('Error marking site as prompted:', error)
    return NextResponse.json(
      { error: 'Failed to mark site as prompted', details: error.message },
      { status: 500 }
    )
  }
}
