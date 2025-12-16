'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface YatraStory {
  id: string
  userId: string
  title: string
  journeyNarrative: string
  culturalInsights: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
  }
  heritageSite: {
    id: string
    title: string
    type: string | null
    description: string
    images: {
      id: string
      r2Url: string | null
      cloudinaryUrl: string | null
      location: string
      gpsLatitude: number | null
      gpsLongitude: number | null
    }[]
  }
}

interface YatraStoryDetailProps {
  story: YatraStory
  currentUserId: string
}

export default function YatraStoryDetail({
  story,
  currentUserId,
}: YatraStoryDetailProps) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isAuthor = story.userId === currentUserId

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/yatra/${story.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Story deleted successfully')
        router.push('/dashboard/yatra')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete story')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      toast.error('An error occurred')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const mainImage =
    story.heritageSite.images[0]?.r2Url ||
    story.heritageSite.images[0]?.cloudinaryUrl

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back Button */}
      <Link
        href="/dashboard/yatra"
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Stories
      </Link>

      {/* Main Content */}
      <div className="overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Hero Image */}
        {mainImage ? (
          <div className="relative h-96">
            <img
              src={mainImage}
              alt={story.heritageSite.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="mb-2 text-sm font-semibold opacity-90">
                {story.heritageSite.type}
              </p>
              <h1 className="text-3xl font-bold sm:text-4xl">{story.title}</h1>
            </div>
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center bg-linear-to-br from-orange-100 to-amber-100">
            <div className="text-center">
              <span className="mb-4 block text-8xl">🗺️</span>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {story.title}
              </h1>
            </div>
          </div>
        )}

        {/* Story Content */}
        <div className="p-6 sm:p-8">
          {/* Author Info */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
                {story.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {story.author.name}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(story.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {isAuthor && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Delete Story
              </button>
            )}
          </div>

          {/* Heritage Site Info */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-2 text-lg font-bold text-gray-900">
              About the Heritage Site
            </h3>
            <h4 className="mb-1 text-xl font-semibold text-orange-600">
              {story.heritageSite.title}
            </h4>
            <p className="mb-2 text-sm text-gray-500">
              {story.heritageSite.type}
            </p>
            {story.heritageSite.images[0]?.location && (
              <p className="text-sm text-gray-700">
                📍 {story.heritageSite.images[0].location}
              </p>
            )}
          </div>

          {/* Journey Narrative */}
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <span>🚶</span> The Journey
            </h2>
            <div className="prose max-w-none text-gray-700">
              {story.journeyNarrative.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Cultural Insights */}
          <div className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
              <span>📚</span> Historical & Cultural Insights
            </h2>
            <div className="prose max-w-none text-gray-700">
              {story.culturalInsights.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Image Gallery */}
          {story.heritageSite.images.length > 1 && (
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Gallery
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {story.heritageSite.images.slice(1).map((image, index) => {
                  const imageUrl = image.r2Url || image.cloudinaryUrl
                  if (!imageUrl) return null
                  return (
                    <img
                      key={image.id}
                      src={imageUrl}
                      alt={`${story.heritageSite.title} - Image ${index + 2}`}
                      className="h-48 w-full rounded-lg object-cover"
                    />
                  )
                })}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="rounded-lg border-l-4 border-orange-500 bg-orange-50 p-6">
            <h3 className="mb-2 font-bold text-orange-900">
              Inspired by this story?
            </h3>
            <p className="mb-4 text-sm text-orange-800">
              Share your own discovery journey and help preserve India's rich cultural heritage!
            </p>
            <Link
              href="/dashboard/yatra/create"
              className="inline-block rounded-lg bg-linear-to-r from-orange-500 to-amber-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-amber-700"
            >
              Share Your Journey
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-bold text-gray-900">
              Delete Story?
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this Yatra story? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
