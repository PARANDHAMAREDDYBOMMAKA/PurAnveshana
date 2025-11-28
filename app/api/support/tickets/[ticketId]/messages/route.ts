import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    if (ticket.userId !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const isAdminReply = session.role === 'admin'

    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId,
        userId: session.userId,
        message,
        isAdminReply,
      },
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
    })

    await prisma.supportTicket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: isAdminReply ? 'WAITING_FOR_CUSTOMER' : 'IN_PROGRESS',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: newMessage,
    })
  } catch (error: any) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ticketId } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }

    if (ticket.userId !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const messages = await prisma.supportMessage.findMany({
      where: {
        ticketId,
      },
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
    })

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error: any) {
    console.error('Fetch messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}
