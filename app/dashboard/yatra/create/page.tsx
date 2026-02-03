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
          <div
            className="relative overflow-hidden rounded-2xl border border-amber-200/50 p-8 text-center"
            style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 8px 40px rgba(139, 90, 43, 0.12)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-600/20"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-600/20"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-600/20"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-600/20"></div>
            <div className="relative z-10">
              <div className="mb-4 text-6xl">🗺️</div>
              <h1 className="mb-2 text-2xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                No Eligible Sites
              </h1>
              <p className="mb-4 text-amber-800/70">
                You don&apos;t have any heritage sites available for Yatra Journey creation.
              </p>
              <p className="text-sm text-amber-700/60">
                Sites with payment in progress or completed are eligible. Upload a heritage site to get started!
              </p>
            </div>
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
