import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: session.userId },
    })

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userCount = await prisma.profile.count({
      where: {
        role: 'user'
      }
    })

    return NextResponse.json({
      success: true,
      count: userCount,
    })
  } catch (error: any) {
    console.error('User count fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user count' },
      { status: 500 }
    )
  }
}
