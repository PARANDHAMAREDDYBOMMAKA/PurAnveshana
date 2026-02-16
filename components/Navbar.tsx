'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
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
  const pathname = usePathname()
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
    { label: 'Yatra', icon: Map, path: '/dashboard/yatra', tourId: 'nav-yatra' },
    { label: 'Anveshan', icon: Home, path: '/dashboard', tourId: 'nav-anveshan' },
    { label: 'Payments', icon: Wallet, path: '/dashboard/payment-history', tourId: 'nav-payments' },
    { label: 'Support', icon: HeadphonesIcon, path: '/dashboard/support', tourId: 'nav-support' },
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 px-2 sm:px-3 lg:px-4 pt-2 sm:pt-3">
        <nav className={`max-w-7xl mx-auto transition-all duration-500 rounded-2xl ${
          scrolled
            ? 'bg-amber-50/80 backdrop-blur-xl shadow-lg shadow-amber-900/5 border border-amber-200/50'
            : 'bg-white/60 backdrop-blur-lg border border-amber-100/50'
        }`}>
          <div className="px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo */}
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 min-w-0 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-amber-700 to-amber-800 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-amber-900/20 group-hover:shadow-lg transition-shadow">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-base sm:text-lg font-bold text-amber-900 leading-tight truncate notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>
                    Puranveshana
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-amber-700/60 font-medium -mt-0.5 notranslate truncate" translate="no">
                    पुरातन अन्वेषण
                  </span>
                </div>
                {isAdmin && (
                  <span className="hidden lg:inline-block ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-800 text-amber-50">
                    ADMIN
                  </span>
                )}
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center">
                <div
                  className="flex items-center gap-0.5 p-1 rounded-xl border border-amber-200/40"
                  style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.6) 0%, rgba(255, 248, 237, 0.6) 100%)' }}
                >
                  {navItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                      <Link
                        key={item.label}
                        href={item.path}
                        prefetch={true}
                        className={`group relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'text-amber-900 shadow-sm'
                            : 'text-amber-800/55 hover:text-amber-900'
                        }`}
                        style={active ? {
                          background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)',
                          boxShadow: '0 1px 3px rgba(139, 90, 43, 0.1)',
                        } : undefined}
                      >
                        <item.icon className={`w-4 h-4 transition-colors ${active ? 'text-amber-800' : 'text-amber-700/40 group-hover:text-amber-700/70'}`} />
                        <span style={{ fontFamily: 'Georgia, serif' }}>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {isAdmin && (
                  <span className="lg:hidden ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-800 text-amber-50">
                    ADMIN
                  </span>
                )}

                <div className="w-px h-6 bg-amber-300/40 mx-2.5"></div>

                <div className="flex items-center gap-0.5">
                  <LanguageSelector />
                  <NotificationBell />
                  <ProfileDropdown userEmail={userEmail} />
                </div>
              </div>

              {/* Mobile Right Side */}
              <div className="flex md:hidden items-center gap-1.5">
                {isAdmin && (
                  <span className="px-1.5 py-0.5 text-[8px] font-bold rounded-full bg-amber-800 text-amber-50">
                    ADMIN
                  </span>
                )}
                <LanguageSelector />
                <NotificationBell />
                <div className="relative" ref={mobileMenuRef}>
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center justify-center bg-linear-to-br from-amber-700 to-amber-800 rounded-xl w-8 h-8 shadow-md shadow-amber-900/20 hover:shadow-lg transition-all"
                    aria-label="Toggle menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-sm font-bold">{getInitials(userEmail)}</span>
                    )}
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {isMobileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-2xl py-2 z-50 border border-amber-200/60 overflow-hidden"
                      style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 8px 32px rgba(139, 90, 43, 0.15)' }}
                    >
                      {/* Corner decorations */}
                      <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t border-l border-amber-300/60 rounded-tl-sm"></div>
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t border-r border-amber-300/60 rounded-tr-sm"></div>
                      <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b border-l border-amber-300/60 rounded-bl-sm"></div>
                      <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b border-r border-amber-300/60 rounded-br-sm"></div>

                      {/* Profile Header */}
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

                      {/* Actions */}
                      <div className="py-1.5 px-2">
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false)
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
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div data-tour="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-100 md:hidden">
        <div
          className="border-t border-amber-200/60"
          style={{ background: 'linear-gradient(0deg, #fffbf5 0%, rgba(255, 251, 245, 0.97) 100%)', backdropFilter: 'blur(12px)', boxShadow: '0 -4px 24px rgba(139, 90, 43, 0.06)' }}
        >
          <div className="flex items-center justify-around px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
            {navItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  prefetch={true}
                  data-tour={item.tourId}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-15 ${
                    active ? 'text-amber-900' : 'text-amber-800/50'
                  }`}
                  style={active ? { background: 'linear-gradient(145deg, rgba(217, 119, 6, 0.1) 0%, rgba(245, 158, 11, 0.06) 100%)' } : undefined}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-amber-800' : 'text-amber-700/40'}`} />
                  <span className={`text-[10px] font-semibold ${active ? 'text-amber-900' : 'text-amber-800/50'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-4 h-0.5 bg-amber-700 rounded-full -mt-0.5" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
