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

    const email = formData.email.toLowerCase()
    const allowedDomains = [
      'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com',
      'icloud.com', 'protonmail.com', 'live.com', 'msn.com',
      'aol.com', 'zoho.com', 'yandex.com'
    ]

    const emailDomain = email.split('@')[1]
    const emailPrefix = email.split('@')[0]

    if (!allowedDomains.includes(emailDomain)) {
      toast.error('Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)')
      setLoading(false)
      return
    }

    const testPatterns = ['test', 'fake', 'demo', 'example', 'temp', 'throwaway', 'disposable']
    if (testPatterns.some(pattern => emailPrefix.includes(pattern))) {
      toast.error('Test or temporary emails are not allowed')
      setLoading(false)
      return
    }

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
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-linear-to-b from-amber-50 via-orange-50 to-white">
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative p-6 md:p-8 lg:p-12 items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #f8f0e3 0%, #f0e4d0 25%, #e8d5b8 50%, #f5edd8 75%, #ebe0c9 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)',
          }}
        ></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>

        <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-amber-700/30"></div>
        <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-amber-700/30"></div>
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-amber-700/30"></div>
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-amber-700/30"></div>

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div className="w-14 md:w-16 h-14 md:h-16 bg-amber-800 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/30">
                <svg className="w-8 md:w-9 h-8 md:h-9 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-2 notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>
              Puranveshana
            </h1>
            <p className="text-amber-700/70 text-sm md:text-base font-medium mb-6 notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>
              पुरातन अन्वेषण
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-10 h-px bg-amber-600/40"></span>
              <span className="w-1.5 h-1.5 bg-amber-600/60 rounded-full"></span>
              <span className="w-10 h-px bg-amber-600/40"></span>
            </div>

            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-900 mb-3 md:mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Start Your Heritage Journey
            </h2>
            <p className="text-sm md:text-base text-amber-800/70 leading-relaxed mb-8" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Join thousands of heritage enthusiasts documenting and preserving India's cultural treasures.
            </p>

            <div className="space-y-4">
              {[
                'Free account with unlimited uploads',
                'Earn rewards for verified sites',
                'Connect with heritage community'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-amber-800/80 justify-center">
                  <div className="w-7 h-7 rounded-full bg-amber-800/10 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base font-medium" style={{ fontFamily: 'Georgia, serif' }}>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-amber-700/50 text-xs tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                preservation begins with you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 relative min-h-screen md:min-h-0">
        <div className="absolute inset-0 md:hidden opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 12px)',
          }}
        ></div>

        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="md:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8 group">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-amber-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-6 sm:w-7 h-6 sm:h-7 text-amber-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold text-amber-900 notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>
                Puranveshana
              </span>
              <span className="text-xs text-amber-700 font-medium -mt-0.5 notranslate" translate="no">
                पुरातन अन्वेषण
              </span>
            </div>
          </Link>

          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)',
              boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.9)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>

            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-600/20 rounded-tl-sm"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-600/20 rounded-tr-sm"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-600/20 rounded-bl-sm"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-600/20 rounded-br-sm"></div>

            <div className="relative p-6 sm:p-8 md:p-10 max-h-[calc(100vh-6rem)] sm:max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Create account
                </h2>
                <p className="text-amber-800/70 text-sm sm:text-base">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-amber-700 hover:text-amber-900 transition-all underline decoration-amber-400 hover:decoration-amber-600 underline-offset-4">
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-amber-900/80 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-amber-900 bg-white/60 border-2 border-amber-200/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all placeholder:text-amber-600/40"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-amber-900/80 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-amber-900 bg-white/60 border-2 border-amber-200/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all placeholder:text-amber-600/40"
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-xs sm:text-sm font-semibold text-amber-900/80 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none border-r border-amber-200/80 pr-2 sm:pr-3">
                      <span className="text-xs sm:text-sm text-amber-800 font-semibold">+91</span>
                    </div>
                    <input
                      id="mobile"
                      type="tel"
                      required
                      maxLength={10}
                      className="block w-full pl-14 sm:pl-16 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-amber-900 bg-white/60 border-2 border-amber-200/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all placeholder:text-amber-600/40"
                      placeholder="9876543210"
                      value={formData.mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setFormData({ ...formData, mobileNumber: value })
                      }}
                    />
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-xs text-amber-700/60">
                    This number will be used for UPI payment verification
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-amber-900/80 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 text-sm sm:text-base text-amber-900 bg-white/60 border-2 border-amber-200/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all placeholder:text-amber-600/40"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-amber-600/50 hover:text-amber-700 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-amber-900/80 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 sm:h-5 w-4 sm:w-5 text-amber-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 text-sm sm:text-base text-amber-900 bg-white/60 border-2 border-amber-200/80 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all placeholder:text-amber-600/40"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-amber-600/50 hover:text-amber-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 sm:h-5 w-4 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-1 sm:pt-2">
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

                <button
                  type="submit"
                  disabled={loading || !turnstileToken}
                  className="w-full bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold py-3.5 sm:py-4 px-6 rounded-full shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/25 transition-all disabled:bg-amber-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
