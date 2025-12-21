
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { UserIcon, CogIcon, ArrowLeftOnRectangleIcon as LogoutIcon } from '@heroicons/react/24/outline'

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

      toast.success('Logged out successfully')
      router.push('/')
      router.refresh()
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"
      >
        <UserIcon className="w-5 h-5 text-slate-600" />
        <span className="text-xs text-slate-700 font-medium truncate max-w-[120px] xl:max-w-none">{userEmail}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={() => {}} // Disabled for now
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <CogIcon className="w-5 h-5 mr-2" />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogoutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
