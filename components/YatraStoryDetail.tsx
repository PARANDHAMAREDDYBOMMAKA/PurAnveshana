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
  Eye,
  CheckCircle,
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
          <div className="px-6 py-5 bg-linear-to-r from-orange-50 to-amber-50 border-b-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
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
          <div className="px-6 py-8 space-y-6">
            {/* Heritage Site Info */}
            <div className="flex items-start gap-3 p-4 bg-linear-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
              <MapPin className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
              <div className="flex-1">
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

            {/* Discovery Context */}
            {story.discoveryContext && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Eye className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Discovery Context</h2>
                </div>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {story.discoveryContext}
                </div>
              </section>
            )}

            {/* Journey Narrative */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Footprints className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Journey Narrative</h2>
              </div>
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                {story.journeyNarrative}
              </div>
            </section>

            {/* Historical Indicators */}
            {story.historicalIndicators && story.historicalIndicators.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Historical Indicators</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.historicalIndicators.map((indicator, index) => (
                    <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200">
                      {indicator}
                    </span>
                  ))}
                </div>
                {story.historicalIndicatorsDetails && (
                  <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2">
                    {story.historicalIndicatorsDetails}
                  </div>
                )}
              </section>
            )}

            {/* Evidence Types */}
            {story.evidenceTypes && story.evidenceTypes.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Evidence Types</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {story.evidenceTypes.map((evidence, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                      {evidence}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Safe Visuals */}
            {story.safeVisuals && story.safeVisuals.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Eye className="h-5 w-5 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Safe Visuals</h2>
                  <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {story.safeVisuals.length} image{story.safeVisuals.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {story.safeVisuals.map((imageUrl, index) => (
                    <div key={index} className="aspect-square bg-gray-100 relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-teal-300 transition-colors">
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
              </section>
            )}

            {/* Personal Reflection */}
            {story.personalReflection && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="h-5 w-5 text-pink-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Personal Reflection</h2>
                </div>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {story.personalReflection}
                </div>
              </section>
            )}

            {/* Cultural Insights */}
            {story.culturalInsights && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Cultural Insights</h2>
                </div>
                <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200">
                  {story.culturalInsights}
                </div>
              </section>
            )}

            {/* Publish Status */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Publication Status</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  story.publishStatus === 'APPROVED_PUBLIC' ? 'bg-green-100 text-green-800 border border-green-200' :
                  story.publishStatus === 'FEATURED_YATRA' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  'bg-orange-100 text-orange-800 border border-orange-200'
                }`}>
                  {story.publishStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </section>

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
