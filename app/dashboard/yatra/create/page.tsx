import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { withRetry } from '@/lib/db-utils'
import YatraCreateForm from '@/components/YatraCreateForm'

export default async function CreateYatraPage({
  searchParams,
}: {
  searchParams: { siteId?: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user's paid heritage sites (for site selection dropdown)
  const paidSites = await withRetry(() =>
    prisma.heritageSite.findMany({
      where: {
        userId: session.userId,
        paymentStatus: 'COMPLETED',
        yatraStory: null, // Only sites without existing stories
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

  // If siteId is provided in query params, get that specific site
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
              You don't have any paid heritage sites without Yatra stories yet.
            </p>
            <p className="text-sm text-gray-500">
              Once you receive payment for your submissions, you'll be able to share your discovery journey here.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header with Logo and Back Button */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="bg-linear-to-br from-orange-500 to-amber-600 p-2 rounded-lg shadow-sm shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base sm:text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent truncate">
                Puranveshana
              </h2>
              <span className="text-xs text-orange-600 font-medium notranslate" translate="no">
                पुरातन अन्वेषण
              </span>
            </div>
          </div>
          {/* Back Button - Top Right */}
          <a
            href="/dashboard/yatra"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Yatra</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Share Your Discovery Journey
          </h1>
          <p className="mt-2 text-gray-600">
            Tell the world about how you found this heritage site and what you learned
          </p>
        </div>

        <YatraCreateForm
          paidSites={paidSites}
          selectedSiteId={selectedSiteId || null}
        />
      </div>
    </div>
  )
}
