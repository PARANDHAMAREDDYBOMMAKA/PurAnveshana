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
          <div className="relative overflow-hidden bg-linear-to-br from-orange-600 via-amber-600 to-orange-500 rounded-3xl p-8 sm:p-10 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                  Preserve Our Heritage
                </h1>
                <p className="text-orange-50 text-base sm:text-lg font-medium max-w-2xl">
                  Document and share India's cultural treasures with the world
                </p>
              </div>
              <Sparkles className="h-20 w-20 opacity-20 hidden lg:block animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <button
              onClick={() => setShowUploadModal(true)}
              className="relative overflow-hidden bg-white rounded-2xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-orange-400 group text-left hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-orange-100 to-amber-100 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-4">
                <div className="bg-linear-to-br from-orange-500 to-amber-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Upload Site</h3>
                  <p className="text-sm text-gray-600">Document new discovery</p>
                </div>
              </div>
            </button>

            <Link
              href="/dashboard/yatra"
              className="relative overflow-hidden bg-white rounded-2xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-purple-400 group hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-pink-100 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-4">
                <div className="bg-linear-to-br from-purple-500 to-pink-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Yatra Stories</h3>
                  <p className="text-sm text-gray-600">Share your journey</p>
                </div>
              </div>
            </Link>

            <Link
              href="/dashboard/support"
              className="relative overflow-hidden bg-white rounded-2xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-400 group hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-cyan-100 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex items-center gap-4">
                <div className="bg-linear-to-br from-blue-500 to-cyan-600 p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">Support</h3>
                  <p className="text-sm text-gray-600">Get assistance</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="relative overflow-hidden bg-linear-to-br from-orange-500 to-amber-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <TrendingUp className="h-6 w-6 text-white/80" />
                </div>
                <p className="text-4xl font-bold mb-1">{sites?.length || 0}</p>
                <p className="text-sm text-orange-100 font-medium">Heritage Sites</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    {totalImages > 0 ? Math.round((verifiedImages / totalImages) * 100) : 0}%
                  </span>
                </div>
                <p className="text-4xl font-bold mb-1">{verifiedImages}</p>
                <p className="text-sm text-green-100 font-medium">Verified Images</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Camera className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold mb-1">{totalImages}</p>
                <p className="text-sm text-blue-100 font-medium">Total Images</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold mb-1">{completedPayments}</p>
                <p className="text-sm text-purple-100 font-medium">Paid Sites</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              Payment History
            </h2>
            <PaymentHistory />
          </div>

          {/* Sites Section */}
          <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              {isShowingDefaults ? 'Example Heritage Sites' : 'Your Heritage Sites'}
            </h2>
            {isShowingDefaults && (
              <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 font-medium leading-relaxed">
                    These are example heritage sites to inspire you. Upload your first site to start documenting India's rich cultural heritage!
                  </p>
                </div>
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
