import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import YatraGallery from '@/components/YatraGallery'
import YatraPendingBanner from '@/components/YatraPendingBanner'

export default async function YatraPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const isAdmin = session.role === 'admin'

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
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
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-3 py-2 sm:px-4 text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50 shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </a>
        </div>

        <div className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-bold text-gray-900">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Yatra - Discovery Journeys
          </h1>
          <p className="mt-2 text-gray-600">
            {isAdmin
              ? 'View all discovery stories from the community'
              : 'Your discovery stories and journey experiences'}
          </p>
        </div>

        {/* Show pending banner only for non-admin users */}
        {!isAdmin && <YatraPendingBanner />}

        <YatraGallery userId={session.userId} isAdmin={isAdmin} />
      </div>
    </div>
  )
}
