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
  const [sheetDragY, setSheetDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
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

  // Fetch comment counts for all stories when they load
  useEffect(() => {
    const fetchCommentCounts = async () => {
      for (const story of stories) {
        try {
          const response = await fetch(`/api/yatra/${story.id}/comments`)
          if (response.ok) {
            const data = await response.json()
            setCommentCounts(prev => ({ ...prev, [story.id]: data.comments.length }))
          }
        } catch (error) {
          console.error('Error fetching comment count:', error)
        }
      }
    }

    if (stories.length > 0) {
      fetchCommentCounts()
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
      setSheetDragY(0)
      setIsDragging(false)
    } else {
      setShowCommentBox(storyId)
      setSheetDragY(0)
      setIsDragging(false)
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

  // Mobile sheet drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY

    // Only allow dragging down (positive deltaY)
    if (deltaY > 0) {
      setSheetDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // If dragged down more than 150px, close the sheet
    if (sheetDragY > 150) {
      setShowCommentBox(null)
      setCommentText('')
    }

    // Reset drag position
    setSheetDragY(0)
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
    <div className="mx-auto max-w-6xl">
      {/* Fixed Header - Feature Name, Tagline, and Filters */}
      <div className="sticky top-16 sm:top-[72px] lg:top-20 z-30 bg-linear-to-br from-amber-50 via-orange-50 to-white py-3 sm:py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-md border-b border-slate-200">
        {/* Mobile Layout: Stacked */}
        <div className="flex flex-col gap-3 md:hidden">
          {/* Title and Tagline */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-slate-900">Yatra</h1>
            <p className="text-xs text-slate-600 font-medium">The journey behind the discovery.</p>
          </div>

          {/* Search and Buttons */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-2 py-2 border-2 border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border-2 border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <Filter className="h-4 w-4 text-slate-700" />
            </button>
            {!isAdmin && (
              <Link
                href="/dashboard/yatra/create"
                className="p-2 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Tablet & Desktop Layout: Side by Side */}
        <div className="hidden md:flex flex-row items-center justify-between gap-4">
          {/* Left: Feature Name and Tagline */}
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Yatra
            </h1>
            <p className="text-sm lg:text-base text-slate-600 font-medium">
              The journey behind the discovery.
            </p>
          </div>

          {/* Right: Search Bar and Buttons */}
          <div className="flex flex-row items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-3 py-2 border-2 border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-slate-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
            >
              <Filter className="h-4 w-4 text-slate-700" />
              <span className="text-sm font-medium text-slate-700">Filters</span>
            </button>
            {!isAdmin && (
              <Link
                href="/dashboard/yatra/create"
                className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-xl transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </Link>
            )}
          </div>
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

      {/* Spacing after sticky header */}
      <div className="h-6"></div>

      {/* Stories - Story Book Format */}
      {stories.length > 0 ? (
        filteredStories.length > 0 ? (
          <div className="space-y-12 sm:space-y-16 px-4">
            {filteredStories.map((story, index) => {
              return (
                <article
                  key={story.id}
                  className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-shadow duration-500"
                >

                  {/* Edit Menu - Only show for user's own stories */}
                  {story.author.id === userId && (
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowMenuForStory(showMenuForStory === story.id ? null : story.id)
                        }}
                        className="p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-lg border border-slate-200"
                      >
                        <MoreHorizontal className="h-5 w-5 text-slate-700" />
                      </button>

                      {showMenuForStory === story.id && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 w-44 z-20">
                          <button
                            onClick={() => {
                              setShowMenuForStory(null)
                              router.push(`/dashboard/yatra/${story.id}/edit`)
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-orange-50 flex items-center gap-2 text-slate-900 font-medium transition-colors"
                          >
                            <Edit2 className="h-4 w-4 text-orange-600" />
                            Edit Story
                          </button>
                          <button
                            onClick={() => handleDelete(story.id)}
                            disabled={deletingStory === story.id}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingStory === story.id ? 'Deleting...' : 'Delete Story'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Story Content */}
                  <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
                    {/* Heritage Site Badge */}
                    {/* <div className="flex items-center gap-2 p-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <MapPin className="h-5 w-5 text-orange-600" />
                      <span className="font-bold text-orange-900">
                        {story.heritageSite.title}
                      </span>
                    </div> */}

                    {/* Title */}
                    <div className="space-y-3">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                        {story.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-xs">
                            {story.author.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{story.author.name}</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{new Date(story.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        {story.heritageSite.type && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium text-xs">
                              {story.heritageSite.type}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Combined Journey Narrative */}
                    <div className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-700">
                      {story.discoveryContext && (
                        <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-orange-600 first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                          {story.discoveryContext}
                        </p>
                      )}
                      <p className="whitespace-pre-line">
                        {story.journeyNarrative}
                      </p>
                    </div>

                    {/* Historical Indicators */}
                    {story.historicalIndicators && story.historicalIndicators.length > 0 && (
                      <div className="space-y-4 p-6 bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border border-orange-200">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-orange-600 rounded-xl">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Historical Significance</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {story.historicalIndicators.map((indicator, index) => (
                            <span key={index} className="px-4 py-2 bg-white text-orange-800 rounded-full text-sm font-semibold shadow-sm border border-orange-200">
                              {indicator}
                            </span>
                          ))}
                        </div>
                        {story.historicalIndicatorsDetails && (
                          <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line mt-3">
                            {story.historicalIndicatorsDetails}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Evidence Types */}
                    {story.evidenceTypes && story.evidenceTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {story.evidenceTypes.map((evidence, index) => (
                          <span key={index} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Visual Documentation */}
                    {story.safeVisuals && story.safeVisuals.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-slate-700 rounded-xl">
                            <Eye className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Visual Documentation</h3>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                          {story.safeVisuals.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-md hover:shadow-lg transition-shadow">
                              <img
                                src={imageUrl}
                                alt={`Heritage visual ${imgIndex + 1}`}
                                className="w-full h-20 sm:h-24 md:h-28 object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f8fafc" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" text-anchor="middle" dy=".3em" fill="%2394a3b8"%3ENo Image%3C/text%3E%3C/svg%3E'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Personal Reflection */}
                    {story.personalReflection && (
                      <div className="space-y-4 p-6 bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl border-l-4 border-slate-600">
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-5 w-5 text-slate-600" />
                          <h3 className="text-xl font-bold text-slate-900">Traveler's Reflection</h3>
                        </div>
                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line italic">
                          "{story.personalReflection}"
                        </p>
                      </div>
                    )}

                    {/* Cultural Insights */}
                    {story.culturalInsights && (
                      <div className="space-y-4 p-6 bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl border-l-4 border-amber-600">
                        <div className="flex items-center gap-2.5">
                          <BookOpen className="h-5 w-5 text-amber-600" />
                          <h3 className="text-xl font-bold text-slate-900">Cultural Context</h3>
                        </div>
                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
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

                  {/* Reader Interactions - Subtle Footer */}
                  <div className="border-t border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between px-6 sm:px-8 md:px-10 py-4">
                      <div className="flex items-center gap-5 sm:gap-6">
                        <button
                          onClick={() => handleLike(story.id)}
                          className={`transition-all flex items-center gap-2 group ${
                            likedStories[story.id]
                              ? 'text-orange-600'
                              : 'text-slate-500 hover:text-orange-600'
                          }`}
                          title="Appreciate this journey"
                        >
                          <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${likedStories[story.id] ? 'fill-current' : ''}`} />
                          <span className="text-xs sm:text-sm font-medium">
                            {likeCounts[story.id] > 0 && likeCounts[story.id]}
                          </span>
                        </button>
                        <button
                          onClick={() => handleComment(story.id)}
                          className={`transition-all flex items-center gap-2 group ${
                            showCommentBox === story.id
                              ? 'text-amber-600'
                              : 'text-slate-500 hover:text-amber-600'
                          }`}
                          title="Share your thoughts"
                        >
                          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm font-medium">
                            {commentCounts[story.id] > 0 && commentCounts[story.id]}
                          </span>
                        </button>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowShareMenu(showShareMenu === story.id ? null : story.id)
                            }}
                            className="text-slate-500 hover:text-slate-700 transition-all flex items-center gap-2 group"
                            title="Share this story"
                          >
                            <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                          {showShareMenu === story.id && (
                            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 w-48 z-20">
                              <button
                                onClick={() => handleShare(story.id, 'whatsapp', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                              >
                                <MessageCircle className="h-4 w-4 text-green-600" />
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'facebook', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                              >
                                <Facebook className="h-4 w-4 text-blue-600" />
                                Facebook
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'twitter', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700"
                              >
                                <Twitter className="h-4 w-4 text-sky-500" />
                                Twitter
                              </button>
                              <button
                                onClick={() => handleShare(story.id, 'copy', story.title)}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors border-t border-slate-100 flex items-center gap-3 text-slate-700"
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
                        className={`transition-all p-2 rounded-full ${
                          savedStories.has(story.id)
                            ? 'text-orange-600 bg-orange-50'
                            : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50'
                        }`}
                        title="Save for later"
                      >
                        <Bookmark className={`h-4 w-4 sm:h-5 sm:w-5 ${savedStories.has(story.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="max-w-md mx-auto">
              <div className="mb-6 p-6 bg-slate-100 rounded-full w-fit mx-auto">
                <Search className="h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                No Journeys Found
              </h3>
              <p className="text-slate-600 mb-8 text-base">
                The search yielded no results. Try different keywords or adjust your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setSortOrder('newest')
                }}
                className="px-8 py-3 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl hover:shadow-xl transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="mb-6 p-6 bg-orange-100 rounded-full w-fit mx-auto">
              <MapPin className="h-16 w-16 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {isAdmin ? 'The Archives Await' : 'Begin Your Chronicle'}
            </h3>
            <p className="text-slate-600 mb-8 text-base">
              {isAdmin
                ? 'No heritage journeys have been documented yet. The first story is yet to be written.'
                : 'Every heritage site has a story. Share yours and become part of India\'s living history.'}
            </p>
            {!isAdmin && (
              <Link
                href="/dashboard/yatra/create"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:shadow-xl transition-all"
              >
                <Plus className="h-5 w-5" />
                Document Your First Journey
              </Link>
            )}
          </div>
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
              setSheetDragY(0)
              setIsDragging(false)
            }}
          />

          {/* Desktop Sidebar */}
          <div className="hidden md:block fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b-2 border-slate-200 bg-linear-to-r from-orange-50 to-amber-50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <MessageCircle className="h-5 w-5 text-amber-600" />
                  Reader Thoughts
                  {commentCounts[showCommentBox] > 0 && (
                    <span className="text-sm font-normal text-slate-600 bg-white px-2 py-0.5 rounded-full">
                      {commentCounts[showCommentBox]}
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setShowCommentBox(null)
                    setCommentText('')
                  }}
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {loadingComments ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : comments[showCommentBox] && comments[showCommentBox].length > 0 ? (
                  comments[showCommentBox].map((comment) => (
                    <div key={comment.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 group hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-bold text-slate-900">{comment.user.name}</p>
                            {comment.userId === userId && (
                              <button
                                onClick={() => deleteComment(showCommentBox, comment.id)}
                                disabled={deletingComment === comment.id}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                                title="Delete comment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mb-2">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-sm text-slate-700 leading-relaxed">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-medium">No thoughts shared yet</p>
                    <p className="text-xs text-slate-400 mt-1">Be the first to share your perspective</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t-2 border-slate-200 bg-white">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this journey..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none text-slate-900 placeholder:text-slate-400 bg-slate-50"
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2 mt-3">
                  <button
                    onClick={() => submitComment(showCommentBox)}
                    disabled={submittingComment || !commentText.trim()}
                    className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                  >
                    {submittingComment ? 'Sharing...' : 'Share Thought'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet */}
          <div
            className="md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col transition-transform"
            style={{
              transform: `translateY(${sheetDragY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {/* Handle - Drag indicator */}
            <div
              className="flex justify-center py-3 bg-linear-to-r from-orange-50 to-amber-50 rounded-t-3xl cursor-grab active:cursor-grabbing touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-12 h-1.5 bg-slate-400 rounded-full" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-4 pb-3 border-b-2 border-slate-200 bg-linear-to-r from-orange-50 to-amber-50 touch-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <MessageCircle className="h-5 w-5 text-amber-600" />
                Reader Thoughts
                {commentCounts[showCommentBox] > 0 && (
                  <span className="text-sm font-normal text-slate-600 bg-white px-2 py-0.5 rounded-full">
                    {commentCounts[showCommentBox]}
                  </span>
                )}
              </h3>
              <button
                onClick={() => {
                  setShowCommentBox(null)
                  setCommentText('')
                  setSheetDragY(0)
                  setIsDragging(false)
                }}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {loadingComments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                </div>
              ) : comments[showCommentBox] && comments[showCommentBox].length > 0 ? (
                comments[showCommentBox].map((comment) => (
                  <div key={comment.id} className="bg-white rounded-xl p-3 shadow-sm border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-bold text-slate-900">{comment.user.name}</p>
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
                        <p className="text-xs text-slate-500 mb-2">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-slate-700 leading-relaxed">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No thoughts shared yet</p>
                  <p className="text-xs text-slate-400 mt-1">Be the first to share your perspective</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t-2 border-slate-200 bg-white">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this journey..."
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-none text-slate-900 placeholder:text-slate-400 bg-slate-50"
                rows={2}
              />
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  onClick={() => submitComment(showCommentBox)}
                  disabled={submittingComment || !commentText.trim()}
                  className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {submittingComment ? 'Sharing...' : 'Share Thought'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
