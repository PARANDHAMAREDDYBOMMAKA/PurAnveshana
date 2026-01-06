
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface ProfileDropdownProps {
  userEmail?: string
}

export default function ProfileDropdown({ userEmail }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      localStorage.removeItem('yatraPromptShown')

      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  // Get initials from email
  const getInitials = (email?: string) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 bg-linear-to-r from-slate-50 to-slate-100 hover:from-orange-50 hover:to-amber-50 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl border border-slate-200 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="bg-linear-to-br from-orange-500 to-amber-600 rounded-full w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0">
          <span className="text-white text-xs lg:text-sm font-bold">{getInitials(userEmail)}</span>
        </div>
        <span className="text-xs lg:text-sm text-slate-700 font-medium truncate max-w-[100px] lg:max-w-[150px]">{userEmail}</span>
        <svg
          className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden flex items-center justify-center bg-linear-to-br from-orange-500 to-amber-600 rounded-full w-9 h-9 shadow-md hover:shadow-lg transition-shadow"
      >
        <span className="text-white text-sm font-bold">{getInitials(userEmail)}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
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

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/profile')
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
            >
              <CogIcon className="w-5 h-5 mr-3 text-slate-500 group-hover:text-orange-600" />
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-slate-500 group-hover:text-red-600" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
