'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Edit2,
  Trash2,
  AlertTriangle,
  Footprints,
  BookOpen,
  Camera,
  Eye,
  Lock
} from 'lucide-react'

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
  isOwnStory: boolean
}

export default function YatraStoryDetail({
  story,
  currentUserId,
  isOwnStory,
}: YatraStoryDetailProps) {
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

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

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this heritage discovery: ${story.title}`

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(url)
      toast.success('Link copied!')
      setShowShareMenu(false)
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank')
      setShowShareMenu(false)
    }
  }

  const mainImage =
    story.heritageSite.images[0]?.r2Url ||
    story.heritageSite.images[0]?.cloudinaryUrl

  const allImages = story.heritageSite.images.filter(img => img.r2Url || img.cloudinaryUrl)

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back Button - More Prominent */}
        <Link
          href="/dashboard/yatra"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2.5 bg-white text-gray-900 hover:bg-gray-50 rounded-xl shadow-sm border-2 border-gray-200 transition-all hover:shadow-md font-medium"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Stories</span>
        </Link>

        {/* Main Card */}
        <article className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-orange-100">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {story.author.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {story.author.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(story.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                    {story.heritageSite.type && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-orange-700">{story.heritageSite.type.replace(/_/g, ' ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/yatra/${story.id}/edit`}
                    className="p-2.5 hover:bg-white rounded-xl transition-colors"
                    title="Edit Story"
                  >
                    <Edit2 className="h-5 w-5 text-orange-600" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2.5 hover:bg-white rounded-xl transition-colors"
                    title="Delete Story"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Hero Image */}
          {mainImage ? (
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
              <img
                src={mainImage}
                alt={story.heritageSite.title}
                className={`w-full h-full object-cover ${!isOwnStory ? 'blur-lg' : ''}`}
              />
              {!isOwnStory && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl text-center max-w-md mx-4 shadow-2xl border-2 border-orange-200">
                    <Lock className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                    <p className="text-lg font-bold text-gray-900 mb-1">Image Protected</p>
                    <p className="text-sm text-gray-600">Images are blurred to protect exact site locations</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <MapPin className="h-24 w-24 text-gray-400" />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  setLiked(!liked)
                  toast.success(liked ? 'Removed from favorites' : 'Added to favorites!')
                }}
                className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
                title="Like"
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-semibold hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
              </button>
              <button
                onClick={() => toast.success('Comments coming soon!')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
                title="Comment"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm font-semibold hidden sm:inline">Comment</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-500 transition-colors"
                  title="Share"
                >
                  <Share2 className="h-6 w-6" />
                  <span className="text-sm font-semibold hidden sm:inline">Share</span>
                </button>
                {showShareMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 py-2 w-48 z-10">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      📱 WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      👥 Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      🐦 Twitter
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      🔗 Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setSaved(!saved)
                toast.success(saved ? 'Removed from saved!' : 'Saved to collection!')
              }}
              className={`transition-colors ${saved ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'}`}
              title="Save"
            >
              <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-8">
            {/* Heritage Site Info */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
              <MapPin className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-orange-900 text-lg mb-1">
                  {story.heritageSite.title}
                </p>
                {story.heritageSite.images[0]?.location && (
                  <p className="text-sm text-orange-700">
                    📍 {story.heritageSite.images[0].location}
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                {story.title}
              </h1>
            </div>

            {/* Journey Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 rounded-xl">
                  <Footprints className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Journey</h2>
              </div>
              <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line pl-14">
                {story.journeyNarrative}
              </div>
            </section>

            {/* Cultural Insights */}
            {story.culturalInsights && (
              <section className="space-y-4 pt-6 border-t-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Cultural Insights</h2>
                </div>
                <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line pl-14">
                  {story.culturalInsights}
                </div>
              </section>
            )}

            {/* Image Gallery */}
            {allImages.length > 1 && (
              <section className="space-y-4 pt-6 border-t-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-100 rounded-xl">
                    <Camera className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {allImages.length} photos
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pl-14">
                  {allImages.slice(1).map((image) => {
                    const imageUrl = image.r2Url || image.cloudinaryUrl
                    if (!imageUrl) return null
                    return (
                      <div key={image.id} className="aspect-square bg-gray-100 relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-colors">
                        <img
                          src={imageUrl}
                          alt={story.heritageSite.title}
                          className={`w-full h-full object-cover ${!isOwnStory ? 'blur-lg' : ''}`}
                        />
                        {!isOwnStory && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Lock className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* CTA */}
            <div className="pt-6 border-t-2 border-gray-100">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-3">
                  ✨ Inspired by this story?
                </h3>
                <p className="text-white/90 mb-6 text-lg">
                  Share your own discovery and help preserve our heritage
                </p>
                <Link
                  href="/dashboard/yatra/create"
                  className="inline-block px-8 py-3.5 bg-white text-orange-600 font-bold rounded-full hover:shadow-2xl transition-all hover:scale-105"
                >
                  Share Your Journey
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Story?
              </h3>
              <p className="text-gray-600">
                This action cannot be undone. Your story will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              >
                {deleting ? 'Deleting...' : 'Delete Forever'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all"
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
