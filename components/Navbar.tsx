'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import GoogleTranslate from './GoogleTranslate'

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export default function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()

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
      router.refresh()
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  return (
    <nav className="bg-linear-to-r from-white to-orange-50 shadow-lg border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-linear-to-br from-orange-500 to-amber-600 p-2 sm:p-2.5 rounded-lg shadow-md shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                Puranveshana
              </h1>
              <span className="text-[10px] sm:text-xs text-orange-600 font-semibold -mt-1">
                पुरातन अन्वेषण
              </span>
            </div>
            {isAdmin && (
              <span className="hidden sm:inline-block ml-2 px-3 py-1.5 text-xs font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {isAdmin && (
              <span className="sm:hidden px-2 py-1 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white shadow-md">
                ADMIN
              </span>
            )}
            <GoogleTranslate />
            <div className="hidden md:flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-orange-200">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs sm:text-sm text-orange-700 font-bold truncate max-w-[150px] lg:max-w-none">{userEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg transition-all transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
