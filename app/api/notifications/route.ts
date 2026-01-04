import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { getCached, setCached, invalidatePattern, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

/**
 * GET /api/notifications
 * Get all notifications for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Try to get from cache
    const cacheKey = `${CACHE_KEYS.NOTIFICATIONS}${session.userId}:${unreadOnly}:${limit}:${offset}`;
    const cached = await getCached<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const whereClause = unreadOnly
      ? { userId: session.userId, isRead: false }
      : { userId: session.userId };

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({
        where: { userId: session.userId, isRead: false },
      }),
    ]);

    const response = { notifications, unreadCount };

    // Cache for short duration
    await setCached(cacheKey, response, CACHE_TTL.SHORT);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete all read notifications for the user
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: {
        userId: session.userId,
        isRead: true,
      },
    });

    // Invalidate cache
    await invalidatePattern(`${CACHE_KEYS.NOTIFICATIONS}${session.userId}*`);

    return NextResponse.json({
      success: true,
      message: 'Read notifications deleted',
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
