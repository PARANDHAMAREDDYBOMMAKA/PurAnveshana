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
      select: {
        id: true,
        userId: true,
        heritageSiteId: true,
        title: true,
        discoveryContext: true,
        journeyNarrative: true,
        historicalIndicators: true,
        historicalIndicatorsDetails: true,
        evidenceTypes: true,
        safeVisuals: true,
        personalReflection: true,
        submissionConfirmed: true,
        publishStatus: true,
        culturalInsights: true,
        createdAt: true,
        updatedAt: true,
        heritageSite: {
          select: {
            id: true,
            title: true,
            type: true,
            description: true,
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
    id: story.id,
    userId: story.userId,
    heritageSiteId: story.heritageSiteId,
    title: story.title,
    discoveryContext: story.discoveryContext,
    journeyNarrative: story.journeyNarrative,
    historicalIndicators: story.historicalIndicators,
    historicalIndicatorsDetails: story.historicalIndicatorsDetails,
    evidenceTypes: story.evidenceTypes,
    safeVisuals: story.safeVisuals,
    personalReflection: story.personalReflection,
    submissionConfirmed: story.submissionConfirmed,
    publishStatus: story.publishStatus,
    culturalInsights: story.culturalInsights || '',
    createdAt: story.createdAt.toISOString(),
    updatedAt: story.updatedAt.toISOString(),
    author: author || { id: story.userId, name: 'Unknown' },
    heritageSite: story.heritageSite,
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <YatraStoryDetail story={storyWithAuthor} currentUserId={session.userId} />
    </div>
  )
}
