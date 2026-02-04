'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Plus,
  Loader2,
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  AlertCircle,
  Link as LinkIcon,
  ChevronDown
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

interface LocationVerificationResult {
  containsLocation: boolean
  confidence: string
  detectedLocations: string[]
  reason: string
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
  likeCount: number
  commentCount: number
  isLikedByUser: boolean
  isSavedByUser: boolean
  locationVerificationStatus?: 'PENDING' | 'PASSED' | 'FLAGGED' | 'ERROR'
  locationVerificationResult?: LocationVerificationResult
  locationVerifiedAt?: string
}

interface YatraGalleryProps {
  userId: string
  isAdmin: boolean
}

const loadingMessages = [
  'Loading stories',
  'Fetching posts',
  'Getting updates',
]

export default function YatraGallery({ userId, isAdmin }: YatraGalleryProps) {
  const [stories, setStories] = useState<YatraStory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0])
  const [showMenuForStory, setShowMenuForStory] = useState<string | null>(null)
  const [deletingStory, setDeletingStory] = useState<string | null>(null)
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({})
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [savedStories, setSavedStories] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null)
  const [showCommentBox, setShowCommentBox] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Record<string, YatraComment[]>>({})
  const [savingStory, setSavingStory] = useState<string | null>(null)
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({})
  const [submittingComment, setSubmittingComment] = useState(false)
  const [deletingComment, setDeletingComment] = useState<string | null>(null)
  const [loadingComments, setLoadingComments] = useState(false)
  const [approvingStory, setApprovingStory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [verificationFilter, setVerificationFilter] = useState<string>('all')
  const [touchStart, setTouchStart] = useState<number>(0)
  const [touchEnd, setTouchEnd] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<number>(0)
  const [allStories, setAllStories] = useState<YatraStory[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
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
      const response = await fetch('/api/yatra', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()

        setAllStories(data.stories)

        const initialStories = data.stories.slice(0, 10)
        setStories(initialStories)
        setHasMore(data.stories.length > 10)

        const newLikedStories: Record<string, boolean> = {}
        const newLikeCounts: Record<string, number> = {}
        const newCommentCounts: Record<string, number> = {}
        const newSavedStories = new Set<string>()

        data.stories.forEach((story: YatraStory) => {
          newLikedStories[story.id] = story.isLikedByUser
          newLikeCounts[story.id] = story.likeCount
          newCommentCounts[story.id] = story.commentCount
          if (story.isSavedByUser) {
            newSavedStories.add(story.id)
          }
        })

        setLikedStories(newLikedStories)
        setSavedStories(newSavedStories)
        setLikeCounts(newLikeCounts)
        setCommentCounts(newCommentCounts)
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

  const loadMoreStories = () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const currentLength = stories.length
    const nextStories = allStories.slice(currentLength, currentLength + 10)

    setTimeout(() => {
      setStories(prev => [...prev, ...nextStories])
      setHasMore(currentLength + nextStories.length < allStories.length)
      setLoadingMore(false)
    }, 300)
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

  const handleApproveAction = async (storyId: string, action: 'approve' | 'feature' | 'reject') => {
    setApprovingStory(storyId)
    try {
      const response = await fetch(`/api/yatra/${storyId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(data.message)
        fetchStories()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to update story')
      }
    } catch (error) {
      console.error('Error updating story:', error)
      toast.error('An error occurred')
    } finally {
      setApprovingStory(null)
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

  const handleSave = async (storyId: string) => {
    // Prevent duplicate calls
    if (savingStory === storyId) return

    setSavingStory(storyId)
    try {
      const response = await fetch(`/api/yatra/${storyId}/save`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setSavedStories(prev => {
          const newSaves = new Set(prev)
          if (data.saved) {
            newSaves.add(storyId)
          } else {
            newSaves.delete(storyId)
          }
          return newSaves
        })
        // Show toast after state update
        toast.success(data.saved ? 'Saved!' : 'Removed from saved!')
      } else {
        toast.error('Failed to save story')
      }
    } catch (error) {
      console.error('Error saving story:', error)
      toast.error('An error occurred')
    } finally {
      setSavingStory(null)
    }
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
      toast.success('Link copied!')
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED_PUBLIC':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        )
      case 'FEATURED_YATRA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <Star className="h-3 w-3" />
            Featured
          </span>
        )
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <AlertCircle className="h-3 w-3" />
            Pending Review
          </span>
        )
      default:
        return null
    }
  }

  const getLocationVerificationBadge = (story: YatraStory) => {
    if (!story.locationVerificationStatus) return null

    switch (story.locationVerificationStatus) {
      case 'PASSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold" title="No location detected">
            <CheckCircle className="h-3 w-3" />
            Location Safe
          </span>
        )
      case 'FLAGGED':
        return (
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold cursor-pointer"
            title={story.locationVerificationResult?.reason || 'Location information detected'}
          >
            <AlertCircle className="h-3 w-3" />
            Location Flagged
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
            <Loader2 className="h-3 w-3 animate-spin" />
            Verifying...
          </span>
        )
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
            <AlertCircle className="h-3 w-3" />
            Verification Error
          </span>
        )
      default:
        return null
    }
  }

  const filteredStories = useMemo(() => {
    const sourceStories = searchQuery.trim() || (isAdmin && (statusFilter !== 'all' || verificationFilter !== 'all')) ? allStories : stories
    let filtered = [...sourceStories]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.journeyNarrative.toLowerCase().includes(query) ||
          (story.culturalInsights && story.culturalInsights.toLowerCase().includes(query)) ||
          story.heritageSite.title.toLowerCase().includes(query) ||
          story.author.name.toLowerCase().includes(query)
      )
    }

    if (isAdmin && statusFilter !== 'all') {
      filtered = filtered.filter((story) => story.publishStatus === statusFilter)
    }

    if (isAdmin && verificationFilter !== 'all') {
      filtered = filtered.filter((story) => story.locationVerificationStatus === verificationFilter)
    }

    return filtered
  }, [stories, allStories, searchQuery, statusFilter, verificationFilter, isAdmin])

  // Auto-load more stories when user approaches the end
  useEffect(() => {
    // When user is within 3 stories of the end, load more
    if (currentPage >= stories.length - 3 && hasMore && !loadingMore) {
      loadMoreStories()
    }
  }, [currentPage, stories.length, hasMore, loadingMore])

  useEffect(() => {
    setCurrentPage(0)
  }, [searchQuery, statusFilter, verificationFilter])

  // Swipe handlers for mobile navigation with smooth animation
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't trigger swipe if touch started on interactive elements
    const target = e.target as HTMLElement
    const isInteractive = target.closest('button, a, textarea, input, [role="button"]')

    if (isInteractive) {
      return
    }

    setTouchStart(e.targetTouches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const currentTouch = e.targetTouches[0].clientX
    const diff = currentTouch - touchStart

    // Apply resistance at edges
    const canSwipeLeft = currentPage < filteredStories.length - 1
    const canSwipeRight = currentPage > 0

    if ((diff < 0 && !canSwipeLeft) || (diff > 0 && !canSwipeRight)) {
      // Add resistance when trying to swipe beyond bounds
      setDragOffset(diff * 0.2)
    } else {
      setDragOffset(diff)
    }

    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false)
      setDragOffset(0)
      return
    }

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 75 // Increased threshold for better UX
    const isRightSwipe = distance < -75

    if (isLeftSwipe && currentPage < filteredStories.length - 1) {
      // Swipe left - go to next story
      setCurrentPage(currentPage + 1)
    } else if (isRightSwipe && currentPage > 0) {
      // Swipe right - go to previous story
      setCurrentPage(currentPage - 1)
    }

    // Reset with animation
    setIsDragging(false)
    setDragOffset(0)
    setTouchStart(0)
    setTouchEnd(0)
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-700 mx-auto" />
          <p className="text-amber-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>{loadingMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20">
      {/* Header - Heritage Style */}
      <div className="mb-6">
        <div className="relative w-full rounded-2xl p-5 sm:p-6 shadow-lg mb-4 overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
            boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08)',
          }}
        >
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)' }}
          ></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent"></div>
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30"></div>
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-800 p-3 rounded-xl shadow-lg shadow-amber-900/30">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-amber-50" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>Yatra</h2>
              <p className="text-sm sm:text-base text-amber-800/70 mt-0.5" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Your heritage discovery journey</p>
            </div>
          </div>
        </div>

        {/* Search and Create Section */}
        <div className="flex flex-row gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/50" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-amber-200/80 rounded-xl text-sm text-amber-900 placeholder:text-amber-600/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white/60 hover:border-amber-300"
            />
          </div>

          {/* Create Button */}
          {!isAdmin && (
            <Link
              href="/dashboard/yatra/create"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-amber-800 text-amber-50 font-bold rounded-full hover:bg-amber-900 active:scale-95 transition-all shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/25 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Create Story</span>
              <span className="sm:hidden">Create</span>
            </Link>
          )}
        </div>

        {isAdmin && (
          <div className="mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm text-amber-900 hover:text-amber-700 font-medium" style={{ fontFamily: 'Georgia, serif' }}
            >
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            {showFilters && (
              <div className="space-y-3 mt-2">
                <div>
                  <p className="text-xs font-semibold text-amber-800/60 mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>Publish Status</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        statusFilter === 'all'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setStatusFilter('PENDING_REVIEW')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        statusFilter === 'PENDING_REVIEW'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => setStatusFilter('APPROVED_PUBLIC')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        statusFilter === 'APPROVED_PUBLIC'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setStatusFilter('FEATURED_YATRA')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        statusFilter === 'FEATURED_YATRA'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      Featured
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-800/60 mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>Location Verification</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setVerificationFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        verificationFilter === 'all'
                          ? 'bg-amber-800 text-amber-50'
                          : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setVerificationFilter('FLAGGED')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        verificationFilter === 'FLAGGED'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      Flagged
                    </button>
                    <button
                      onClick={() => setVerificationFilter('PASSED')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        verificationFilter === 'PASSED'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Passed
                    </button>
                    <button
                      onClick={() => setVerificationFilter('PENDING')}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        verificationFilter === 'PENDING'
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-100/60 text-amber-800 hover:bg-amber-200/60'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Reader */}
      {stories.length > 0 ? (
        filteredStories.length > 0 ? (
          <>
            {/* Navigation Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/60 border-2 border-amber-300 text-amber-800 font-semibold rounded-full hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="text-sm font-medium text-amber-800/70" style={{ fontFamily: 'Georgia, serif' }}>
                Page <span className="text-amber-900 font-bold">{currentPage + 1}</span> of {filteredStories.length}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(filteredStories.length - 1, currentPage + 1))}
                disabled={currentPage === filteredStories.length - 1}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-800 text-amber-50 font-semibold rounded-full hover:bg-amber-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-900/20"
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Swipe Container */}
            <div
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Swipe Indicator - Only show on mobile */}
              {filteredStories.length > 1 && (
                <div className="md:hidden flex items-center justify-center gap-2 mb-3">
                  {filteredStories.length <= 8 ? (
                    // Show dots for 8 or fewer stories
                    <div className="flex gap-1">
                      {filteredStories.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentPage
                              ? 'w-8 bg-amber-700'
                              : 'w-1.5 bg-amber-300'
                          }`}
                        />
                      ))}
                    </div>
                  ) : (
                    // Show counter for more than 8 stories
                    <div className="px-3 py-1 bg-amber-100/60 rounded-full">
                      <span className="text-xs font-semibold text-amber-800">
                        {currentPage + 1} / {filteredStories.length}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Single Story (Book Page) */}
              {filteredStories.slice(currentPage, currentPage + 1).map((story) => (
                <article
                  key={story.id}
                  className={`relative rounded-2xl overflow-hidden ${
                    isDragging ? '' : 'transition-all duration-300 ease-out'
                  }`}
                  style={{
                    background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
                    boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08)',
                    transform: `translateX(${dragOffset}px) scale(${isDragging ? 0.98 : 1})`,
                    opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) / 800) : 1,
                  }}
                >
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white font-bold">
                      {story.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{story.author.name}</p>
                      <div className="flex items-center gap-2 text-xs text-black">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(story.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
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

                  {/* Options Menu for own stories only */}
                  {story.author.id === userId && (
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowMenuForStory(showMenuForStory === story.id ? null : story.id)
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="h-5 w-5 text-slate-900" />
                      </button>

                      {showMenuForStory === story.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1 w-44 z-20">
                          <button
                            onClick={() => {
                              setShowMenuForStory(null)
                              router.push(`/dashboard/yatra/${story.id}/edit`)
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-900 font-medium"
                          >
                            <Edit2 className="h-4 w-4 text-orange-600" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(story.id)}
                            disabled={deletingStory === story.id}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            {deletingStory === story.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Image */}
                {/* {story.safeVisuals && story.safeVisuals.length > 0 && (
                  <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                    <Image
                      src={story.safeVisuals[0]}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                )} */}

                {/* Full Story Content */}
                <div className="px-4 pt-3">
                  <div className="mb-6 space-y-6">
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                      {story.title}
                    </h2>

                    {/* Heritage Site Info */}
                    {/* <div className="flex items-start gap-3 p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                      <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-orange-900 mb-1">
                          {story.heritageSite.title}
                        </p>
                        {story.heritageSite.images[0]?.location && (
                          <p className="text-sm text-orange-700">
                            {story.heritageSite.images[0].location}
                          </p>
                        )}
                      </div>
                    </div> */}

                    {/* Discovery Context */}
                    {story.discoveryContext && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-amber-800" style={{ fontFamily: 'Georgia, serif' }}>Discovery Context</span>
                        </h3>
                        <div className="text-amber-900/80 leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                          {story.discoveryContext}
                        </div>
                      </div>
                    )}

                    {/* Journey Narrative */}
                    {story.journeyNarrative && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-amber-800" style={{ fontFamily: 'Georgia, serif' }}>Journey Narrative</span>
                        </h3>
                        <div className="text-amber-900/80 leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                          {story.journeyNarrative}
                        </div>
                      </div>
                    )}

                    {/* Cultural Insights */}
                    {story.culturalInsights && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-amber-800" style={{ fontFamily: 'Georgia, serif' }}>Cultural Insights</span>
                        </h3>
                        <div className="text-amber-900/80 leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
                          {story.culturalInsights}
                        </div>
                      </div>
                    )}


                    {/* Evidence Types */}
                    {/* {story.evidenceTypes && story.evidenceTypes.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">Evidence Types</h3>
                        <div className="flex flex-wrap gap-2">
                          {story.evidenceTypes.map((evidence, index) => (
                            <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                              {evidence}
                            </span>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* All Safe Visuals */}
                    {/* {story.safeVisuals && story.safeVisuals.length > 1 && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          All Images ({story.safeVisuals.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {story.safeVisuals.map((imageUrl, index) => (
                            <div key={index} className="aspect-square bg-slate-100 relative rounded-xl overflow-hidden border-2 border-slate-200 hover:border-orange-300 transition-colors">
                              <Image
                                src={imageUrl}
                                alt={`Image ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 50vw, 33vw"
                                className="object-cover"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* Personal Reflection */}
                    {story.personalReflection && (
                      <div className="space-y-2 ">
                        <h3 className="text-lg font-bold text-amber-800" style={{ fontFamily: 'Georgia, serif' }}>Personal Reflection</h3>
                        <div className="text-amber-900/80 leading-relaxed whitespace-pre-line bg-amber-50/80 p-4 rounded-xl border-l-4 border-amber-600">
                          <p className="italic">{story.personalReflection}</p>
                        </div>
                      </div>
                    )}
                  </div>

                   {story.historicalIndicators && story.historicalIndicators.length > 0 && (
                      <div className="space-y-2">
                        {/* <h3 className="text-lg font-bold text-slate-900">Historical Indicators</h3> */}
                        <div className="flex flex-wrap gap-2">
                          {story.historicalIndicators.map((indicator, index) => (
                            <span key={index} className="px-3 py-1.5 bg-amber-100/80 text-amber-800 rounded-full text-sm font-medium border border-amber-200/60">
                              # {indicator}
                            </span>
                          ))}
                        </div>
                        {story.historicalIndicatorsDetails && (
                          <div className="text-amber-900/80 leading-relaxed whitespace-pre-line bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 mt-2">
                            {story.historicalIndicatorsDetails}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Divider */}
                  <div className="border-t border-amber-200/40 my-4"></div>

                  {/* Post Actions - Moved to Bottom */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(story.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          likedStories[story.id]
                            ? 'text-red-600'
                            : 'text-black hover:text-red-600'
                        }`}
                      >
                        <Heart className={`h-6 w-6 ${likedStories[story.id] ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">
                          {likeCounts[story.id] || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleComment(story.id)}
                        className="flex items-center gap-1.5 text-amber-900 hover:text-amber-700 transition-colors"
                      >
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-sm font-medium">
                          {commentCounts[story.id] || 0}
                        </span>
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowShareMenu(showShareMenu === story.id ? null : story.id)
                          }}
                          className="text-amber-900 hover:text-amber-700 transition-colors"
                        >
                          <Share2 className="h-6 w-6" />
                        </button>
                        {showShareMenu === story.id && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-slate-200 py-2 w-40 z-20">
                            <button
                              onClick={() => handleShare(story.id, 'whatsapp', story.title)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-900"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleShare(story.id, 'facebook', story.title)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-900"
                            >
                              Facebook
                            </button>
                            <button
                              onClick={() => handleShare(story.id, 'twitter', story.title)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 text-slate-900"
                            >
                              Twitter
                            </button>
                            <button
                              onClick={() => handleShare(story.id, 'copy', story.title)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 border-t border-slate-100 text-slate-900"
                            >
                              <LinkIcon className="h-4 w-4 inline mr-2" />
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
                          ? 'text-amber-700'
                          : 'text-amber-900 hover:text-amber-700'
                      }`}
                    >
                      <Bookmark className={`h-6 w-6 ${savedStories.has(story.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {(story.author.id === userId || isAdmin) && (
                    <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(story.publishStatus)}
                        {isAdmin && getLocationVerificationBadge(story)}
                      </div>

                      {/* Admin Approval Actions */}
                      {isAdmin && story.publishStatus === 'PENDING_REVIEW' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveAction(story.id, 'approve')}
                            disabled={approvingStory === story.id}
                            className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproveAction(story.id, 'feature')}
                            disabled={approvingStory === story.id}
                            className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Feature
                          </button>
                        </div>
                      )}
                      {isAdmin && story.publishStatus !== 'PENDING_REVIEW' && (
                        <button
                          onClick={() => handleApproveAction(story.id, 'reject')}
                          disabled={approvingStory === story.id}
                          className="px-3 py-1 bg-slate-500 text-white text-xs font-semibold rounded-md hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Unpublish
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Comments Section */}
                {showCommentBox === story.id && (
                  <div className="border-t border-amber-200/60 p-4 bg-amber-50/30">
                    {/* Comment Input */}
                    <div className="mb-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full px-3 py-2 border-2 border-amber-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-amber-900 placeholder:text-amber-600/40 bg-white/60 resize-none"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={() => submitComment(story.id)}
                          disabled={submittingComment || !commentText.trim()}
                          className="px-4 py-1.5 text-sm font-semibold text-amber-50 bg-amber-800 hover:bg-amber-900 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submittingComment ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {loadingComments ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
                        </div>
                      ) : comments[story.id] && comments[story.id].length > 0 ? (
                        comments[story.id].map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="h-8 w-8 rounded-full bg-linear-to-br from-amber-700 to-amber-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {comment.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 bg-white rounded-lg px-3 py-2 border border-slate-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-bold text-slate-900">{comment.user.name}</p>
                                {(comment.userId === userId || isAdmin) && (
                                  <button
                                    onClick={() => deleteComment(story.id, comment.id)}
                                    disabled={deletingComment === comment.id}
                                    className="p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                              <p className="text-sm text-slate-900">{comment.comment}</p>
                              <p className="text-xs text-black mt-1">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-900">
                          <p className="text-sm">No comments yet</p>
                          <p className="text-xs mt-1">Be the first to comment</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            ))}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-8 mt-4">
                <div className="flex items-center gap-3 text-amber-700">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>Loading more stories...</span>
                </div>
              </div>
            )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>No Stories Found</h3>
            <p className="text-amber-800/70 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setVerificationFilter('all')
              }}
              className="px-6 py-2.5 bg-amber-800 text-amber-50 font-semibold rounded-full hover:bg-amber-900 transition-colors shadow-lg shadow-amber-900/20"
            >
              Clear Filters
            </button>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <MapPin className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {isAdmin ? 'No Stories Yet' : 'Share Your First Story'}
          </h3>
          <p className="text-amber-800/70 mb-6">
            {isAdmin
              ? 'No heritage stories have been shared yet.'
              : 'Start documenting your heritage discoveries.'}
          </p>
          {!isAdmin && (
            <Link
              href="/dashboard/yatra/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800 text-amber-50 font-bold rounded-full hover:bg-amber-900 transition-colors shadow-lg shadow-amber-900/20"
            >
              <Plus className="h-5 w-5" />
              Create Story
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
