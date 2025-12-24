import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import YatraStoryDetail from '@/components/YatraStoryDetail'

export default async function YatraStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const { id } = await params

  // Fetch the Yatra story
  const story = await withRetry(() =>
    prisma.yatraStory.findUnique({
      where: { id },
      include: {
        heritageSite: {
          select: {
            id: true,
            title: true,
            type: true,
            images: {
              select: {
                id: true,
                r2Url: true,
                cloudinaryUrl: true,
                location: true,
                gpsLatitude: true,
                gpsLongitude: true,
              },
            },
          },
        },
      },
    })
  )

  if (!story) {
    redirect('/dashboard/yatra')
  }

  // All logged-in users can view all Yatra stories
  // No access restrictions based on publish status
  const isOwnStory = story.userId === session.userId

  // Fetch author details
  const author = await withRetry(() =>
    prisma.profile.findUnique({
      where: { id: story.userId },
      select: {
        id: true,
        name: true,
      },
    })
  )

  const storyWithAuthor = {
    ...story,
    author: author || { id: story.userId, name: 'Unknown' }, // Provide default if author not found
    culturalInsights: story.culturalInsights || '', // Provide default for nullable field
    createdAt: story.createdAt.toISOString(), // Convert Date to string
    updatedAt: story.updatedAt.toISOString(), // Convert Date to string
    heritageSite: {
      ...story.heritageSite,
      description: '', // Add empty description for backwards compatibility
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <YatraStoryDetail story={storyWithAuthor} currentUserId={session.userId} isOwnStory={isOwnStory} />
    </div>
  )
}
