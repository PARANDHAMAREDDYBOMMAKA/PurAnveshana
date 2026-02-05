import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { sendPaymentNotificationEmail } from '@/lib/email'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: session.userId },
      })
    )

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isAdmin = profile.role === 'admin'

    const payments = await withRetry(() =>
      prisma.payment.findMany({
        where: isAdmin ? {} : { userId: profile.id },
        orderBy: { createdAt: 'desc' },
      })
    )

    return NextResponse.json({
      success: true,
      payments: payments || [],
    })
  } catch (error: any) {
    console.error('Error in GET /api/payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments', details: error.message },
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

    const profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: session.userId },
      })
    )

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { userId, heritageSiteId, amount, paymentMethod, transactionId, notes } = body

    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, amount' },
        { status: 400 }
      )
    }

    const payment = await withRetry(() =>
      prisma.payment.create({
        data: {
          userId,
          heritageSiteId: heritageSiteId || null,
          amount: parseFloat(amount),
          status: 'COMPLETED',
          paymentMethod: paymentMethod || 'Bank Transfer',
          transactionId: transactionId || null,
          notes: notes || null,
          paidAt: new Date(),
        },
      })
    )

    if (heritageSiteId) {
      await withRetry(() =>
        prisma.heritageSite.update({
          where: { id: heritageSiteId },
          data: { paymentStatus: 'COMPLETED' },
        })
      )
    }

    const userProfile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: userId },
        select: { email: true },
      })
    )

    if (userProfile?.email) {
      await sendPaymentNotificationEmail(
        userProfile.email,
        parseFloat(amount),
        paymentMethod || 'Bank Transfer',
        transactionId || undefined
      )
    }

    return NextResponse.json({ success: true, data: payment })
  } catch (error: any) {
    console.error('Error in POST /api/payments:', error)
    return NextResponse.json(
      { error: 'Failed to create payment', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await withRetry(() =>
      prisma.profile.findUnique({
        where: { id: session.userId },
      })
    )

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (profile.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 })
    }

    const body = await request.json()
    const { siteId, paymentStatus, resetAmount } = body

    if (!siteId || !paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields: siteId, paymentStatus' },
        { status: 400 }
      )
    }

    if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      )
    }

    if (resetAmount && paymentStatus === 'NOT_STARTED') {
      await withRetry(() =>
        prisma.payment.deleteMany({
          where: { heritageSiteId: siteId },
        })
      )
    }

    const updatedSite = await withRetry(() =>
      prisma.heritageSite.update({
        where: { id: siteId },
        data: { paymentStatus },
      })
    )

    return NextResponse.json({ success: true, data: updatedSite })
  } catch (error: any) {
    console.error('Error in PUT /api/payments:', error)
    return NextResponse.json(
      { error: 'Failed to update payment status', details: error.message },
      { status: 500 }
    )
  }
}
