'use client'

import { useState, useCallback, useEffect } from 'react'
import HeritageSiteCard from './HeritageSiteCard'
import ImageUploadForm from './ImageUploadForm'
import PaymentHistory from './PaymentHistory'
import YatraPromptModal from './YatraPromptModal'
import { defaultHeritageSites } from '@/lib/defaultHeritageSites'

interface DashboardClientProps {
  images: any[]
  isAdmin: boolean
  onUploadSuccess?: () => void
}

export default function DashboardClient({ images: initialSites, isAdmin, onUploadSuccess }: DashboardClientProps) {
  const displaySites = !isAdmin && (!initialSites || initialSites.length === 0)
    ? defaultHeritageSites
    : initialSites

  const [sites, setSites] = useState(displaySites)
  const [paymentFilter, setPaymentFilter] = useState<string>('')

  // Update sites state when initialSites prop changes
  useEffect(() => {
    const newDisplaySites = !isAdmin && (!initialSites || initialSites.length === 0)
      ? defaultHeritageSites
      : initialSites
    setSites(newDisplaySites)
  }, [initialSites, isAdmin])

  const handleUploadComplete = useCallback(() => {
    if (onUploadSuccess) {
      onUploadSuccess()
    }
  }, [onUploadSuccess])

  const isShowingDefaults = !isAdmin && (!initialSites || initialSites.length === 0)

  const filteredSites = paymentFilter
    ? sites.filter((site: any) => site.paymentStatus === paymentFilter)
    : sites

  const statsSource = isShowingDefaults ? [] : initialSites
  const totalImages = statsSource?.reduce((acc, site) => acc + (site.images?.length || 0), 0) || 0
  const verifiedImages = statsSource?.reduce((acc, site) =>
    acc + (site.images?.filter((img: any) => img.isVerified).length || 0), 0
  ) || 0

  return (
    <>
      {/* Yatra Prompt Modal - Only for non-admin users */}
      {!isAdmin && <YatraPromptModal />}

      {/* Statistics Cards - Enhanced Responsive Grid */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-linear-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs md:text-sm font-semibold opacity-90 mb-1 truncate">Total Heritage Sites</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{sites?.length || 0}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-2.5 md:p-3 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs opacity-75 truncate">{totalImages} images documented</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs md:text-sm font-semibold opacity-90 mb-1 truncate">Verified Images</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{verifiedImages}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-2.5 md:p-3 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs opacity-75 truncate">{totalImages > 0 ? Math.round((verifiedImages / totalImages) * 100) : 0}% verification rate</p>
        </div>

        <div className="bg-linear-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 min-[500px]:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs md:text-sm font-semibold opacity-90 mb-1 truncate">Total Images</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold">{totalImages}</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-2.5 md:p-3 rounded-lg shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs opacity-75 truncate">Across all heritage sites</p>
        </div>
      </div>

      {!isAdmin && (
        <div className="mb-6 sm:mb-8">
          <PaymentHistory />
        </div>
      )}

      {/* Upload Form - Responsive (Hidden for Admin) */}
      {!isAdmin && (
        <div className="mb-8 sm:mb-12">
          <ImageUploadForm onUploadComplete={handleUploadComplete} />
        </div>
      )}

      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isAdmin
              ? 'All Heritage Sites'
              : isShowingDefaults
                ? 'Example Heritage Sites - Get Inspired!'
                : 'Your Heritage Sites'}
          </h2>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <label htmlFor="paymentFilter" className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Filter by Payment:
              </label>
              <select
                id="paymentFilter"
                className="px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium text-slate-900 bg-white"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="">All Sites</option>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed (Paid)</option>
              </select>
              {paymentFilter && (
                <button
                  onClick={() => setPaymentFilter('')}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
        {isShowingDefaults && (
          <p className="text-sm text-slate-600 mb-4">
            These are example heritage sites to inspire you. Upload your first site to start documenting your discoveries!
          </p>
        )}
        {isAdmin && paymentFilter && (
          <p className="text-sm text-slate-600">
            Showing {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} with payment status: {paymentFilter === 'NOT_STARTED' ? 'Not Started' : paymentFilter === 'IN_PROGRESS' ? 'In Progress' : 'Completed (Paid)'}
          </p>
        )}
      </div>

      {filteredSites && filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredSites.map((site: any) => (
            <HeritageSiteCard
              key={site.id}
              site={site}
              showUser={isAdmin}
              isOwner={!isAdmin && !isShowingDefaults}
              onUpdate={onUploadSuccess}
              userId={site.userId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow-md border border-orange-100">
          <svg
            className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-orange-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm sm:text-base font-bold text-slate-900">No heritage sites yet</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium px-4">
            {isAdmin
              ? 'No sites have been documented yet.'
             : 'Get started by documenting your first heritage site.'}
          </p>
        </div>
      )}
    </>
  )
}
