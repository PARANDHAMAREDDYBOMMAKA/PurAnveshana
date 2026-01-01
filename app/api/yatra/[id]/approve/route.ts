import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { withRetry } from '@/lib/db-utils'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can approve stories
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { action } = await request.json()

    if (!action || !['approve', 'feature', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, feature, or reject' },
        { status: 400 }
      )
    }

    const { id } = await params

    const story = await withRetry(() =>
      prisma.yatraStory.findUnique({
        where: { id },
      })
    )

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 })
    }

    let newStatus = 'PENDING_REVIEW'
    if (action === 'approve') {
      newStatus = 'APPROVED_PUBLIC'
    } else if (action === 'feature') {
      newStatus = 'FEATURED_YATRA'
    } else if (action === 'reject') {
      newStatus = 'PENDING_REVIEW'
    }

    const updatedStory = await withRetry(() =>
      prisma.yatraStory.update({
        where: { id },
        data: {
          publishStatus: newStatus,
        },
      })
    )

    return NextResponse.json({
      success: true,
      story: updatedStory,
      message: `Story ${action === 'reject' ? 'rejected' : action === 'feature' ? 'featured' : 'approved'} successfully`,
    })
  } catch (error: any) {
    console.error('Error updating story status:', error)
    return NextResponse.json(
      { error: 'Failed to update story status', details: error.message },
      { status: 500 }
    )
  }
}
