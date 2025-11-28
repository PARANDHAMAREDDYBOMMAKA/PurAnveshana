import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            profile: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      ticket,
    })
  } catch (error: any) {
    console.error('Get ticket error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ticket' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = await params
    const { status, priority, category } = await request.json()

    const updateData: any = {}

    if (status) {
      updateData.status = status
      if (status === 'CLOSED' || status === 'RESOLVED') {
        updateData.closedAt = new Date()
      }
    }

    if (priority) {
      updateData.priority = priority
    }

    if (category !== undefined) {
      updateData.category = category
    }

    const ticket = await prisma.supportTicket.update({
      where: {
        id: ticketId,
      },
      data: updateData,
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            profile: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      ticket,
    })
  } catch (error: any) {
    console.error('Update ticket error:', error)
    return NextResponse.json(
      { error: 'Failed to update ticket' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = await params

    await prisma.supportTicket.delete({
      where: {
        id: ticketId,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Ticket deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete ticket error:', error)
    return NextResponse.json(
      { error: 'Failed to delete ticket' },
      { status: 500 }
    )
  }
}
