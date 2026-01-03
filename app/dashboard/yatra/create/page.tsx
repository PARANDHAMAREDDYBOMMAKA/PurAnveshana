import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import YatraWizard from '@/components/YatraWizard'

export default async function CreateYatraPage({
  searchParams,
}: {
  searchParams: { siteId?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const paidSites = await withRetry(() =>
    prisma.heritageSite.findMany({
      where: {
        userId: session.userId,
        paymentStatus: {
          in: ['COMPLETED', 'IN_PROGRESS']
        },
        yatraStory: null,
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    })
  )

  const selectedSiteId = searchParams.siteId
  let selectedSite = null

  if (selectedSiteId) {
    selectedSite = paidSites.find((site) => site.id === selectedSiteId)
  }

  if (paidSites.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-lg bg-white p-8 text-center shadow-lg">
            <div className="mb-4 text-6xl">🗺️</div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              No Eligible Sites
            </h1>
            <p className="mb-4 text-gray-600">
              You don't have any heritage sites available for Yatra Journey creation.
            </p>
            <p className="text-sm text-gray-500">
              Sites with payment in progress or completed are eligible. Upload a heritage site to get started!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <YatraWizard
      paidSites={paidSites}
      selectedSiteId={selectedSiteId || null}
    />
  )
}
