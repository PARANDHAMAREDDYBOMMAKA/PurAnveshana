'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardProfilePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/profile')
  }, [router])

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-slate-700">Redirecting to profile...</p>
      </div>
    </div>
  )
}
