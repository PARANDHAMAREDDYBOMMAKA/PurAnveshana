import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { invalidatePattern, CACHE_KEYS } from '@/lib/redis';

/**
 * GET /api/yatra/[id]/versions/[versionId]
 * Get a specific version of a Yatra story
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const { id: storyId, versionId } = params;

    // Get the story to check ownership
    const story = await prisma.yatraStory.findUnique({
      where: { id: storyId },
      select: { userId: true },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Only allow story owner or admin
    if (story.userId !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the specific version
    const version = await prisma.yatraStoryVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.storyId !== storyId) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/yatra/[id]/versions/[versionId]/restore
 * Restore a Yatra story to a specific version
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const { id: storyId, versionId } = params;

    // Get the story to check ownership
    const story = await prisma.yatraStory.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Only allow story owner or admin
    if (story.userId !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the version to restore
    const version = await prisma.yatraStoryVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.storyId !== storyId) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    // Save current state as a new version before restoring
    const latestVersion = await prisma.yatraStoryVersion.findFirst({
      where: { storyId },
      orderBy: { versionNumber: 'desc' },
      select: { versionNumber: true },
    });

    const nextVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    await prisma.$transaction(async (tx) => {
      // Create version from current state
      await tx.yatraStoryVersion.create({
        data: {
          storyId: story.id,
          versionNumber: nextVersionNumber,
          title: story.title,
          discoveryContext: story.discoveryContext,
          journeyNarrative: story.journeyNarrative,
          historicalIndicators: story.historicalIndicators,
          historicalIndicatorsDetails: story.historicalIndicatorsDetails,
          evidenceTypes: story.evidenceTypes,
          safeVisuals: story.safeVisuals,
          personalReflection: story.personalReflection,
          culturalInsights: story.culturalInsights,
          publishStatus: story.publishStatus,
          editedBy: session.userId,
          changeDescription: `Restored to version ${version.versionNumber}`,
        },
      });

      // Restore the story to the selected version
      await tx.yatraStory.update({
        where: { id: storyId },
        data: {
          title: version.title,
          discoveryContext: version.discoveryContext,
          journeyNarrative: version.journeyNarrative,
          historicalIndicators: version.historicalIndicators,
          historicalIndicatorsDetails: version.historicalIndicatorsDetails,
          evidenceTypes: version.evidenceTypes,
          safeVisuals: version.safeVisuals,
          personalReflection: version.personalReflection,
          culturalInsights: version.culturalInsights,
        },
      });
    });

    // Invalidate cache for this story
    await invalidatePattern(`${CACHE_KEYS.YATRA_STORY}${storyId}*`);
    await invalidatePattern(`${CACHE_KEYS.YATRA_STORIES}*`);

    return NextResponse.json({
      success: true,
      message: `Story restored to version ${version.versionNumber}`,
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
