'use client'

import { useState } from 'react'
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

interface YatraCreateFormProps {
  paidSites: HeritageSite[]
  selectedSiteId: string | null
}

export default function YatraCreateForm({
  paidSites,
  selectedSiteId,
}: YatraCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    heritageSiteId: selectedSiteId || (paidSites.length > 0 ? paidSites[0].id : ''),
    title: '',
    journeyNarrative: '',
    culturalInsights: '',
  })

  const selectedSite = paidSites.find((site) => site.id === formData.heritageSiteId)
  const imageUrl = selectedSite?.images[0]?.r2Url || selectedSite?.images[0]?.cloudinaryUrl

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.heritageSiteId || !formData.title || !formData.journeyNarrative || !formData.culturalInsights) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.title.length < 10) {
      toast.error('Title must be at least 10 characters')
      return
    }

    if (formData.journeyNarrative.length < 100) {
      toast.error('Journey narrative must be at least 100 characters')
      return
    }

    if (formData.culturalInsights.length < 50) {
      toast.error('Cultural insights must be at least 50 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/yatra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Yatra story created successfully!')
        router.push('/dashboard/yatra')
      } else {
        toast.error(data.error || 'Failed to create story')
      }
    } catch (error) {
      console.error('Error creating story:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Heritage Site Selection */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Heritage Site <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.heritageSiteId}
          onChange={(e) =>
            setFormData({ ...formData, heritageSiteId: e.target.value })
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={selectedSiteId !== null}
        >
          {paidSites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.title}{site.type ? ` (${site.type})` : ''}
            </option>
          ))}
        </select>

        {/* Site Preview */}
        {selectedSite && (
          <div className="mt-4 rounded-lg border border-gray-200 p-4">
            <div className="flex gap-4">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={selectedSite.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {selectedSite.title}
                </h4>
                <p className="text-sm text-gray-500">{selectedSite.type}</p>
                {selectedSite.images[0]?.location && (
                  <p className="text-sm text-gray-600">
                    📍 {selectedSite.images[0].location}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Story Title */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Story Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., The Hidden Temple of the Western Ghats"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          maxLength={200}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/200 characters (minimum 10)
        </p>
      </div>

      {/* Journey Narrative */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Journey Narrative <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-sm text-gray-600">
          Share how you discovered this place, your journey to reach it, and your experience exploring it.
        </p>
        <textarea
          value={formData.journeyNarrative}
          onChange={(e) =>
            setFormData({ ...formData, journeyNarrative: e.target.value })
          }
          placeholder="Tell your discovery story... How did you learn about this site? What was the journey like? What challenges did you face? What made the experience memorable?"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={8}
          maxLength={5000}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.journeyNarrative.length}/5000 characters (minimum 100)
        </p>
      </div>

      {/* Cultural Insights */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Historical & Cultural Insights <span className="text-red-500">*</span>
        </label>
        <p className="mb-2 text-sm text-gray-600">
          Share what you learned about the historical significance, cultural context, architectural features, or local legends associated with this site.
        </p>
        <textarea
          value={formData.culturalInsights}
          onChange={(e) =>
            setFormData({ ...formData, culturalInsights: e.target.value })
          }
          placeholder="Share your insights... What is the historical background? Are there any interesting cultural or religious aspects? What architectural features stand out? Did you learn any local legends or stories?"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 font-medium placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={8}
          maxLength={5000}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.culturalInsights.length}/5000 characters (minimum 50)
        </p>
      </div>

      {/* Tips Section */}
      <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
        <h4 className="mb-2 font-semibold text-blue-900">Writing Tips:</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Be descriptive and engaging - help others visualize your journey</li>
          <li>• Share practical details that could help future explorers</li>
          <li>• Include any interesting conversations with locals</li>
          <li>• Mention the best time to visit or any permissions required</li>
          <li>• Add context about the site's significance and preservation needs</li>
        </ul>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-linear-to-r from-orange-500 to-amber-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Story'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-lg border-2 border-gray-300 px-6 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <p className="text-center text-xs text-gray-500">
        Your story will be published immediately and visible to all users
      </p>
    </form>
  )
}
