import { prisma } from '@/lib/prisma';
import { invalidatePattern, CACHE_KEYS } from '@/lib/redis';

export type NotificationType =
  | 'COMMENT'
  | 'COMMENT_REPLY'
  | 'LIKE'
  | 'STORY_APPROVED'
  | 'STORY_FEATURED'
  | 'STORY_REJECTED'
  | 'SYSTEM';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  relatedId?: string;
  actorId?: string;
  actorName?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        relatedId: params.relatedId,
        actorId: params.actorId,
        actorName: params.actorName,
      },
    });

    // Invalidate user's notification cache
    await invalidatePattern(`${CACHE_KEYS.NOTIFICATIONS}${params.userId}*`);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Create notification for a new comment on a Yatra story
 */
export async function notifyStoryComment(
  storyId: string,
  storyOwnerId: string,
  commenterName: string,
  commenterId: string,
  storyTitle: string
) {
  // Don't notify if user commented on their own story
  if (storyOwnerId === commenterId) {
    return;
  }

  return createNotification({
    userId: storyOwnerId,
    type: 'COMMENT',
    title: 'New Comment on Your Story',
    message: `${commenterName} commented on your story "${storyTitle}"`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
    actorId: commenterId,
    actorName: commenterName,
  });
}

/**
 * Create notification for a reply to a comment
 */
export async function notifyCommentReply(
  storyId: string,
  originalCommenterId: string,
  replierName: string,
  replierId: string,
  storyTitle: string
) {
  // Don't notify if user replied to their own comment
  if (originalCommenterId === replierId) {
    return;
  }

  return createNotification({
    userId: originalCommenterId,
    type: 'COMMENT_REPLY',
    title: 'New Reply to Your Comment',
    message: `${replierName} replied to your comment on "${storyTitle}"`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
    actorId: replierId,
    actorName: replierName,
  });
}

/**
 * Create notification for a like on a Yatra story
 */
export async function notifyStoryLike(
  storyId: string,
  storyOwnerId: string,
  likerName: string,
  likerId: string,
  storyTitle: string
) {
  // Don't notify if user liked their own story
  if (storyOwnerId === likerId) {
    return;
  }

  return createNotification({
    userId: storyOwnerId,
    type: 'LIKE',
    title: 'Someone Liked Your Story',
    message: `${likerName} liked your story "${storyTitle}"`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
    actorId: likerId,
    actorName: likerName,
  });
}

/**
 * Create notification for story approval
 */
export async function notifyStoryApproved(
  storyId: string,
  storyOwnerId: string,
  storyTitle: string
) {
  return createNotification({
    userId: storyOwnerId,
    type: 'STORY_APPROVED',
    title: 'Your Story Was Approved!',
    message: `Your story "${storyTitle}" has been approved and is now public`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
  });
}

/**
 * Create notification for story being featured
 */
export async function notifyStoryFeatured(
  storyId: string,
  storyOwnerId: string,
  storyTitle: string
) {
  return createNotification({
    userId: storyOwnerId,
    type: 'STORY_FEATURED',
    title: 'Your Story Was Featured!',
    message: `Congratulations! Your story "${storyTitle}" has been featured`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
  });
}

/**
 * Create notification for story rejection
 */
export async function notifyStoryRejected(
  storyId: string,
  storyOwnerId: string,
  storyTitle: string,
  reason?: string
) {
  return createNotification({
    userId: storyOwnerId,
    type: 'STORY_REJECTED',
    title: 'Story Needs Revision',
    message: reason
      ? `Your story "${storyTitle}" needs revision: ${reason}`
      : `Your story "${storyTitle}" needs revision`,
    link: `/dashboard/yatra?storyId=${storyId}`,
    relatedId: storyId,
  });
}

/**
 * Get notification preferences for a user
 */
export async function getUserNotificationPreferences(userId: string) {
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  // Create default preferences if they don't exist
  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: { userId },
    });
  }

  return preferences;
}
