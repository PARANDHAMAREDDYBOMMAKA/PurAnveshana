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
    toast('You can share your journey anytime from the Yatra section', {
      icon: '🗺️',
      duration: 4000,
    })
  }

  if (loading || !isOpen || !selectedSite) {
    return null
  }

  const imageUrl = selectedSite.images[0]?.r2Url || selectedSite.images[0]?.cloudinaryUrl

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Share Your Discovery Journey! 🗺️
          </h2>
          <p className="mt-2 text-gray-600">
            Congratulations on your payment! We'd love to hear about your journey discovering this heritage site.
          </p>
        </div>

        {/* Site Preview */}
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <div className="flex gap-4">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={selectedSite.title}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {selectedSite.title}
              </h3>
              <p className="text-sm text-gray-500">{selectedSite.type}</p>
              {selectedSite.images[0]?.location && (
                <p className="text-sm text-gray-600">
                  📍 {selectedSite.images[0].location}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <h4 className="mb-2 font-semibold text-blue-900">
            Share your story about:
          </h4>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• How you discovered or found this heritage site</li>
            <li>• Your journey and experience reaching the location</li>
            <li>• Historical or cultural insights you learned</li>
            <li>• Any interesting stories or local legends</li>
          </ul>
        </div>

        {sites.length > 1 && (
          <p className="mb-4 text-center text-sm text-gray-500">
            You have {sites.length} paid sites to share stories about
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleShareStory}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Share My Story Now
          </button>
          <button
            onClick={handleSkip}
            className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Later
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500">
          Find all your paid sites in the Yatra section to share stories anytime
        </p>
      </div>
    </div>
  )
}
