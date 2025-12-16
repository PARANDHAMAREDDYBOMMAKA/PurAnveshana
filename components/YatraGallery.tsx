'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface YatraStory {
  id: string
  title: string
  journeyNarrative: string
  culturalInsights: string
  createdAt: string
  author: {
    id: string
    name: string
  }
  heritageSite: {
    id: string
    title: string
    type: string | null
    images: {
      id: string
      r2Url: string | null
      cloudinaryUrl: string | null
      location: string
    }[]
  }
}

interface YatraGalleryProps {
  userId: string
  isAdmin: boolean
}

export default function YatraGallery({ userId, isAdmin }: YatraGalleryProps) {
  const [stories, setStories] = useState<YatraStory[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchStories()
  }, [userId])

  const fetchStories = async () => {
    setLoading(true)
    try {
      // API now automatically filters based on role (admin sees all, users see only their own)
      const response = await fetch('/api/yatra')
      if (response.ok) {
        const data = await response.json()
        setStories(data.stories)
      } else {
        toast.error('Failed to fetch stories')
      }
    } catch (error) {
      console.error('Error fetching stories:', error)
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Create Button */}
      {!isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link
            href="/dashboard/yatra/create"
            className="rounded-lg bg-linear-to-r from-orange-500 to-amber-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-700"
          >
            + Share Your Journey
          </Link>
        </div>
      )}

      {/* Stories Grid */}
      {stories.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => {
            const imageUrl =
              story.heritageSite.images[0]?.r2Url ||
              story.heritageSite.images[0]?.cloudinaryUrl

            return (
              <div
                key={story.id}
                className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg transition-all hover:shadow-xl"
                onClick={() => router.push(`/dashboard/yatra/${story.id}`)}
              >
                {/* Image */}
                {imageUrl ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={story.heritageSite.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xs font-semibold text-white/90">
                        {story.heritageSite.type}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-48 items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                    <span className="text-6xl">🗺️</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {story.title}
                  </h3>

                  <p className="mb-2 text-sm font-semibold text-orange-600">
                    Heritage Site: {story.heritageSite.title}
                  </p>

                  <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                    {truncateText(story.journeyNarrative, 150)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
                        {story.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          {story.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-orange-500">
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow-lg">
          <div className="mb-4 text-6xl">🗺️</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            {isAdmin ? 'No Stories Published Yet' : 'No Stories Yet'}
          </h3>
          <p className="mb-6 text-gray-600">
            {isAdmin
              ? 'No users have shared their discovery journeys yet.'
              : "You haven't shared any Yatra stories yet. Create your first story to share your discoveries!"}
          </p>
          {!isAdmin && (
            <Link
              href="/dashboard/yatra/create"
              className="inline-block rounded-lg bg-linear-to-r from-orange-500 to-amber-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-amber-700"
            >
              Share Your Journey
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
