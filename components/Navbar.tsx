'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileDropdown from './ProfileDropdown'
import NotificationBell from './NotificationBell'
import LanguageSelector from './LanguageSelector'
import GuidedTour from './GuidedTour'
import { HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export default function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [runTour, setRunTour] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted')
    if (!tourCompleted) {
      setTimeout(() => setRunTour(true), 2000)
    }
  }, [])

  // Get initials from email
  const getInitials = (email?: string) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  return (
    <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 max-w-xs sm:max-w-sm overflow-hidden" data-tour="logo">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-amber-500 rounded-lg blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative bg-linear-to-br from-orange-500 to-amber-600 p-2 sm:p-2.5 md:p-3 rounded-lg shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden leading-tight">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent truncate">
                Puranveshana
              </h1>
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-orange-600 font-medium notranslate truncate" translate="no">
                पुरातन अन्वेषण
              </span>
            </div>
            {isAdmin && (
              <span className="hidden xl:inline-block ml-2 px-3 py-1 text-xs font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* Navigation Cards */}
            <div className="flex items-center gap-2">
              {/* Yatra Card */}
              <button
                onClick={() => router.push('/dashboard/yatra')}
                className="group relative overflow-hidden px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">Yatra</span>
                </div>
              </button>

              {/* Anveshan Card */}
              <button
                onClick={() => router.push('/dashboard')}
                className="group relative overflow-hidden px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">Anveshan</span>
                </div>
              </button>

              {/* Payments Card */}
              <button
                onClick={() => router.push('/dashboard/payment-history')}
                className="group relative overflow-hidden px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">Payments</span>
                </div>
              </button>

              {/* Support Card */}
              <button
                onClick={() => router.push('/dashboard/support')}
                className="group relative overflow-hidden px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">Support</span>
                </div>
              </button>
            </div>

            {/* Admin Badge */}
            {isAdmin && (
              <span className="xl:hidden px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}

            <div data-tour="language-selector">
              <LanguageSelector />
            </div>
            <button
              onClick={() => setRunTour(true)}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="Take a guided tour"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Tour</span>
            </button>
            <div data-tour="notifications">
              <NotificationBell />
            </div>
            <div data-tour="profile">
              <ProfileDropdown userEmail={userEmail} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1">
            {isAdmin && (
              <span className="px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                ADMIN
              </span>
            )}
            <LanguageSelector />
            <button
              onClick={() => setRunTour(true)}
              className="flex items-center justify-center w-7 h-7 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Take a guided tour"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            <NotificationBell />
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center bg-linear-to-br from-orange-500 to-amber-600 rounded-full w-7 h-7 shadow-md hover:shadow-lg transition-shadow"
                aria-label="Toggle menu"
                data-tour="profile"
              >
                <span className="text-white text-sm font-bold">{getInitials(userEmail)}</span>
              </button>

              {/* Mobile Menu Popover */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="bg-linear-to-br from-orange-500 to-amber-600 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <span className="text-white text-base font-bold">{getInitials(userEmail)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Options */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        router.push('/profile')
                      }}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                    >
                      <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Profile Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                      <svg className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <GuidedTour runTour={runTour} onTourEnd={() => setRunTour(false)} />
    </nav>
  )
}
