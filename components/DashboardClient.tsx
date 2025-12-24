'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import HeritageSiteCard from './HeritageSiteCard'
import ImageUploadForm from './ImageUploadForm'
import PaymentHistory from './PaymentHistory'
import YatraPromptModal from './YatraPromptModal'
import { defaultHeritageSites } from '@/lib/defaultHeritageSites'
import {
  Upload,
  MapPin,
  Award,
  Camera,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Search,
  Filter,
  BarChart3,
  AlertCircle,
  Sparkles
} from 'lucide-react'

interface DashboardClientProps {
  images: any[]
  isAdmin: boolean
  onUploadSuccess?: () => void
}

export default function DashboardClient({ images: initialSites, isAdmin, onUploadSuccess }: DashboardClientProps) {
  const displaySites = !isAdmin && (!initialSites || initialSites.length === 0)
    ? defaultHeritageSites
    : initialSites

  const [sites, setSites] = useState(displaySites)
  const [paymentFilter, setPaymentFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    const newDisplaySites = !isAdmin && (!initialSites || initialSites.length === 0)
      ? defaultHeritageSites
      : initialSites
    setSites(newDisplaySites)
  }, [initialSites, isAdmin])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showUploadModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showUploadModal])

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showUploadModal) {
        setShowUploadModal(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showUploadModal])

  const handleUploadComplete = useCallback(() => {
    if (onUploadSuccess) {
      onUploadSuccess()
    }
    setShowUploadModal(false) // Close modal after successful upload
  }, [onUploadSuccess])

  const isShowingDefaults = !isAdmin && (!initialSites || initialSites.length === 0)

  const filteredSites = sites?.filter((site: any) => {
    const matchesPayment = !paymentFilter || site.paymentStatus === paymentFilter
    const matchesSearch = !searchQuery ||
      site.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.type?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesPayment && matchesSearch
  }) || []

  const statsSource = isShowingDefaults ? [] : initialSites
  const totalImages = statsSource?.reduce((acc, site) => acc + (site.images?.length || 0), 0) || 0
  const verifiedImages = statsSource?.reduce((acc, site) =>
    acc + (site.images?.filter((img: any) => img.isVerified).length || 0), 0
  ) || 0

  // Admin-specific stats
  const pendingPayments = sites?.filter((site: any) => site.paymentStatus === 'NOT_STARTED').length || 0
  const inProgressPayments = sites?.filter((site: any) => site.paymentStatus === 'IN_PROGRESS').length || 0
  const completedPayments = sites?.filter((site: any) => site.paymentStatus === 'COMPLETED').length || 0
  const uniqueUsers = [...new Set(sites?.map((site: any) => site.userId))].length || 0

  return (
    <>
      {!isAdmin && <YatraPromptModal />}

      {/* User Dashboard */}
      {!isAdmin && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Welcome to Your Heritage Dashboard
                </h1>
                <p className="text-orange-100 text-sm sm:text-base">
                  Discover, document, and preserve India's cultural treasures
                </p>
              </div>
              <Sparkles className="h-16 w-16 opacity-30 hidden sm:block" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-orange-100 hover:border-orange-300 group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-orange-500 to-amber-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Upload Site</h3>
                  <p className="text-xs text-gray-600">Add new discovery</p>
                </div>
              </div>
            </button>

            <Link
              href="/dashboard/yatra"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-orange-100 hover:border-orange-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-purple-500 to-pink-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Yatra Stories</h3>
                  <p className="text-xs text-gray-600">Share your journey</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/support"
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-orange-100 hover:border-orange-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-blue-500 to-cyan-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Support</h3>
                  <p className="text-xs text-gray-600">Get help</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-100">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{sites?.length || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Heritage Sites</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {totalImages > 0 ? Math.round((verifiedImages / totalImages) * 100) : 0}%
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{verifiedImages}</p>
              <p className="text-sm text-gray-600 mt-1">Verified Images</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalImages}</p>
              <p className="text-sm text-gray-600 mt-1">Total Images</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{completedPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Paid Sites</p>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-orange-600" />
              Payment History
            </h2>
            <PaymentHistory />
          </div>

          {/* Sites Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {isShowingDefaults ? 'Example Heritage Sites - Get Inspired!' : 'Your Heritage Sites'}
            </h2>
            {isShowingDefaults && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  These are example heritage sites to inspire you. Upload your first site to start documenting!
                </p>
              </div>
            )}

            {filteredSites && filteredSites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 auto-rows-fr">
                {filteredSites.map((site: any) => (
                  <HeritageSiteCard
                    key={site.id}
                    site={site}
                    showUser={false}
                    isOwner={!isShowingDefaults}
                    onUpdate={onUploadSuccess}
                    userId={site.userId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No heritage sites yet</h3>
                <p className="text-sm text-gray-600 mt-2">Start your journey by uploading your first discovery!</p>
              </div>
            )}
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowUploadModal(false)}
              />

              {/* Modal Container */}
              <div className="relative w-full max-w-4xl my-8 z-10">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)]">
                  {/* Modal Header - Fixed */}
                  <div className="sticky top-0 bg-linear-to-r from-orange-500 to-amber-600 px-6 py-4 flex items-center justify-between z-20 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Upload Heritage Site</h2>
                        <p className="text-sm text-orange-100">Share your discovery with the world</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors shrink-0"
                      aria-label="Close modal"
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Content - Scrollable */}
                  <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-6">
                    <ImageUploadForm onUploadComplete={handleUploadComplete} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Dashboard */}
      {isAdmin && (
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="bg-linear-to-r from-slate-800 via-slate-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                  <BarChart3 className="h-8 w-8" />
                  Admin Dashboard
                </h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Manage heritage sites, payments, and user submissions
                </p>
              </div>
            </div>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{sites?.length || 0}</p>
              <p className="text-sm text-gray-600 mt-1">Total Sites</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{uniqueUsers}</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{pendingPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Pending Payments</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{completedPayments}</p>
              <p className="text-sm text-gray-600 mt-1">Completed</p>
            </div>
          </div>

          {/* Payment Status Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-slate-700" />
              Payment Status Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-900">{pendingPayments}</span>
                </div>
                <p className="text-sm font-semibold text-orange-700">Not Started</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-yellow-900">{inProgressPayments}</span>
                </div>
                <p className="text-sm font-semibold text-yellow-700">In Progress</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-900">{completedPayments}</span>
                </div>
                <p className="text-sm font-semibold text-green-700">Completed</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-100">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sites by title, type, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select
                  className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm font-medium bg-white text-gray-900"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="">All Payment Status</option>
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                {(paymentFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setPaymentFilter('')
                      setSearchQuery('')
                    }}
                    className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {(paymentFilter || searchQuery) && (
              <div className="mt-4 text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredSites.length}</span> of{' '}
                <span className="font-bold text-gray-900">{sites?.length || 0}</span> sites
              </div>
            )}
          </div>

          {/* Heritage Sites Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-slate-700" />
              All Heritage Sites
            </h2>

            {filteredSites && filteredSites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 auto-rows-fr">
                {filteredSites.map((site: any) => (
                  <HeritageSiteCard
                    key={site.id}
                    site={site}
                    showUser={true}
                    isOwner={false}
                    onUpdate={onUploadSuccess}
                    userId={site.userId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No sites found</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {searchQuery || paymentFilter
                    ? 'Try adjusting your filters or search query'
                    : 'No heritage sites have been uploaded yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
