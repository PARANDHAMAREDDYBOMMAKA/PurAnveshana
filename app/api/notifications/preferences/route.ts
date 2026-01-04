import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/notifications/preferences
 * Get notification preferences for the user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let preferences = await prisma.notificationPreference.findUnique({
      where: { userId: session.userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.notificationPreference.create({
        data: {
          userId: session.userId,
        },
      });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences for the user
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      emailComments,
      emailLikes,
      emailStoryApproval,
      emailStoryFeatured,
      pushComments,
      pushLikes,
      pushStoryApproval,
      pushStoryFeatured,
    } = body;

    const preferences = await prisma.notificationPreference.upsert({
      where: { userId: session.userId },
      update: {
        emailComments,
        emailLikes,
        emailStoryApproval,
        emailStoryFeatured,
        pushComments,
        pushLikes,
        pushStoryApproval,
        pushStoryFeatured,
      },
      create: {
        userId: session.userId,
        emailComments,
        emailLikes,
        emailStoryApproval,
        emailStoryFeatured,
        pushComments,
        pushLikes,
        pushStoryApproval,
        pushStoryFeatured,
      },
    });

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
