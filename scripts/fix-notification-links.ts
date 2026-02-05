import { prisma } from '@/lib/prisma';

async function fixNotificationLinks() {
  console.log('Starting notification link fix...');

  try {
    // Get all notifications with relatedId (story-related notifications)
    const notifications = await prisma.notification.findMany({
      where: {
        relatedId: {
          not: null,
        },
        type: {
          in: ['COMMENT', 'COMMENT_REPLY', 'LIKE', 'STORY_APPROVED', 'STORY_FEATURED', 'STORY_REJECTED']
        }
      },
      select: {
        id: true,
        relatedId: true,
        link: true,
      }
    });

    console.log(`Found ${notifications.length} story-related notifications`);

    // Update each notification to use the new link format
    let updated = 0;
    for (const notification of notifications) {
      if (notification.relatedId) {
        const newLink = `/dashboard/yatra?storyId=${notification.relatedId}`;

        // Only update if the link is different
        if (notification.link !== newLink) {
          await prisma.notification.update({
            where: { id: notification.id },
            data: { link: newLink }
          });
          updated++;
        }
      }
    }

    console.log(`Updated ${updated} notification links`);
    console.log('Migration complete!');
  } catch (error) {
    console.error('Error fixing notification links:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixNotificationLinks();
