'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import DashboardClient from '@/components/DashboardClient'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState<any[]>([])
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [profileResponse, sitesResponse] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/images'),
      ])

      if (!profileResponse.ok || !sitesResponse.ok) {
        if (profileResponse.status === 401 || sitesResponse.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch data')
      }

      const profileData = await profileResponse.json()
      const sitesData = await sitesResponse.json()

      setUserEmail(profileData.profile.email)
      setUserRole(profileData.profile.role)
      setImages(sitesData.sites || [])
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const refreshImages = () => {
    fetchDashboardData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-slate-900 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const isAdmin = userRole === 'admin'

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardClient images={images} isAdmin={isAdmin} onUploadSuccess={refreshImages} />
      </div>
    </div>
  )
}
