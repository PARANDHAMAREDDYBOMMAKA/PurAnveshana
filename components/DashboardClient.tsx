'use client'

import { useState, useCallback, useEffect, memo } from 'react'
import Link from 'next/link'
import HeritageSiteCard from './HeritageSiteCard'
import ImageUploadForm from './ImageUploadForm'
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

const DashboardClient = memo(function DashboardClient({ images: initialSites, isAdmin, onUploadSuccess }: DashboardClientProps) {
  const displaySites = !isAdmin && (!initialSites || initialSites.length === 0)
    ? defaultHeritageSites
    : initialSites

  const [sites, setSites] = useState(displaySites)
  const [paymentFilter, setPaymentFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [yatraStats, setYatraStats] = useState({ total: 0, pendingReview: 0 })
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const newDisplaySites = !isAdmin && (!initialSites || initialSites.length === 0)
      ? defaultHeritageSites
      : initialSites
    setSites(newDisplaySites)
  }, [initialSites, isAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/yatra')
        .then(res => res.json())
        .then(data => {
          const total = data.stories?.length || 0
          const pendingReview = data.stories?.filter((story: any) => story.publishStatus === 'PENDING_REVIEW').length || 0
          setYatraStats({ total, pendingReview })
        })
        .catch(err => console.error('Error fetching yatra stats:', err))
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      fetch('/api/admin/users/count')
        .then(res => res.json())
        .then(data => {
          setTotalUsers(data.count || 0)
        })
        .catch(err => console.error('Error fetching user count:', err))
    }
  }, [isAdmin])

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
    setShowUploadModal(false)
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

  const pendingPayments = sites?.filter((site: any) => site.paymentStatus === 'NOT_STARTED').length || 0
  const inProgressPayments = sites?.filter((site: any) => site.paymentStatus === 'IN_PROGRESS').length || 0
  const completedPayments = sites?.filter((site: any) => site.paymentStatus === 'COMPLETED').length || 0

  return (
    <>
      {!isAdmin && <YatraPromptModal />}

      {!isAdmin && (
        <div className="space-y-6 sm:space-y-8">
          <div className="relative w-full rounded-2xl p-5 sm:p-6 shadow-lg mb-2 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
              boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08)',
            }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)' }}></div>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>Anveshan</h2>
                <p className="text-sm sm:text-base text-amber-800/70 mt-0.5" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Discover ancient sites. Get rewarded.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="relative w-full rounded-xl border border-amber-200/60 p-5 sm:p-6 hover:border-amber-300 transition-all duration-300 group overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}
          >
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="p-3 sm:p-4 bg-amber-100 rounded-xl group-hover:bg-amber-200/80 transition-colors">
                <Upload className="h-7 w-7 sm:h-8 sm:w-8 text-amber-700" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-amber-900 text-xl sm:text-2xl mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                  Upload Heritage Site
                </h3>
                <p className="text-sm sm:text-base text-amber-800/70 font-medium">
                  Document ancient discoveries and earn rewards
                </p>
              </div>
              <svg className="hidden sm:block w-7 h-7 text-amber-700 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute bottom-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute bottom-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>
          </button>

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

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: MapPin, value: isShowingDefaults ? 0 : (sites?.length || 0), label: 'Sites' },
              { icon: Camera, value: isShowingDefaults ? 0 : totalImages, label: 'Images' },
              { icon: Award, value: isShowingDefaults ? 0 : completedPayments, label: 'Rewarded' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg sm:rounded-xl p-3 sm:p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-amber-100 p-1.5 sm:p-3 rounded-lg">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-amber-700" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-amber-800/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-amber-200/60 overflow-hidden" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 4px 24px rgba(139, 90, 43, 0.12)' }}>
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 left-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 left-3 w-px h-6 bg-amber-300/60"></div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-3 right-3 w-6 h-px bg-amber-300/60"></div>
              <div className="absolute top-3 right-3 w-px h-6 bg-amber-300/60"></div>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-amber-100 rounded-xl">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                      {isShowingDefaults ? 'Example Heritage Sites' : 'Your Heritage Sites'}
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-800/70 mt-0.5">
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
                  <MapPin className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-amber-900 mt-2" style={{ fontFamily: 'Georgia, serif' }}>No heritage sites yet</h3>
                  <p className="text-sm sm:text-base text-amber-800/70 mt-2 max-w-md mx-auto">Start your journey by uploading your first discovery!</p>
                </div>
              )}
            </div>
          </div>

          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowUploadModal(false)}
              />

              <div className="relative w-full max-w-4xl my-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="relative rounded-3xl shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)] border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)' }}>
                  <div className="sticky top-0 z-20 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-amber-200/60" style={{ background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 50%, #e8d5b8 100%)' }}>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-amber-800 p-2.5 rounded-xl shadow-md shadow-amber-900/20">
                        <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-amber-50" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>Upload Heritage Site</h2>
                        <p className="text-xs sm:text-sm text-amber-800/70 font-medium">Share your discovery with the world</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="text-amber-700 hover:bg-amber-100/60 p-2 rounded-xl transition-all"
                      aria-label="Close modal"
                    >
                      <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="overflow-y-auto max-h-[calc(100vh-12rem)] p-5 sm:p-6 lg:p-8">
                    <ImageUploadForm onUploadComplete={handleUploadComplete} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="space-y-6">
          <div className="relative w-full rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
              boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08)',
            }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)' }}></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent"></div>
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-700/30"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-700/30"></div>
            <div className="relative flex items-center gap-3">
              <div className="bg-amber-800 p-3 rounded-xl shadow-lg shadow-amber-900/30">
                <BarChart3 className="h-7 w-7 text-amber-50" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-amber-800/70" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Manage heritage sites, payments, and user submissions</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: MapPin, value: sites?.length || 0, label: 'Sites' },
              { icon: Users, value: totalUsers, label: 'Users' },
              { icon: Sparkles, value: yatraStats.total, label: 'Yatra Stories' },
              { icon: AlertCircle, value: yatraStats.pendingReview, label: 'Needs Review' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg sm:rounded-xl p-3 sm:p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="bg-amber-100 p-1.5 sm:p-3 rounded-lg">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-amber-700" />
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-amber-800/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
            <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <DollarSign className="h-6 w-6 text-amber-700" />
              Payment Status Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="h-5 w-5 text-amber-700" />
                  <span className="text-2xl font-bold text-amber-900">{pendingPayments}</span>
                </div>
                <p className="text-sm font-semibold text-amber-800/70">Not Started</p>
              </div>

              <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-5 w-5 text-amber-700" />
                  <span className="text-2xl font-bold text-amber-900">{inProgressPayments}</span>
                </div>
                <p className="text-sm font-semibold text-amber-800/70">In Progress</p>
              </div>

              <div className="bg-amber-50/80 rounded-lg p-4 border border-amber-200/60">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-5 w-5 text-amber-700" />
                  <span className="text-2xl font-bold text-amber-900">{completedPayments}</span>
                </div>
                <p className="text-sm font-semibold text-amber-800/70">Completed</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/50" />
                  <input
                    type="text"
                    placeholder="Search sites by title, type, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-amber-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-amber-900 placeholder:text-amber-600/40 bg-white/60"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-amber-700" />
                <select
                  className="px-4 py-3 border-2 border-amber-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium bg-white/60 text-amber-900"
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
                    className="px-4 py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full text-sm font-semibold transition-all"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {(paymentFilter || searchQuery) && (
              <div className="mt-4 text-sm text-amber-800/70">
                Showing <span className="font-bold text-amber-900">{filteredSites.length}</span> of{' '}
                <span className="font-bold text-amber-900">{sites?.length || 0}</span> sites
              </div>
            )}
          </div>

          <div className="rounded-xl p-6 border border-amber-200/60" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 2px 12px rgba(139, 90, 43, 0.08)' }}>
            <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
              <MapPin className="h-6 w-6 text-amber-700" />
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
                <Search className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>No sites found</h3>
                <p className="text-sm text-amber-800/70 mt-2">
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
})

export default DashboardClient
