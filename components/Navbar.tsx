'use client'

import { useRouter } from 'next/navigation'
import ProfileDropdown from './ProfileDropdown'

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export default function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()

  return (
    <nav className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="bg-linear-to-br from-orange-500 to-amber-600 p-1.5 sm:p-2 rounded-lg shadow-sm shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight truncate">
                Puranveshana
              </h1>
              <span className="text-[9px] sm:text-xs text-orange-600 font-medium -mt-0.5 notranslate" translate="no">
                पुरातन अन्वेषण
              </span>
            </div>
            {isAdmin && (
              <span className="hidden lg:inline-block ml-1 px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                ADMIN
              </span>
            )}
          </div>

          {/* Navigation Links and Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Navigation Links */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/dashboard/yatra')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Yatra</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
              <button
                onClick={() => router.push('/dashboard/support')}
                className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Support</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>

            {/* Admin Badge Mobile */}
            {isAdmin && (
              <span className="lg:hidden px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                ADMIN
              </span>
            )}

            <ProfileDropdown userEmail={userEmail} />
          </div>
        </div>
      </div>
    </nav>
  )
}
