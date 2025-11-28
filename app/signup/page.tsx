'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { TurnstileWidget } from '@/components/TurnstileWidget'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Verify Turnstile token
    if (!turnstileToken) {
      toast.error('Please complete the security verification')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Validate email - prevent test/fake emails
    const email = formData.email.toLowerCase()
    const allowedDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
      'icloud.com', 'protonmail.com', 'live.com', 'msn.com',
      'aol.com', 'zoho.com', 'yandex.com'
    ]

    const emailDomain = email.split('@')[1]
    const emailPrefix = email.split('@')[0]

    // Check if domain is allowed
    if (!allowedDomains.includes(emailDomain)) {
      toast.error('Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)')
      setLoading(false)
      return
    }

    // Block test/fake email patterns
    const testPatterns = ['test', 'fake', 'demo', 'example', 'temp', 'throwaway', 'disposable']
    if (testPatterns.some(pattern => emailPrefix.includes(pattern))) {
      toast.error('Test or temporary emails are not allowed')
      setLoading(false)
      return
    }

    // Validate mobile number - must be exactly 10 digits
    const mobileDigits = formData.mobileNumber.replace(/\D/g, '')
    if (mobileDigits.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          mobileNumber: `+91${formData.mobileNumber}`,
          turnstileToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      toast.success('Signup successful! You can now login.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-amber-50 via-orange-50 to-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-2xl border border-orange-100">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-2 sm:mb-4 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex flex-col group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
              Puranveshana
            </span>
            <span className="text-[10px] sm:text-xs text-orange-600 font-semibold -mt-1 notranslate" translate="no">
              पुरातन अन्वेषण
            </span>
          </div>
        </Link>

        <div>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Join Puranveshana
          </h2>
          <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-orange-600 hover:text-orange-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-5" onSubmit={handleSignup}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="yourname@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-sm sm:text-base text-slate-700 font-semibold">+91</span>
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  autoComplete="off"
                  className="appearance-none relative block w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 characters
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setFormData({ ...formData, mobileNumber: value })
                  }}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-600">
                This number will be used for UPI payment verification
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-slate-600 hover:text-orange-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-slate-600 hover:text-orange-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Cloudflare Turnstile Security Widget */}
          <div className="flex justify-center">
            <TurnstileWidget
              onVerify={setTurnstileToken}
              onError={() => {
                toast.error('Security verification failed. Please try again.')
                setTurnstileToken('')
              }}
              onExpire={() => {
                toast.error('Security verification expired. Please verify again.')
                setTurnstileToken('')
              }}
              theme="light"
              size="normal"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !turnstileToken}
              className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 sm:px-6 border border-transparent text-sm sm:text-base font-bold rounded-lg text-white bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
