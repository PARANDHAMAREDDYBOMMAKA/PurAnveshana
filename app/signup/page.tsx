'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          mobileNumber: formData.mobileNumber,
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
            <span className="text-[10px] sm:text-xs text-orange-600 font-semibold -mt-1">
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
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Mobile Number
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="+1 (555) 123-4567"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5 sm:mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-orange-200 placeholder-orange-300 text-black font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
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
