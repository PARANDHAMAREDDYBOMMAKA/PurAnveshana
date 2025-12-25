import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import YatraWizard from '@/components/YatraWizard'

export default async function EditYatraPage({
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
    })
  )

  if (!story) {
    redirect('/dashboard/yatra')
  }

  if (story.userId !== session.userId) {
    redirect('/dashboard/yatra')
  }

  const heritageSite = await withRetry(() =>
    prisma.heritageSite.findUnique({
      where: { id: story.heritageSiteId },
      select: {
        id: true,
        title: true,
        type: true,
        images: {
          select: {
            r2Url: true,
            cloudinaryUrl: true,
            location: true,
          },
          take: 1,
        },
      },
    })
  )

  if (!heritageSite) {
    redirect('/dashboard/yatra')
  }

  const initialData = {
    id: story.id,
    heritageSiteId: story.heritageSiteId,
    title: story.title,
    discoveryContext: story.discoveryContext || '',
    journeyNarrative: story.journeyNarrative,
    historicalIndicators: story.historicalIndicators,
    historicalIndicatorsDetails: story.historicalIndicatorsDetails,
    evidenceTypes: story.evidenceTypes,
    safeVisuals: story.safeVisuals,
    personalReflection: story.personalReflection,
    submissionConfirmed: story.submissionConfirmed,
  }

  return (
    <YatraWizard
      paidSites={[heritageSite]}
      selectedSiteId={story.heritageSiteId}
      isEditMode={true}
      initialData={initialData}
    />
  )
}
