import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import { invalidatePattern, deleteCached, CACHE_KEYS } from '@/lib/redis'

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

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Clear all heritage site caches (both old and new formats)
    const oldAdminPattern = `${CACHE_KEYS.HERITAGE_SITES}admin:*`
    const oldUserPattern = `${CACHE_KEYS.HERITAGE_SITES}user:*`
    const newAdminKey = `${CACHE_KEYS.HERITAGE_SITES}admin`

    const [oldAdminCount, oldUserCount] = await Promise.all([
      invalidatePattern(oldAdminPattern),
      invalidatePattern(oldUserPattern),
      deleteCached(newAdminKey),
    ])

    return NextResponse.json({
      success: true,
      message: 'All heritage site caches cleared',
      cleared: {
        oldAdminKeys: oldAdminCount,
        oldUserKeys: oldUserCount,
        newAdminKey: 1,
      },
    })
  } catch (error: any) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache', details: error.message },
      { status: 500 }
    )
  }
}
