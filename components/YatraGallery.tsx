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
  FileText,
  Link as LinkIcon,
  Facebook,
  Twitter
} from 'lucide-react'

interface YatraComment {
  id: string
  storyId: string
  userId: string
  comment: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
  }
}

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
  _count?: {
    likes: number
    comments: number
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
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [savedStories, setSavedStories] = useState<Set<string>>(new Set())
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null)
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Record<string, YatraComment[]>>({})
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [submittingComment, setSubmittingComment] = useState(false)
  const [deletingComment, setDeletingComment] = useState<string | null>(null)
  const [loadingComments, setLoadingComments] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchStories()
  }, [userId])

  // Fetch like status for all stories when they load
  useEffect(() => {
    const fetchLikeStatuses = async () => {
      for (const story of stories) {
        try {
          const response = await fetch(`/api/yatra/${story.id}/like`)
          if (response.ok) {
            const data = await response.json()
            setLikedStories(prev => ({ ...prev, [story.id]: data.liked }))
            setLikeCounts(prev => ({ ...prev, [story.id]: data.likeCount }))
          }
        } catch (error) {
          console.error('Error fetching like status:', error)
        }
      }
    }

    if (stories.length > 0) {
      fetchLikeStatuses()
    }
  }, [stories])

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
      if (showShareMenu) {
        setShowShareMenu(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenuForStory, showShareMenu])

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

  const handleLike = async (storyId: string) => {
    try {
      const response = await fetch(`/api/yatra/${storyId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLikedStories(prev => ({ ...prev, [storyId]: data.liked }))
        setLikeCounts(prev => ({ ...prev, [storyId]: data.likeCount }))
      } else {
        toast.error('Failed to update like')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('An error occurred')
    }
  }

  const handleSave = (storyId: string) => {
    setSavedStories(prev => {
      const newSaves = new Set(prev)
      if (newSaves.has(storyId)) {
        newSaves.delete(storyId)
        toast.success('Removed from saved!')
      } else {
        newSaves.add(storyId)
        toast.success('Saved to collection!')
      }
      return newSaves
    })
  }

  const handleShare = (storyId: string, platform: string, storyTitle: string) => {
    const url = `${window.location.origin}/dashboard/yatra/${storyId}`
    const text = `Check out this heritage discovery: ${storyTitle}`

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
      setShowShareMenu(null)
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
      setShowShareMenu(null)
    }
  }

  const handleComment = async (storyId: string) => {
    if (showCommentBox === storyId) {
      setShowCommentBox(null)
      setCommentText('')
    } else {
      setShowCommentBox(storyId)
      if (!comments[storyId]) {
        await fetchComments(storyId)
      }
    }
  }

  const fetchComments = async (storyId: string) => {
    setLoadingComments(true)
    try {
      const response = await fetch(`/api/yatra/${storyId}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(prev => ({ ...prev, [storyId]: data.comments }))
        setCommentCounts(prev => ({ ...prev, [storyId]: data.comments.length }))
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const submitComment = async (storyId: string) => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/yatra/${storyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentText }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(prev => ({
          ...prev,
          [storyId]: [data.comment, ...(prev[storyId] || [])]
        }))
        setCommentCounts(prev => ({
          ...prev,
          [storyId]: (prev[storyId] || 0) + 1
        }))
        toast.success('Comment posted!')
        setCommentText('')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('An error occurred')
    } finally {
      setSubmittingComment(false)
    }
  }

  const deleteComment = async (storyId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setDeletingComment(commentId)
    try {
      const response = await fetch(`/api/yatra/${storyId}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(prev => ({
          ...prev,
          [storyId]: (prev[storyId] || []).filter(c => c.id !== commentId)
        }))
        setCommentCounts(prev => ({
          ...prev,
          [storyId]: Math.max(0, (prev[storyId] || 1) - 1)
        }))
        toast.success('Comment deleted!')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to delete comment')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('An error occurred')
    } finally {
      setDeletingComment(null)
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
                  <div className="border-t border-gray-100">
                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(story.id)}
                          className={`transition-colors flex items-center gap-1.5 ${
                            likedStories[story.id]
                              ? 'text-red-500'
                              : 'text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${likedStories[story.id] ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">
                            {likeCounts[story.id] > 0 ? likeCounts[story.id] : ''}
                            {likeCounts[story.id] > 0 ? (likeCounts[story.id] === 1 ? ' Like' : ' Likes') : 'Like'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleComment(story.id)}
                          className={`transition-colors flex items-center gap-1.5 ${
                            showCommentBox === story.id
                              ? 'text-blue-500'
                              : 'text-gray-600 hover:text-blue-500'
                          }`}
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {commentCounts[story.id] > 0 ? commentCounts[story.id] : ''}
                            {commentCounts[story.id] > 0 ? (commentCounts[story.id] === 1 ? ' Comment' : ' Comments') : 'Comment'}
                          </span>
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowShareMenu(showShareMenu === story.id ? null : story.id)}
                            className="text-gray-600 hover:text-green-500 transition-colors flex items-center gap-1"
                          >
                            <Share2 className="h-5 w-5" />
                            <span className="text-sm font-medium">Share</span>
                          </button>
                          {showShareMenu === story.id && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 w-48 z-20">
                              <button
                                onClick={() => handleShare(story.id, 'whatsapp', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                              >
                                <MessageCircle className="h-4 w-4 text-green-600" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'facebook', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                              >
                                <Facebook className="h-4 w-4 text-blue-600" />
                                Facebook
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'twitter', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-900"
                              >
                                <Twitter className="h-4 w-4 text-sky-500" />
                                Twitter
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'copy', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors border-t border-gray-100 flex items-center gap-3 text-gray-900"
                              >
                                <LinkIcon className="h-4 w-4 text-orange-600" />
                                Copy Link
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSave(story.id)}
                        className={`transition-colors ${
                          savedStories.has(story.id)
                            ? 'text-orange-500'
                            : 'text-gray-600 hover:text-orange-500'
                        }`}
                      >
                        <Bookmark className={`h-5 w-5 ${savedStories.has(story.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
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

      {/* Comments Sidebar/Bottom Sheet */}
      {showCommentBox && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => {
              setShowCommentBox(null)
              setCommentText('')
            }}
          />

          {/* Desktop Sidebar */}
          <div className="hidden md:block fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Comments
                  {commentCounts[showCommentBox] > 0 && (
                    <span className="text-sm font-normal text-gray-600">
                      ({commentCounts[showCommentBox]})
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowCommentBox(null)
                    setCommentText('')
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : comments[showCommentBox] && comments[showCommentBox].length > 0 ? (
                  comments[showCommentBox].map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3 space-y-2 group">
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
                            {comment.userId === userId && (
                              <button
                                onClick={() => deleteComment(showCommentBox, comment.id)}
                                disabled={deletingComment === comment.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                                title="Delete comment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none text-gray-900 placeholder:text-gray-400 bg-white"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => submitComment(showCommentBox)}
                    disabled={submittingComment || !commentText.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet */}
          <div className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-500" />
                Comments
                {commentCounts[showCommentBox] > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    ({commentCounts[showCommentBox]})
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowCommentBox(null)
                  setCommentText('')
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingComments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : comments[showCommentBox] && comments[showCommentBox].length > 0 ? (
                comments[showCommentBox].map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900">{comment.user.name}</p>
                          {comment.userId === userId && (
                            <button
                              onClick={() => deleteComment(showCommentBox, comment.id)}
                              disabled={deletingComment === comment.id}
                              className="p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                              title="Delete comment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none text-gray-900 placeholder:text-gray-400 bg-white"
                rows={2}
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  onClick={() => submitComment(showCommentBox)}
                  disabled={submittingComment || !commentText.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
