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
    // Only check for unprompted sites if we haven't shown the modal in this session
    const hasShownModal = localStorage.getItem('yatraPromptShown')
    if (!hasShownModal) {
      checkUnpromptedSites()
    } else {
      setLoading(false)
    }
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
          // Mark that we've shown the modal in this session
          localStorage.setItem('yatraPromptShown', 'true')
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
      <div
        className="relative w-full max-w-2xl my-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 8px 40px rgba(139, 90, 43, 0.2)' }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>

        {/* Corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30 z-10"></div>
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30 z-10"></div>
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30 z-10"></div>
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30 z-10"></div>

        {/* Header Section */}
        <div className="px-5 pt-7 pb-5 sm:px-8 sm:pt-8 sm:pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-800 p-2.5 rounded-xl shadow-lg shadow-amber-900/30">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                Share Your Discovery Journey
              </h2>
            </div>
          </div>
          <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Congratulations on your payment! We&apos;d love to hear about your journey discovering this heritage site.
          </p>
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-8">
          {/* Site Preview Card */}
          <div
            className="mb-5 sm:mb-6 rounded-xl border border-amber-200/60 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-3 sm:p-4">
              {imageUrl && (
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img
                    src={imageUrl}
                    alt={selectedSite.title}
                    className="h-32 w-32 sm:h-28 sm:w-28 rounded-lg object-cover ring-2 ring-amber-200/60"
                  />
                  <div className="absolute bottom-2 left-2 right-2 bg-amber-800/90 backdrop-blur-sm text-amber-50 text-[10px] font-bold px-2 py-1 rounded-md text-center shadow-lg">
                    {selectedSite.type || 'ARTIFACT_FOUND'}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {selectedSite.title}
                </h3>
                {selectedSite.images[0]?.location && (
                  <div className="flex items-start gap-2 text-sm text-amber-800/70 justify-center sm:justify-start">
                    <svg className="w-4 h-4 mt-0.5 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="mb-5 sm:mb-6 rounded-xl border border-amber-200/60 p-4 sm:p-5" style={{ background: 'linear-gradient(145deg, #fef9f0 0%, #fdf5e6 100%)' }}>
            <h4 className="font-bold text-amber-900 mb-2.5 sm:mb-3 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>
              Share your story about:
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {[
                'How you discovered or found this heritage site',
                'Your journey and experience reaching the location',
                'Historical or cultural insights you learned',
                'Any interesting stories or local legends',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-amber-800/80">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {sites.length > 1 && (
            <div className="mb-4 sm:mb-5 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-amber-100/80 text-amber-800 rounded-full text-xs sm:text-sm font-medium border border-amber-200/60">
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
              className="flex-1 rounded-xl bg-amber-800 px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-amber-50 shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-900 active:scale-[0.98]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Share My Story Now
            </button>
            <button
              onClick={handleSkip}
              className="sm:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl border border-amber-200/60 text-sm sm:text-base font-semibold text-amber-800 transition-all hover:bg-amber-50 hover:border-amber-300 active:scale-[0.98]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Later
            </button>
          </div>

          <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-amber-800/60 leading-relaxed px-2 sm:px-0" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Find all your sites in the Yatra section to share stories anytime
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent"></div>
      </div>
    </div>
  )
}
