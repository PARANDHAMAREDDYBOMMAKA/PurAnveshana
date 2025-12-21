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
  Camera
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
}

export default function YatraStoryDetail({
  story,
  currentUserId,
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
    <div className="mx-auto max-w-2xl pb-12">
      {/* Back Button */}
      <Link
        href="/dashboard/yatra"
        className="inline-flex items-center gap-2 mb-4 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back</span>
      </Link>

      {/* Main Post */}
      <article className="bg-white border-b border-gray-200">
        {/* Post Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
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

          {/* Actions Menu */}
          <div className="flex items-center gap-2">
            {isAuthor && (
              <>
                <Link
                  href={`/dashboard/yatra/${story.id}/edit`}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-gray-900" />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {mainImage ? (
          <div className="w-full aspect-square bg-gray-100">
            <img
              src={mainImage}
              alt={story.heritageSite.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full aspect-square bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <MapPin className="h-24 w-24 text-gray-900" />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setLiked(!liked)
                toast.success(liked ? 'Removed from favorites' : 'Added to favorites')
              }}
              className={`transition-colors ${liked ? 'text-red-500' : 'text-gray-900 hover:text-red-500'}`}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => toast.success('Comments coming soon')}
              className="text-gray-900 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="text-gray-900 hover:text-green-500 transition-colors relative"
            >
              <Share2 className="h-6 w-6" />
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-40 z-10">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </button>
          </div>
          <button
            onClick={() => {
              setSaved(!saved)
              toast.success(saved ? 'Removed from saved' : 'Saved to collection')
            }}
            className={`transition-colors ${saved ? 'text-orange-500' : 'text-gray-900 hover:text-orange-500'}`}
          >
            <Bookmark className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Heritage Site */}
          <div className="flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="font-bold text-orange-600">
              {story.heritageSite.title}
            </span>
            {story.heritageSite.images[0]?.location && (
              <>
                <span className="text-gray-900">•</span>
                <span className="text-gray-900">
                  {story.heritageSite.images[0].location}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {story.title}
            </h1>
          </div>

          {/* Journey Section */}
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Footprints className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">The Journey</h2>
            </div>
            <div className="text-gray-900 leading-relaxed whitespace-pre-line">
              {story.journeyNarrative}
            </div>
          </section>

          {/* Cultural Insights */}
          <section className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Cultural Insights</h2>
            </div>
            <div className="text-gray-900 leading-relaxed whitespace-pre-line">
              {story.culturalInsights}
            </div>
          </section>

          {/* Image Gallery */}
          {allImages.length > 1 && (
            <section className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Gallery</h2>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {allImages.slice(1).map((image) => {
                  const imageUrl = image.r2Url || image.cloudinaryUrl
                  if (!imageUrl) return null
                  return (
                    <div key={image.id} className="aspect-square bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={story.heritageSite.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="pt-4 border-t border-gray-100">
            <div className="bg-linear-to-r from-orange-50 to-amber-50 rounded-xl p-6 text-center border border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Inspired by this story?
              </h3>
              <p className="text-sm text-gray-900 mb-4">
                Share your own discovery and help preserve our heritage
              </p>
              <Link
                href="/dashboard/yatra/create"
                className="inline-block px-6 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-full hover:shadow-lg transition-all"
              >
                Share Your Journey
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Story?
              </h3>
              <p className="text-sm text-gray-900">
                This action cannot be undone
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
