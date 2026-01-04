import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/yatra/[id]/versions
 * Get all versions of a Yatra story
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const storyId = params.id;

    // Get the story to check ownership
    const story = await prisma.yatraStory.findUnique({
      where: { id: storyId },
      select: { userId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Only allow story owner or admin to view version history
    if (story.userId !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all versions
    const versions = await prisma.yatraStoryVersion.findMany({
      where: { storyId },
      orderBy: { versionNumber: 'desc' },
      select: {
        id: true,
        versionNumber: true,
        title: true,
        changeDescription: true,
        editedBy: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error fetching version history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}
