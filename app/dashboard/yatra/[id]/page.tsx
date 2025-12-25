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

  const isOwnStory = story.userId === session.userId

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
    author: author || { id: story.userId, name: 'Unknown' },
    culturalInsights: story.culturalInsights || '',
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
    heritageSite: {
      ...story.heritageSite,
      description: '',
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <YatraStoryDetail story={storyWithAuthor} currentUserId={session.userId} isOwnStory={isOwnStory} />
    </div>
  )
}
