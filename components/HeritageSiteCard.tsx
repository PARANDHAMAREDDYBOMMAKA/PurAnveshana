'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, memo } from 'react'
import toast from 'react-hot-toast'
import {
  MapPin,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Eye,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  BadgeCheck
} from 'lucide-react'

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

const HeritageSiteCard = memo(function HeritageSiteCard({
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
  const [touchStart, setTouchStart] = useState<number>(0)
  const [touchEnd, setTouchEnd] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState<number>(0)

  const canEdit = false

  const handleTouchStart = (e: React.TouchEvent) => {
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

    const canSwipeLeft = selectedImage < site.images.length - 1
    const canSwipeRight = selectedImage > 0

    if ((diff < 0 && !canSwipeLeft) || (diff > 0 && !canSwipeRight)) {
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
    const isLeftSwipe = distance > 75
    const isRightSwipe = distance < -75

    if (isLeftSwipe && selectedImage < site.images.length - 1) {
      setSelectedImage(selectedImage + 1)
    } else if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }

    setIsDragging(false)
    setDragOffset(0)
    setTouchStart(0)
    setTouchEnd(0)
  }

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

  if (!site.images || site.images.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-amber-200/60 p-6">
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
  const getImageUrl = (img: typeof currentImage) => img.r2Url || img.cloudinaryUrl || ''
  const isVideo = (url: string | null | undefined) => {
    if (!url) return false
    return url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')
  }
  const currentImageUrl = getImageUrl(currentImage)

  const typeColors: Record<string, string> = {
    'TEMPLE': 'bg-purple-100 text-purple-700 border-purple-200',
    'FORT_PALACE': 'bg-red-100 text-red-700 border-red-200',
    'CAVES_ROCK_CUT': 'bg-amber-100 text-amber-700 border-amber-200',
    'RUINS': 'bg-slate-100 text-slate-700 border-slate-200',
    'INSCRIPTIONS': 'bg-blue-100 text-blue-700 border-blue-200',
    'ROCK_ART': 'bg-pink-100 text-pink-700 border-pink-200',
    'MEGALITHIC_SITE': 'bg-stone-100 text-stone-700 border-stone-200',
    'BURIAL_SITE': 'bg-gray-100 text-gray-700 border-gray-200',
    'WATER_STRUCTURE': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'ANCIENT_SETTLEMENT': 'bg-lime-100 text-lime-700 border-lime-200',
    'ARTIFACT_FOUND': 'bg-amber-100 text-amber-700 border-amber-200',
  }

  const typeColor = site.type ? (typeColors[site.type] || 'bg-gray-100 text-gray-700 border-gray-200') : 'bg-gray-100 text-gray-700 border-gray-200'
  const typeLabel = site.type?.replace(/_/g, ' ') || 'Unknown'

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden border border-amber-200/60 transition-all duration-500 flex flex-col h-full hover:-translate-y-1" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.1)' }}>
        <div className="relative h-52 overflow-hidden bg-linear-to-br from-slate-100 via-slate-50 to-blue-50">
          {isVideo(currentImageUrl) ? (
            <video
              src={currentImageUrl}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Image
              src={currentImageUrl}
              alt={site.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {site.type && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl bg-white/90 border shadow-lg ${typeColor.replace('bg-', 'border-')}`}>
                {typeLabel}
              </span>
            </div>
          )}

          {site.paymentStatus && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-xl flex items-center gap-1.5 shadow-lg border ${
                site.paymentStatus === 'COMPLETED' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
                site.paymentStatus === 'IN_PROGRESS' ? 'bg-amber-500/90 border-amber-400 text-white' :
                'bg-slate-500/90 border-slate-400 text-white'
              }`}>
                {site.paymentStatus === 'COMPLETED' && <CheckCircle className="h-3.5 w-3.5" />}
                {site.paymentStatus === 'IN_PROGRESS' && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                {site.paymentStatus === 'COMPLETED' && site.paymentAmount ? `Paid ₹${site.paymentAmount}` :
                 site.paymentStatus === 'COMPLETED' ? 'Paid' :
                 site.paymentStatus === 'IN_PROGRESS' ? 'Processing' :
                 'Pending'}
              </span>
            </div>
          )}

          {site.images.length > 1 && (
            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/70 backdrop-blur-xl border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
              <Camera className="h-3.5 w-3.5" />
              {site.images.length}
            </div>
          )}

          {verifiedCount > 0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-50" />
              <div className="relative bg-emerald-500/90 backdrop-blur-xl border border-emerald-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <BadgeCheck className="h-3.5 w-3.5" />
                {verifiedCount} Verified
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-3 line-clamp-2 transition-colors leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {site.title}
          </h3>

          <p className="text-sm text-amber-800/70 mb-4 line-clamp-3 flex-1 leading-relaxed">
            {site.description}
          </p>

          <div className="space-y-2.5 mb-4">
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-amber-700 shrink-0" />
              </div>
              <span className="truncate font-medium">{currentImage.location}</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              </div>
              <span className="font-medium">{new Date(site.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            {showUser && site.profile?.email && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <svg className="h-3.5 w-3.5 text-purple-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="truncate font-medium">{site.profile.email}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-amber-200/50">
            <button
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 bg-amber-800 hover:bg-amber-900 rounded-full shadow-md shadow-amber-900/20 hover:shadow-lg transition-all"
            >
              <div className="text-amber-50 font-semibold py-3 px-4 flex items-center justify-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm">View Details</span>
              </div>
            </button>

            {showUser && site.paymentStatus !== 'COMPLETED' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowPaymentModal(true)
                }}
                className="bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-700 font-semibold p-2.5 rounded-xl transition-all shadow-sm hover:shadow-md"
                title="Record Payment"
              >
                <DollarSign className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetailsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-4 sm:my-8 mx-auto overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto">
              <div
                className="relative w-full bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center"
                style={{ height: '500px' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className={`relative w-full h-full flex items-center justify-center p-4 ${
                    isDragging ? '' : 'transition-all duration-300 ease-out'
                  }`}
                  style={{
                    transform: `translateX(${dragOffset}px)`,
                    opacity: isDragging ? Math.max(0.7, 1 - Math.abs(dragOffset) / 800) : 1,
                  }}
                >
                  {isVideo(currentImageUrl) ? (
                    <video
                      src={currentImageUrl}
                      controls
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={currentImageUrl}
                      alt={site.title}
                      width={1200}
                      height={800}
                      className="object-contain max-w-full max-h-full"
                    />
                  )}
                </div>

                {site.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                      disabled={selectedImage === 0}
                      className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                    >
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage(Math.min(site.images.length - 1, selectedImage + 1))}
                      disabled={selectedImage === site.images.length - 1}
                      className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                    >
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {site.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/70 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-10">
                    {selectedImage + 1} / {site.images.length}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{site.title}</h2>
                    {site.type && (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border-2 ${typeColor}`}>
                        {typeLabel}
                      </span>
                    )}
                  </div>
                  {site.paymentStatus && (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      site.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      site.paymentStatus === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {site.paymentStatus === 'COMPLETED' && site.paymentAmount ? `✓ Paid ₹${site.paymentAmount}` :
                       site.paymentStatus === 'COMPLETED' ? '✓ Paid' :
                       site.paymentStatus === 'IN_PROGRESS' ? 'Processing' :
                       'Pending Payment'}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{site.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-amber-700" />
                      <span className="font-semibold text-gray-900">Location</span>
                    </div>
                    <p className="text-sm text-gray-600">{currentImage.location}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-gray-900">Uploaded</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(site.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="h-5 w-5 text-purple-500" />
                      <span className="font-semibold text-gray-900">Total Images</span>
                    </div>
                    <p className="text-sm text-gray-600">{site.images.length} image{site.images.length !== 1 ? 's' : ''}</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BadgeCheck className="h-5 w-5 text-green-500" />
                      <span className="font-semibold text-gray-900">Verified</span>
                    </div>
                    <p className="text-sm text-gray-600">{verifiedCount} of {site.images.length} verified</p>
                  </div>
                </div>

                {site.referenceLinks && site.referenceLinks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Reference Links</h3>
                    <div className="space-y-2">
                      {site.referenceLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {showUser && site.paymentStatus !== 'COMPLETED' && (
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setShowPaymentModal(true)
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <DollarSign className="h-5 w-5" />
                      Record Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Record Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Enter transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="flex-1 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Record Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

export default HeritageSiteCard
