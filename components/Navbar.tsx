'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileDropdown from './ProfileDropdown'
import NotificationBell from './NotificationBell'
import LanguageSelector from './LanguageSelector'
import { MapPin, Map, Home, Wallet, HeadphonesIcon, X, Settings, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export default function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getInitials = (email?: string) => {
    if (!email) return 'U'
    return email.charAt(0).toUpperCase()
  }

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

  const navItems = [
    { label: 'Yatra', icon: Map, path: '/dashboard/yatra', color: 'orange' },
    { label: 'Anveshan', icon: Home, path: '/dashboard', color: 'blue' },
    { label: 'Payments', icon: Wallet, path: '/dashboard/payment-history', color: 'emerald' },
    { label: 'Support', icon: HeadphonesIcon, path: '/dashboard/support', color: 'purple' },
  ]

  return (
    <div className="sticky top-0 z-50 px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3">
      <nav className={`max-w-7xl mx-auto transition-all duration-500 rounded-2xl ${
        scrolled
          ? 'bg-amber-50/80 backdrop-blur-xl shadow-lg shadow-amber-900/5 border border-amber-200/50'
          : 'bg-white/60 backdrop-blur-lg border border-amber-100/50'
      }`}>
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-base sm:text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight truncate notranslate" translate="no">
                  Puranveshana
                </span>
                <span className="text-[8px] sm:text-[9px] text-orange-600/70 font-medium -mt-0.5 notranslate truncate" translate="no">
                  पुरातन अन्वेषण
                </span>
              </div>
              {isAdmin && (
                <span className="hidden lg:inline-block ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                  ADMIN
                </span>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                    item.color === 'orange' ? 'text-slate-600 hover:bg-orange-50 hover:text-orange-600' :
                    item.color === 'blue' ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600' :
                    item.color === 'emerald' ? 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600' :
                    'text-slate-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${
                    item.color === 'orange' ? 'text-orange-500' :
                    item.color === 'blue' ? 'text-blue-500' :
                    item.color === 'emerald' ? 'text-emerald-500' :
                    'text-purple-500'
                  }`} />
                  <span>{item.label}</span>
                </button>
              ))}

              {isAdmin && (
                <span className="lg:hidden px-2 py-0.5 text-[10px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                  ADMIN
                </span>
              )}

              <div className="w-px h-6 bg-amber-200 mx-1"></div>

              <LanguageSelector />
              <NotificationBell />
              <ProfileDropdown userEmail={userEmail} />
            </div>

            <div className="flex md:hidden items-center gap-1.5">
              {isAdmin && (
                <span className="px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-linear-to-r from-orange-500 to-amber-600 text-white">
                  ADMIN
                </span>
              )}
              <LanguageSelector />
              <NotificationBell />
              <div className="relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center justify-center bg-linear-to-br from-orange-500 to-amber-600 rounded-xl w-8 h-8 shadow-md hover:shadow-lg transition-all"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">{getInitials(userEmail)}</span>
                  )}
                </button>

                {isMobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-slate-200/50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="bg-linear-to-br from-orange-500 to-amber-600 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 shadow-md">
                          <span className="text-white text-base font-bold">{getInitials(userEmail)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 mb-0.5">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">{userEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2 px-2">
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          router.push('/profile')
                        }}
                        className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Settings className="w-5 h-5 mr-3 text-slate-500" />
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
