'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  name: string
  email: string
  mobileNumber: string | null
  role: string
  membershipTier: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }
      const data = await response.json()
      setProfile(data.profile)
      setName(data.profile.name || '')
      setMobileNumber(data.profile.mobileNumber || '')
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobileNumber }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Profile update failed')
      setProfile(data.profile)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    setIsPasswordSaving(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Password update failed')
      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordSection(false)
    } catch (error: any) {
      toast.error(error.message || 'Error updating password')
    } finally {
      setIsPasswordSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'from-slate-400 via-slate-300 to-slate-500'
      case 'gold': return 'from-yellow-400 via-yellow-300 to-yellow-500'
      case 'silver': return 'from-gray-300 via-gray-200 to-gray-400'
      default: return 'from-amber-700 via-amber-600 to-amber-800'
    }
  }

  const getMembershipIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎'
      case 'gold': return '👑'
      case 'silver': return '⭐'
      default: return '🔰'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)' }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 sm:border-b-4 border-amber-700"></div>
          <p className="mt-4 text-sm sm:text-base text-amber-900 font-medium" style={{ fontFamily: 'Georgia, serif' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  const inputClass = "block w-full px-5 py-3.5 border-2 border-amber-200/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-amber-950 font-medium transition-all duration-300 hover:border-amber-300/80"
  const labelClass = "flex items-center gap-2 text-sm font-bold text-amber-900 mb-2"
  const sectionHeaderStyle = { background: 'linear-gradient(135deg, #92400e 0%, #78350f 50%, #92400e 100%)' }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-amber-100/50 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-amber-100/30 via-transparent to-transparent"></div>

      <div className="relative z-10 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push('/dashboard')}
            className="group mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-amber-200/50 text-amber-900 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto"
            style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.8) 0%, rgba(255, 248, 237, 0.8) 100%)' }}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>Back to Dashboard</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <div
                className="backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/60 lg:transform lg:hover:scale-[1.02] transition-all duration-300"
                style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.9) 0%, rgba(255, 248, 237, 0.9) 100%)' }}
              >
                <div className={`bg-linear-to-br ${getMembershipBadgeColor(profile?.membershipTier || 'none')} p-6 sm:p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-amber-700 to-amber-800 shadow-xl ring-4 ring-white/50">
                      {profile?.name ? getInitials(profile.name) : 'U'}
                    </div>
                    <div className="mt-3 sm:mt-4 text-center">
                      <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg wrap-break-word px-2" style={{ fontFamily: 'Georgia, serif' }}>{profile?.name}</h2>
                      <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium break-all px-2">{profile?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  {[
                    { label: 'Account Role', value: profile?.role, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                    { label: 'Membership Tier', value: profile?.membershipTier || 'None', emoji: getMembershipIcon(profile?.membershipTier || 'none') },
                    { label: 'Member Since', value: profile?.createdAt ? formatDate(profile.createdAt) : 'N/A', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-200/50" style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.6) 0%, rgba(255, 248, 237, 0.6) 100%)' }}>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-linear-to-br from-amber-700 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/20 shrink-0">
                          {item.emoji ? (
                            <span className="text-lg sm:text-xl">{item.emoji}</span>
                          ) : (
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-amber-700/60">{item.label}</p>
                          <p className="text-sm font-bold text-amber-950 capitalize truncate">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div
                className="backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/60"
                style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.9) 0%, rgba(255, 248, 237, 0.9) 100%)' }}
              >
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 relative overflow-hidden" style={sectionHeaderStyle}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                  <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>Personal Information</h3>
                      <p className="text-amber-200/80 text-xs sm:text-sm hidden sm:block">Update your personal details</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Full Name
                      </label>
                      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fffbf5 100%)' }} />
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address
                        <span className="ml-auto text-xs bg-amber-200/60 text-amber-800 px-2 py-0.5 rounded-full">Read-only</span>
                      </label>
                      <div className="relative">
                        <input type="email" id="email" value={profile?.email || ''} disabled className="block w-full px-5 py-3.5 bg-amber-50/50 border-2 border-amber-200/40 rounded-xl text-amber-700 cursor-not-allowed font-medium" />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="mobileNumber" className={labelClass}>
                        <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-5 py-3.5 border-2 border-amber-300/60 rounded-xl text-amber-800 font-bold shadow-sm" style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 100%)' }}>
                          <span className="text-amber-800">+91</span>
                        </div>
                        <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter 10-digit number" pattern="\d{10}" className={`flex-1 ${inputClass}`} style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fffbf5 100%)' }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 sm:pt-4">
                    <button type="submit" disabled={isSaving} className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-white font-bold rounded-lg sm:rounded-xl shadow-lg shadow-amber-900/20 hover:shadow-xl sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={sectionHeaderStyle}>
                      <span className="flex items-center justify-center gap-2">
                        {isSaving ? (
                          <>
                            <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm sm:text-base">Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>Save Changes</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Password & Security */}
              <div
                className="backdrop-blur-md shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-amber-200/60"
                style={{ background: 'linear-gradient(145deg, rgba(255, 251, 245, 0.9) 0%, rgba(255, 248, 237, 0.9) 100%)' }}
              >
                <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 relative overflow-hidden group" style={sectionHeaderStyle}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 group-hover:scale-150 transition-transform duration-300"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate" style={{ fontFamily: 'Georgia, serif' }}>Password & Security</h3>
                        <p className="text-amber-200/80 text-xs sm:text-sm hidden sm:block">Update your password to keep your account secure</p>
                      </div>
                    </div>
                    <svg className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white transition-transform duration-300 shrink-0 ${showPasswordSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {showPasswordSection && (
                  <form onSubmit={handlePasswordReset} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    <div className="space-y-4 sm:space-y-6">
                      {[
                        { id: 'currentPassword', label: 'Current Password', value: currentPassword, setter: setCurrentPassword, show: showCurrentPassword, toggle: () => setShowCurrentPassword(!showCurrentPassword), icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                        { id: 'newPassword', label: 'New Password', value: newPassword, setter: setNewPassword, show: showNewPassword, toggle: () => setShowNewPassword(!showNewPassword), icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', extra: <span className="ml-auto text-xs text-amber-700 font-semibold">Min 8 characters</span> },
                        { id: 'confirmPassword', label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword), icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                      ].map((field) => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className={labelClass}>
                            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={field.icon} />
                            </svg>
                            {field.label}
                            {field.extra}
                          </label>
                          <div className="relative">
                            <input
                              type={field.show ? 'text' : 'password'}
                              id={field.id}
                              value={field.value}
                              onChange={(e) => field.setter(e.target.value)}
                              required
                              minLength={field.id !== 'currentPassword' ? 8 : undefined}
                              className={`${inputClass} pr-12`}
                              style={{ background: 'linear-gradient(145deg, #ffffff 0%, #fffbf5 100%)' }}
                            />
                            <button type="button" onClick={field.toggle} className="absolute inset-y-0 right-0 pr-4 flex items-center text-amber-600/60 hover:text-amber-800 transition-colors">
                              {field.show ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowPasswordSection(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }}
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-amber-100/60 text-amber-900 font-bold rounded-lg sm:rounded-xl hover:bg-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-all duration-300 sm:hover:scale-105 text-sm sm:text-base border border-amber-200/50"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isPasswordSaving} className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-white font-bold rounded-lg sm:rounded-xl shadow-lg shadow-amber-900/20 hover:shadow-xl sm:hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={sectionHeaderStyle}>
                        <span className="flex items-center justify-center gap-2">
                          {isPasswordSaving ? (
                            <>
                              <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-sm sm:text-base">Updating...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                              <span className="text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>Update Password</span>
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
