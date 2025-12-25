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
          <div className="relative overflow-hidden bg-linear-to-br from-orange-600 via-amber-600 to-orange-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 tracking-tight">
                  Preserve Our Heritage
                </h1>
                <p className="text-orange-50 text-sm sm:text-base lg:text-lg font-medium max-w-2xl">
                  Document and share India's cultural treasures with the world
                </p>
              </div>
              <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 opacity-20 self-end sm:self-auto animate-pulse" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <button
              onClick={() => setShowUploadModal(true)}
              className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-orange-400 group text-left hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-orange-100 to-amber-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-orange-500 to-amber-600 p-3 sm:p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-0.5 sm:mb-1">Upload Site</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Document new discovery</p>
                </div>
              </div>
            </button>

            <Link
              href="/dashboard/yatra"
              className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-purple-400 group hover:-translate-y-1 active:scale-95"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-purple-100 to-pink-100 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="bg-linear-to-br from-purple-500 to-pink-600 p-3 sm:p-4 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-0.5 sm:mb-1">Yatra</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Share your journey</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Floating Support Button */}
          <Link
            href="/dashboard/support"
            className="fixed bottom-6 right-6 z-40 group"
          >
            <div className="relative">
              <div className="bg-linear-to-br from-blue-500 to-cyan-600 p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                  Get Support
                </div>
              </div>
            </div>
          </Link>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-lg">
                    <MapPin className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{sites?.length || 0}</p>
                <p className="text-xs sm:text-sm text-indigo-100 font-medium">Heritage Sites</p>
              </div>
            </div>

            {/* <div className="relative overflow-hidden bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
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
            </div> */}

            <div className="relative overflow-hidden bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-lg">
                    <Camera className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{totalImages}</p>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">Total Images</p>
              </div>
            </div>

            <div className="relative overflow-hidden bg-linear-to-br from-amber-600 via-orange-600 to-amber-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl text-white">
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -mr-10 sm:-mr-12 -mt-10 sm:-mt-12"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-lg">
                    <Award className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold mb-1">{completedPayments}</p>
                <p className="text-xs sm:text-sm text-amber-100 font-medium">Paid Sites</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 lg:p-7 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-5 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              Payment History
            </h2>
            <PaymentHistory />
          </div>

          {/* Sites Section with modern header */}
          <div className="relative bg-linear-to-br from-white via-orange-50/30 to-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-6 lg:p-8 border border-slate-200/50 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-100 via-amber-100 to-orange-100 rounded-full blur-3xl opacity-30 -mr-32 -mt-32 animate-pulse" />

            <div className="relative">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Glassmorphic icon container */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl blur opacity-30" />
                    <div className="relative p-2 sm:p-3 bg-linear-to-br from-orange-500 via-amber-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-slate-900 via-orange-900 to-amber-900 bg-clip-text text-transparent">
                      {isShowingDefaults ? 'Example Heritage Sites' : 'Your Heritage Sites'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                      {isShowingDefaults ? 'Discover & Get Inspired' : `${sites?.length || 0} sites documented`}
                    </p>
                  </div>
                </div>
              </div>

              {isShowingDefaults && (
                <div className="relative bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-amber-100/50 to-transparent" />
                  <div className="relative flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-700" />
                    </div>
                    <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
                      These are example heritage sites to inspire you. Upload your first site to start documenting India's rich cultural heritage!
                    </p>
                  </div>
                  
                </div>
              )}

              {filteredSites && filteredSites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-fr">
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
                <div className="text-center py-16 sm:py-20">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-amber-500 rounded-full blur-2xl opacity-20" />
                    <div className="relative bg-linear-to-br from-orange-100 to-amber-100 p-6 rounded-full">
                      <MapPin className="h-16 w-16 sm:h-20 sm:w-20 text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-6">No heritage sites yet</h3>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-md mx-auto">Start your journey by uploading your first discovery!</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Modal - Modern Glassmorphism Design */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              {/* Enhanced Backdrop with blur */}
              <div
                className="fixed inset-0 bg-linear-to-br from-black/80 via-slate-900/60 to-black/80 backdrop-blur-md"
                onClick={() => setShowUploadModal(false)}
              />

              {/* Modal Container with animated entrance */}
              <div className="relative w-full max-w-4xl my-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Glow effect behind modal */}
                <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl blur-2xl opacity-30 animate-pulse" />

                <div className="relative bg-linear-to-br from-white via-orange-50/20 to-white rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)] border border-slate-200/50">
                  {/* Modal Header - Glassmorphic */}
                  <div className="sticky top-0 bg-linear-to-r from-orange-500 via-amber-500 to-orange-600 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-20 shadow-xl border-b border-white/20">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/30 rounded-xl blur" />
                        <div className="relative bg-white/20 backdrop-blur-xl p-2 sm:p-2.5 rounded-xl border border-white/30">
                          <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white">Upload Heritage Site</h2>
                        <p className="text-xs sm:text-sm text-white/90 font-medium">Share your discovery with the world</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-white hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110 active:scale-95 shrink-0 backdrop-blur-sm"
                      aria-label="Close modal"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Content - Scrollable with gradient background */}
                  <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-5 sm:p-6 lg:p-8 bg-linear-to-br from-white via-orange-50/20 to-white">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
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
