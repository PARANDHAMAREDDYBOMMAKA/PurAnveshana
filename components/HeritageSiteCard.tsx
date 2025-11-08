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
    createdAt: string
    paymentStatus?: string
    paymentAmount?: number
    images: Array<{
      id: string
      location: string
      cloudinaryUrl: string
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

  // Helper function to detect if URL is a video
  const isVideo = (url: string) => url.includes('/video/upload/')

  return (
    <>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1">
        {/* Main Image Display */}
        <div className="relative">
          <div className="relative h-36 sm:h-40 md:h-44 bg-linear-to-br from-orange-100 to-amber-100 overflow-hidden group">
            {isVideo(currentImage.cloudinaryUrl) ? (
              <video
                src={currentImage.cloudinaryUrl}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                controls
                onClick={() => setShowFullImage(true)}
              />
            ) : (
              <Image
                src={currentImage.cloudinaryUrl}
                alt={site.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                onClick={() => setShowFullImage(true)}
              />
            )}

            {/* Verified Badge */}
            {currentImage.isVerified && (
              <div className="absolute top-4 right-4 bg-linear-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-bold">
                {selectedImage + 1} / {site.images.length}
              </div>
            </div>

            {/* View Full Button */}
            <button
              onClick={() => setShowFullImage(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-orange-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Full
            </button>
          </div>

          {/* Thumbnail Strip */}
          {site.images.length > 1 && (
            <div className="bg-linear-to-r from-slate-50 via-orange-50/30 to-slate-50 p-3 sm:p-4 border-t-2 border-orange-100">
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-slate-100">
                {site.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-3 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-orange-500 scale-105 shadow-xl ring-2 ring-orange-300 ring-offset-2'
                        : 'border-slate-300 hover:border-orange-300 hover:shadow-lg'
                    }`}
                  >
                    {isVideo(img.cloudinaryUrl) ? (
                      <video
                        src={img.cloudinaryUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={img.cloudinaryUrl}
                        alt={`${site.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    )}
                    {img.isVerified && (
                      <div className="absolute top-1 right-1 bg-green-500 text-white p-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <div className="p-4 sm:p-5 border-b border-orange-100/50">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 flex-1 leading-tight">{site.title}</h3>
            {canEdit && (
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <p className={`text-sm text-slate-600 leading-relaxed ${!isDescriptionExpanded && site.description.length > 100 ? 'line-clamp-2' : ''}`}>
              {site.description}
            </p>
            {site.description.length > 150 && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm mt-2 inline-flex items-center gap-1"
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Show less</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Current Image Details */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Location */}
          <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-lg p-3 sm:p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-orange-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-semibold text-orange-700">Location</span>
              {currentImage.gpsLatitude && currentImage.gpsLongitude && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ml-auto">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  GPS Verified
                </span>
              )}
            </div>
            <p className="text-slate-900 font-medium text-sm mb-3">{currentImage.location}</p>
            <div className="flex flex-wrap gap-2">
              {currentImage.gpsLatitude && currentImage.gpsLongitude ? (
                <a
                  href={`https://www.google.com/maps?q=${currentImage.gpsLatitude},${currentImage.gpsLongitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Open in Maps</span>
                </a>
              ) : (
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(currentImage.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search on Maps</span>
                </a>
              )}
              {showUser && (
                <Link
                  href={`/maps/${site.id}`}
                  className="inline-flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm hover:shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span>Route from Bengaluru</span>
                </Link>
              )}
            </div>
          </div>

          {/* Site Metadata */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-slate-500 font-medium">Created</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {new Date(site.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-2.5 sm:p-3 border border-green-200">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
              <p className="text-sm font-semibold text-green-900">{verifiedCount} of {site.images.length}</p>
            </div>

            {showUser && site.profile && (
              <div className="bg-amber-50 rounded-lg p-2.5 sm:p-3 border border-amber-200 col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs text-amber-600 font-medium">Submitted by</span>
                </div>
                <p className="text-sm font-semibold text-amber-900 truncate">{site.profile.email}</p>
                {site.profile.mobileNumber && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-amber-200">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm font-semibold text-amber-900">{site.profile.mobileNumber}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(site.profile?.mobileNumber || '')
                        toast.success('Mobile number copied!')
                      }}
                      className="text-xs text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-colors"
                    >
                      Copy for UPI
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className={`rounded-lg p-2.5 sm:p-3 border col-span-2 ${
              site.paymentStatus === 'COMPLETED' ? 'bg-green-50 border-green-200' :
              site.paymentStatus === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200' :
              'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <svg className={`w-4 h-4 ${
                    site.paymentStatus === 'COMPLETED' ? 'text-green-600' :
                    site.paymentStatus === 'IN_PROGRESS' ? 'text-blue-600' :
                    'text-slate-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-xs font-medium ${
                    site.paymentStatus === 'COMPLETED' ? 'text-green-600' :
                    site.paymentStatus === 'IN_PROGRESS' ? 'text-blue-600' :
                    'text-slate-600'
                  }`}>Payment</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  site.paymentStatus === 'COMPLETED' ? 'bg-green-200 text-green-800' :
                  site.paymentStatus === 'IN_PROGRESS' ? 'bg-blue-200 text-blue-800' :
                  'bg-slate-200 text-slate-800'
                }`}>
                  {site.paymentStatus?.replace('_', ' ')}
                </span>
              </div>
              <p className={`text-lg font-bold ${
                site.paymentStatus === 'COMPLETED' ? 'text-green-900' :
                site.paymentStatus === 'IN_PROGRESS' ? 'text-blue-900' :
                'text-slate-900'
              }`}>
                ₹{site.paymentAmount?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
          </div>

          {showUser && site.paymentStatus !== 'COMPLETED' && (
            <div className="pt-2 border-t border-orange-100 mt-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">Admin Payment Actions</h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  disabled={isLoading}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-[10px] sm:text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Record Payment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-12 right-0 text-white hover:text-orange-400 transition-colors"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full max-h-[90vh]">
              {isVideo(currentImage.cloudinaryUrl) ? (
                <video
                  src={currentImage.cloudinaryUrl}
                  controls
                  className="w-full h-full max-h-[90vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <Image
                  src={currentImage.cloudinaryUrl}
                  alt={site.title}
                  width={1920}
                  height={1080}
                  className="object-contain w-full h-full rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-2xl font-bold text-white mb-2">{site.title}</h3>
              <p className="text-white/90 text-sm mb-1">{currentImage.location}</p>
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
