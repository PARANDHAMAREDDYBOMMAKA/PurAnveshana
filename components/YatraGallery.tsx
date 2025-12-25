'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  Search,
  Filter,
  Plus,
  Loader2,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  X,
  Edit2,
  Trash2,
  Eye,
  BookOpen,
  FileText
} from 'lucide-react'

interface YatraStory {
  id: string
  userId: string
  heritageSiteId: string
  title: string
  discoveryContext: string
  journeyNarrative: string
  historicalIndicators: string[]
  historicalIndicatorsDetails: string | null
  evidenceTypes: string[]
  safeVisuals: string[]
  personalReflection: string | null
  submissionConfirmed: boolean
  publishStatus: string
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

const loadingMessages = [
  'Discovering ancient stories',
  'Unveiling hidden heritage',
  'Tracing forgotten footsteps',
  'Exploring sacred journeys',
  'Connecting with the past',
]

export default function YatraGallery({ userId, isAdmin }: YatraGalleryProps) {
  const [stories, setStories] = useState<YatraStory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])
  const [showFilters, setShowFilters] = useState(false)
  const [showMenuForStory, setShowMenuForStory] = useState<string | null>(null)
  const [deletingStory, setDeletingStory] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchStories()
  }, [userId])

  useEffect(() => {
    if (loading) {
      let index = 0
      const interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length
        setLoadingMessage(loadingMessages[index])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [loading])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenuForStory) {
        setShowMenuForStory(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenuForStory])

  const fetchStories = async () => {
    setLoading(true)
    try {
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

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) {
      return
    }

    setDeletingStory(storyId)
    setShowMenuForStory(null)

    try {
      const response = await fetch(`/api/yatra/${storyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Story deleted successfully')
        // Refresh the list
        fetchStories()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete story')
      }
    } catch (error) {
      console.error('Error deleting story:', error)
      toast.error('An error occurred')
    } finally {
      setDeletingStory(null)
    }
  }

  const heritageTypes = useMemo(() => {
    const types = new Set<string>()
    stories.forEach((story) => {
      if (story.heritageSite.type) {
        types.add(story.heritageSite.type)
      }
    })
    return Array.from(types).sort()
  }, [stories])

  const filteredStories = useMemo(() => {
    let filtered = [...stories]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.journeyNarrative.toLowerCase().includes(query) ||
          story.culturalInsights.toLowerCase().includes(query) ||
          story.heritageSite.title.toLowerCase().includes(query) ||
          story.author.name.toLowerCase().includes(query)
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(
        (story) => story.heritageSite.type === typeFilter
      )
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [stories, searchQuery, typeFilter, sortOrder])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative mx-auto h-20 w-20">
            <Loader2 className="h-20 w-20 animate-spin text-orange-500" />
            <MapPin className="absolute inset-0 m-auto h-8 w-8 text-orange-600 animate-pulse" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-amber-600">
              {loadingMessage}
            </p>
            <div className="flex items-center justify-center gap-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Yatra Stories</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Filter className="h-5 w-5 text-gray-900" />
          </button>
        </div>

        {/* Search Bar and Create Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full text-sm text-gray-900 placeholder:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          {!isAdmin && (
            <Link
              href="/dashboard/yatra/create"
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-lg transition-all whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Share Your Journey</span>
              <span className="sm:hidden">Share</span>
            </Link>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Filters</span>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4 text-gray-900" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Types</option>
                {heritageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            {(searchQuery || typeFilter !== 'all' || sortOrder !== 'newest') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setSortOrder('newest')
                }}
                className="w-full py-2 text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stories Feed */}
      {stories.length > 0 ? (
        filteredStories.length > 0 ? (
          <div className="space-y-6">
            {filteredStories.map((story) => {
              return (
                <article
                  key={story.id}
                  className="bg-white border-b border-gray-200 pb-4"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold">
                          {story.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {story.author.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-900">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(story.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                          {story.heritageSite.type && (
                            <>
                              <span>•</span>
                              <span>{story.heritageSite.type}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Three Dots Menu - Only show for user's own stories */}
                    {story.author.id === userId && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowMenuForStory(showMenuForStory === story.id ? null : story.id)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-900" />
                        </button>

                        {showMenuForStory === story.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-40 z-10">
                            <button
                              onClick={() => {
                                setShowMenuForStory(null)
                                router.push(`/dashboard/yatra/${story.id}/edit`)
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-900"
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(story.id)}
                              disabled={deletingStory === story.id}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingStory === story.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="px-4 py-4 space-y-4">
                    {/* Heritage Site Badge */}
                    <div className="flex items-center gap-2 p-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <span className="font-bold text-orange-900">
                        {story.heritageSite.title}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {story.title}
                    </h2>

                    {/* Discovery Context */}
                    {story.discoveryContext && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Eye className="h-4 w-4 text-emerald-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Discovery Context</h3>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {story.discoveryContext}
                        </p>
                      </div>
                    )}

                    {/* Journey Narrative */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                          <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">Journey Narrative</h3>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                        {story.journeyNarrative}
                      </p>
                    </div>

                    {/* Historical Indicators */}
                    {story.historicalIndicators && story.historicalIndicators.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-purple-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Historical Indicators</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {story.historicalIndicators.map((indicator, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
                              {indicator}
                            </span>
                          ))}
                        </div>
                        {story.historicalIndicatorsDetails && (
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                            {story.historicalIndicatorsDetails}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Evidence Types */}
                    {story.evidenceTypes && story.evidenceTypes.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Evidence Types</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {story.evidenceTypes.map((evidence, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Safe Visuals */}
                    {story.safeVisuals && story.safeVisuals.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-teal-100 rounded-lg">
                            <Eye className="h-4 w-4 text-teal-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Safe Visuals</h3>
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {story.safeVisuals.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {story.safeVisuals.map((imageUrl, index) => (
                            <div key={index} className="aspect-square bg-gray-100 relative rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={imageUrl}
                                alt={`Safe visual ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%239ca3af"%3ENo Image%3C/text%3E%3C/svg%3E'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personal Reflection */}
                    {story.personalReflection && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-pink-100 rounded-lg">
                            <Heart className="h-4 w-4 text-pink-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Personal Reflection</h3>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {story.personalReflection}
                        </p>
                      </div>
                    )}

                    {/* Cultural Insights */}
                    {story.culturalInsights && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-indigo-600" />
                          </div>
                          <h3 className="text-base font-bold text-gray-900">Cultural Insights</h3>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-200">
                          {story.culturalInsights}
                        </p>
                      </div>
                    )}

                    {/* Publication Status */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                        story.publishStatus === 'APPROVED_PUBLIC' ? 'bg-green-100 text-green-800 border border-green-200' :
                        story.publishStatus === 'FEATURED_YATRA' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                        {story.publishStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">Like</span>
                      </button>
                      <button className="text-gray-600 hover:text-blue-500 transition-colors flex items-center gap-1">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Comment</span>
                      </button>
                      <button className="text-gray-600 hover:text-green-500 transition-colors flex items-center gap-1">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Share</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-orange-500 transition-colors">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <Search className="h-16 w-16 text-gray-900 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-900 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setTypeFilter('all')
                setSortOrder('newest')
              }}
              className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-full hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        <div className="text-center py-16 px-4">
          <MapPin className="h-16 w-16 text-gray-900 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'No Stories Published Yet' : 'Begin Your Journey'}
          </h3>
          <p className="text-gray-900 mb-6">
            {isAdmin
              ? 'Waiting for explorers to share their discoveries'
              : 'Share your discoveries and inspire others'}
          </p>
          {!isAdmin && (
            <Link
              href="/dashboard/yatra/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5" />
              Share Your First Journey
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
