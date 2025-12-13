'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface HeritageSiteCardProps {
  site: {
    id: string
    title: string
    description: string
    type?: string | null
    referenceLinks?: string[]
    createdAt: string
    paymentStatus?: string
    paymentAmount?: number
    images: Array<{
      id: string
      location: string
      cloudinaryUrl?: string | null
      r2Url?: string | null
      isVerified: boolean
      cameraModel: string | null
      gpsLatitude: number | null
      gpsLongitude: number | null
      createdAt: string
    }>
    profile?: {
      email: string
      mobileNumber?: string | null
    }
  }
  showUser?: boolean
  isOwner?: boolean
  onUpdate?: () => void
  userId?: string
}

export default function HeritageSiteCard({
  site,
  showUser = false,
  isOwner = false,
  onUpdate,
  userId
}: HeritageSiteCardProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0)
  const [showFullImage, setShowFullImage] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editTitle, setEditTitle] = useState(site.title)
  const [editDescription, setEditDescription] = useState(site.description)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [transactionId, setTransactionId] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Disable edit/delete for all users - only admins can edit/delete via admin panel
  const canEdit = false

  const handleEdit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: site.id,
          title: editTitle,
          description: editDescription,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to update heritage site')
        return
      }

      toast.success('Heritage site updated successfully!')
      setShowEditModal(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('An error occurred while updating')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/images?siteId=${site.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete heritage site')
        return
      }

      toast.success('Heritage site deleted successfully!')
      setShowDeleteConfirm(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('An error occurred while deleting')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!paymentAmount || !userId) {
      toast.error('Please enter payment amount')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          heritageSiteId: site.id,
          amount: paymentAmount,
          paymentMethod,
          transactionId: transactionId || null,
          notes: paymentNotes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to record payment')
        return
      }

      toast.success('Payment recorded successfully!')
      setShowPaymentModal(false)
      setPaymentAmount('')
      setTransactionId('')
      setPaymentNotes('')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('An error occurred while recording payment')
    } finally {
      setIsLoading(false)
    }
  }

  // Safety check for images
  if (!site.images || site.images.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100 p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{site.title}</h3>
        <p className="text-slate-600 mb-4">{site.description}</p>
        <div className="text-center py-8 bg-slate-50 rounded-lg">
          <p className="text-slate-500">No images uploaded for this site yet</p>
        </div>
      </div>
    )
  }

  const currentImage = site.images[selectedImage]
  const verifiedCount = site.images.filter(img => img.isVerified).length

  // Helper function to get the image URL (R2 or Cloudinary)
  const getImageUrl = (img: typeof currentImage) => img.r2Url || img.cloudinaryUrl || ''

  // Helper function to detect if URL is a video
  const isVideo = (url: string | null | undefined) => {
    if (!url) return false
    return url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')
  }

  const currentImageUrl = getImageUrl(currentImage)

  return (
    <>
      {/* Simplified Card - Click to view details */}
      <div
        onClick={() => setShowDetailsModal(true)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-slate-200 hover:border-orange-400 transition-all duration-300 cursor-pointer group flex flex-col h-full"
      >
        {/* Main Image */}
        <div className="relative h-56 sm:h-64 bg-linear-to-br from-slate-100 to-slate-50 overflow-hidden shrink-0">
          {isVideo(currentImageUrl) ? (
            <video
              src={currentImageUrl}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <Image
              src={currentImageUrl}
              alt={site.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

          {/* Status Badge */}
          {site.paymentStatus && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                site.paymentStatus === 'COMPLETED' ? 'bg-green-500/90 text-white' :
                site.paymentStatus === 'IN_PROGRESS' ? 'bg-blue-500/90 text-white' :
                'bg-slate-500/90 text-white'
              }`}>
                {site.paymentStatus === 'COMPLETED' ? '✓ Paid' :
                 site.paymentStatus === 'IN_PROGRESS' ? 'Processing' :
                 'Pending'}
              </span>
            </div>
          )}

          {/* Image count */}
          {site.images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {site.images.length}
            </div>
          )}

          {/* Title at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">{site.title}</h3>
            <p className="text-white/90 text-sm line-clamp-2 drop-shadow-md">{site.description}</p>
          </div>
        </div>

        {/* Quick Info Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600 flex-1 min-w-0">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium truncate">{currentImage.location}</span>
            </div>
            <button className="text-orange-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all shrink-0 ml-2">
              View Details
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Beautiful Details Modal */}
      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-4 sm:my-8 mx-auto overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Hero Image */}
            <div className="relative w-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center" style={{ minHeight: '300px', maxHeight: '500px' }}>
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {isVideo(currentImageUrl) ? (
                  <video
                    src={currentImageUrl}
                    controls
                    className="max-w-full max-h-full object-contain"
                    style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
                  />
                ) : (
                  <div className="relative w-full" style={{ maxHeight: '500px', aspectRatio: 'auto' }}>
                    <Image
                      src={currentImageUrl}
                      alt={site.title}
                      width={896}
                      height={500}
                      className="w-full h-auto object-contain mx-auto"
                      style={{ maxHeight: '500px' }}
                      sizes="(max-width: 896px) 100vw, 896px"
                      priority
                    />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFullImage(true)
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                View Full Image
              </button>
            </div>

            {/* Image Gallery Thumbnails */}
            {site.images.length > 1 && (
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-slate-200">
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {site.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-orange-500 ring-2 ring-orange-200 scale-105'
                          : 'border-slate-300 hover:border-orange-300 hover:scale-105'
                      }`}
                    >
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        {isVideo(getImageUrl(img)) ? (
                          <video
                            src={getImageUrl(img)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={getImageUrl(img)}
                            alt={`Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                      </div>
                      {/* Image number badge */}
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-tl font-semibold">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content - Scrollable */}
            <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
              {/* Title & Actions */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{site.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{site.description}</p>
                </div>
                {canEdit && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowEditModal(true)
                      }}
                      className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowDeleteConfirm(true)
                      }}
                      className="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="space-y-6">
                {/* Location */}
                <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wide">Location</h3>
                        {currentImage.gpsLatitude && currentImage.gpsLongitude && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            GPS Verified
                          </span>
                        )}
                      </div>
                      <p className="text-slate-900 font-semibold mb-3">{currentImage.location}</p>
                      {showUser && (
                        <div className="flex flex-wrap gap-2">
                          {currentImage.gpsLatitude && currentImage.gpsLongitude ? (
                            <a
                              href={`https://www.google.com/maps?q=${currentImage.gpsLatitude},${currentImage.gpsLongitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              Open in Google Maps
                            </a>
                          ) : (
                            <a
                              href={`https://www.google.com/maps/search/${encodeURIComponent(currentImage.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              Search on Maps
                            </a>
                          )}
                          <Link
                            href={`/maps/${site.id}`}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            Get Directions
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Site Type */}
                {site.type && (
                  <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide mb-2">Heritage Type</h3>
                        <p className="text-slate-900 font-semibold text-lg">
                          {site.type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reference Links */}
                {site.referenceLinks && site.referenceLinks.length > 0 && site.referenceLinks.some(link => link.trim()) && (
                  <div className="bg-linear-to-br from-cyan-50 to-sky-50 rounded-2xl p-5 border border-cyan-100">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-cyan-900 uppercase tracking-wide mb-3">Reference Links</h3>
                        <div className="space-y-2">
                          {site.referenceLinks.filter(link => link.trim()).map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-cyan-700 hover:text-cyan-900 font-medium hover:underline break-all group"
                            >
                              <svg className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Created</p>
                        <p className="text-base font-bold text-slate-900">
                          {new Date(site.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Total Images</p>
                        <p className="text-base font-bold text-slate-900">{site.images.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Info - Admin */}
                {showUser && site.profile && (
                  <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">Submitted By</h3>
                        <p className="text-slate-900 font-semibold mb-1">{site.profile.email}</p>
                        {site.profile.mobileNumber && (
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-sm font-semibold text-slate-700">{site.profile.mobileNumber}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(site.profile?.mobileNumber || '')
                                toast.success('Mobile number copied!')
                              }}
                              className="text-xs text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                            >
                              Copy Number
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className={`rounded-2xl p-5 border ${
                  site.paymentStatus === 'COMPLETED' ? 'bg-linear-to-br from-green-50 to-emerald-50 border-green-100' :
                  site.paymentStatus === 'IN_PROGRESS' ? 'bg-linear-to-br from-blue-50 to-sky-50 border-blue-100' :
                  'bg-linear-to-br from-slate-50 to-gray-50 border-slate-200'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                      site.paymentStatus === 'COMPLETED' ? 'bg-green-100' :
                      site.paymentStatus === 'IN_PROGRESS' ? 'bg-blue-100' :
                      'bg-slate-200'
                    }`}>
                      <svg className={`w-6 h-6 ${
                        site.paymentStatus === 'COMPLETED' ? 'text-green-600' :
                        site.paymentStatus === 'IN_PROGRESS' ? 'text-blue-600' :
                        'text-slate-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-sm font-bold uppercase tracking-wide ${
                          site.paymentStatus === 'COMPLETED' ? 'text-green-900' :
                          site.paymentStatus === 'IN_PROGRESS' ? 'text-blue-900' :
                          'text-slate-700'
                        }`}>Payment</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          site.paymentStatus === 'COMPLETED' ? 'bg-green-200 text-green-800' :
                          site.paymentStatus === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
                          'bg-slate-200 text-slate-800'
                        }`}>
                          {site.paymentStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        ₹{site.paymentAmount?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {showUser && site.paymentStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setShowDetailsModal(false)
                      setShowPaymentModal(true)
                    }}
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    💰 Record Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-0"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative w-full h-full max-w-screen max-h-screen flex flex-col items-center justify-center">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 text-white hover:text-orange-400 transition-colors z-10 bg-black/50 rounded-full p-2"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full flex items-center justify-center p-4 pb-24 sm:pb-32">
              {isVideo(currentImageUrl) ? (
                <video
                  src={currentImageUrl}
                  controls
                  className="max-w-full max-h-full object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="relative w-full h-full max-w-full max-h-full">
                  <Image
                    src={currentImageUrl}
                    alt={site.title}
                    fill
                    className="object-contain rounded-lg"
                    sizes="100vw"
                    onClick={(e) => e.stopPropagation()}
                    priority
                  />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-4 sm:p-6">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">{site.title}</h3>
              <p className="text-white/90 text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">{currentImage.location}</p>
              <p className="text-white/70 text-xs">Image {selectedImage + 1} of {site.images.length}</p>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Edit Heritage Site</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none text-slate-900"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={isLoading || !editTitle || !editDescription}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Heritage Site?</h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{site.title}"? This action cannot be undone and all images will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Record Payment</h3>
            <p className="text-slate-600 mb-4 text-sm">
              <span className="font-semibold">Heritage Site:</span> {site.title}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none text-slate-900"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Check">Check</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Optional notes"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-orange-500 focus:outline-none resize-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  disabled={isLoading}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isLoading || !paymentAmount}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Recording...' : 'Record Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
