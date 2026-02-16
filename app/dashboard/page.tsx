'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import DashboardClient from '@/components/DashboardClient'
import DashboardTour from '@/components/tours/DashboardTour'
import { useDashboardData } from '@/hooks/useDashboardData'

export default function DashboardPage() {
  const router = useRouter()
  const { profile, sites, isLoading, error, refresh } = useDashboardData()

  useEffect(() => {
    if (error?.status === 401) {
      router.push('/login')
    }
  }, [error, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-slate-900 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const isAdmin = profile.role === 'admin'

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={profile.email} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient images={sites} isAdmin={isAdmin} onUploadSuccess={refresh} />
      </div>

      {!isAdmin && <DashboardTour />}
    </div>
  )
}
