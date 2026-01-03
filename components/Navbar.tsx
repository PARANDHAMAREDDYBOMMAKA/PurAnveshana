'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileDropdown from './ProfileDropdown'

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export default function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-none">
            <div className="relative group shrink-0">
              <div className="absolute inset-0 bg-linear-to-br from-orange-400 to-amber-500 rounded-xl blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse"></div>
              <div className="absolute inset-0 bg-linear-to-br from-orange-300 to-amber-400 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="relative bg-linear-to-br from-orange-500 to-amber-600 p-3 sm:p-4 rounded-xl shadow-2xl shadow-orange-500/50">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                Puranveshana
              </h1>
              <span className="text-xs sm:text-sm lg:text-base text-orange-600 font-medium -mt-0.5 notranslate" translate="no">
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
            {/* Navigation Links */}
            <div className="flex items-center gap-1 lg:gap-2">
              <button
                onClick={() => router.push('/dashboard/yatra')}
                className="px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                Yatra
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                Anveshan
              </button>
              <button
                onClick={() => router.push('/dashboard/payment-history')}
                className="px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                Payments
              </button>
              <button
                onClick={() => router.push('/dashboard/support')}
                className="px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                Support
              </button>
            </div>

            {/* Admin Badge */}
            {isAdmin && (
              <span className="xl:hidden px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}

            <ProfileDropdown userEmail={userEmail} />
          </div>

          {/* Mobile Menu Button and Profile */}
          <div className="flex md:hidden items-center gap-2">
            {isAdmin && (
              <span className="px-2 py-1 text-[9px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}
            <ProfileDropdown userEmail={userEmail} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => {
                router.push('/dashboard/yatra')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Yatra
            </button>
            <button
              onClick={() => {
                router.push('/dashboard')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Anveshan
            </button>
            <button
              onClick={() => {
                router.push('/dashboard/payment-history')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payments
            </button>
            <button
              onClick={() => {
                router.push('/dashboard/support')
                setIsMobileMenuOpen(false)
              }}
              className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Support
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
