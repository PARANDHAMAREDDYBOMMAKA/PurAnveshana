
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Settings, LogOut } from 'lucide-react'

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

  const getInitials = (email?: string) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl border border-amber-200/40 hover:border-amber-300/60 transition-all duration-200 shadow-sm hover:shadow-md"
        style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.6) 0%, rgba(255, 248, 237, 0.6) 100%)' }}
      >
        <div className="bg-linear-to-br from-amber-700 to-amber-800 rounded-xl w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0 shadow-md shadow-amber-900/20">
          <span className="text-amber-50 text-xs lg:text-sm font-bold">{getInitials(userEmail)}</span>
        </div>
        <span className="text-xs lg:text-sm text-amber-900 font-medium truncate max-w-[100px] lg:max-w-[150px]">{userEmail}</span>
        <svg
          className={`w-4 h-4 text-amber-700/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile Button - handled by Navbar */}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl py-2 z-50 border border-amber-200/60 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 8px 32px rgba(139, 90, 43, 0.15)' }}
        >
          {/* Corner decorations */}
          <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t border-l border-amber-300/60 rounded-tl-sm"></div>
          <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t border-r border-amber-300/60 rounded-tr-sm"></div>
          <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b border-l border-amber-300/60 rounded-bl-sm"></div>
          <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b border-r border-amber-300/60 rounded-br-sm"></div>

          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-amber-200/40">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-amber-700 to-amber-800 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 shadow-md shadow-amber-900/20">
                <span className="text-amber-50 text-base font-bold">{getInitials(userEmail)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-amber-700/60 mb-0.5">Signed in as</p>
                <p className="text-sm font-semibold text-amber-900 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1.5 px-2">
            <button
              onClick={() => {
                setIsOpen(false)
                router.push('/profile')
              }}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-amber-900/80 hover:bg-amber-100/50 rounded-lg transition-colors"
            >
              <Settings className="w-4.5 h-4.5 mr-3 text-amber-700/60" />
              <span style={{ fontFamily: 'Georgia, serif' }}>Profile Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50/60 rounded-lg transition-colors"
            >
              <LogOut className="w-4.5 h-4.5 mr-3" />
              <span style={{ fontFamily: 'Georgia, serif' }}>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
