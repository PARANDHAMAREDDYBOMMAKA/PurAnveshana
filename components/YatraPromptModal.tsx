'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface HeritageSite {
  id: string
  title: string
  type: string | null
  images: {
    r2Url: string | null
    cloudinaryUrl: string | null
    location: string
  }[]
}

export default function YatraPromptModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [sites, setSites] = useState<HeritageSite[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkUnpromptedSites()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const checkUnpromptedSites = async () => {
    try {
      const response = await fetch('/api/yatra/check-unprompted')
      if (response.ok) {
        const data = await response.json()
        if (data.hasUnpromptedSites && data.sites.length > 0) {
          setSites(data.sites)
          setSelectedSite(data.sites[0])
          setIsOpen(true)
        }
      }
    } catch (error) {
      console.error('Error checking unprompted sites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShareStory = () => {
    if (selectedSite) {
      // Navigate to the Yatra creation page with the site ID
      router.push(`/dashboard/yatra/create?siteId=${selectedSite.id}`)
      setIsOpen(false)
    }
  }

  const handleSkip = () => {
    // Just close the modal - user can share stories later from Yatra page
    setIsOpen(false)
    // Show a helpful message
    toast.success('You can share your journey anytime from the Yatra section', {
      duration: 4000,
    })
  }

  if (loading || !isOpen || !selectedSite) {
    return null
  }

  const imageUrl = selectedSite.images[0]?.r2Url || selectedSite.images[0]?.cloudinaryUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-4 rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header Section */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 px-4 py-6 sm:px-6 sm:py-8 text-white">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-1.5 sm:mb-2">
              Share Your Discovery Journey
            </h2>
            <p className="text-orange-50 text-sm sm:text-base leading-relaxed">
              Congratulations on your payment! We'd love to hear about your journey discovering this heritage site.
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Site Preview Card */}
          <div className="mb-5 sm:mb-6 rounded-xl border-2 border-slate-100 overflow-hidden hover:border-orange-200 transition-colors">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-3 sm:p-4">
              {imageUrl && (
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img
                    src={imageUrl}
                    alt={selectedSite.title}
                    className="h-32 w-32 sm:h-28 sm:w-28 rounded-lg object-cover ring-2 ring-slate-100"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-orange-500/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md text-center shadow-lg">
                    {selectedSite.type || 'ARTIFACT_FOUND'}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {selectedSite.title}
                </h3>
                {selectedSite.images[0]?.location && (
                  <div className="flex items-start gap-2 text-sm text-slate-600 justify-center sm:justify-start">
                    <svg className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-2 text-left">{selectedSite.images[0].location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="mb-5 sm:mb-6 rounded-xl bg-linear-to-br from-orange-50 to-amber-50 border border-orange-100 p-4 sm:p-5">
            <h4 className="font-bold text-slate-900 mb-2.5 sm:mb-3 text-sm sm:text-base">
              Share your story about:
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>How you discovered or found this heritage site</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Your journey and experience reaching the location</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Historical or cultural insights you learned</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-700">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Any interesting stories or local legends</span>
              </li>
            </ul>
          </div>

          {sites.length > 1 && (
            <div className="mb-4 sm:mb-5 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 text-slate-700 rounded-full text-xs sm:text-sm font-medium">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">You have {sites.length} sites waiting for stories</span>
                <span className="sm:hidden">{sites.length} sites waiting</span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              onClick={handleShareStory}
              className="flex-1 rounded-xl bg-orange-500 px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/40 active:scale-[0.98]"
            >
              Share My Story Now
            </button>
            <button
              onClick={handleSkip}
              className="sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl border-2 border-slate-200 text-sm sm:text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
            >
              Later
            </button>
          </div>

          <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-slate-500 leading-relaxed px-2 sm:px-0">
            Find all your sites in the Yatra section to share stories anytime
          </p>
        </div>
      </div>
    </div>
  )
}
