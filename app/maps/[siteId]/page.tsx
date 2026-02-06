'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import RouteMap from '@/components/RouteMap'
import toast from 'react-hot-toast'

export default function MapsPage() {
  const router = useRouter()
  const params = useParams()
  const siteId = params.siteId as string

  const [loading, setLoading] = useState(true)
  const [siteData, setSiteData] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchData()
  }, [siteId])

  const fetchData = async () => {
    try {
      const [profileResponse, sitesResponse] = await Promise.all([
        fetch('/api/profile', { credentials: 'include' }),
        fetch('/api/images', { credentials: 'include' }),
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
      setIsAdmin(profileData.profile.role === 'admin')

      if (profileData.profile.role !== 'admin') {
        toast.error('Access denied. Admin only.')
        router.push('/dashboard')
        return
      }

      const site = sitesData.sites?.find((s: any) => s.id === siteId)
      if (!site) {
        toast.error('Heritage site not found')
        router.push('/dashboard')
        return
      }

      if (!site.images || site.images.length === 0) {
        toast.error('No images available for this site')
        router.push('/dashboard')
        return
      }

      let selectedImage = site.images.find((img: any) => img.gpsLatitude && img.gpsLongitude)

      if (!selectedImage) {
        selectedImage = site.images[0]

        try {
          const geocodeResponse = await fetch(
            `/api/geocode?location=${encodeURIComponent(selectedImage.location)}`
          )

          if (!geocodeResponse.ok) {
            throw new Error('Geocoding failed')
          }

          const geocodeData = await geocodeResponse.json()

          if (geocodeData && geocodeData.length > 0) {
            selectedImage = {
              ...selectedImage,
              gpsLatitude: parseFloat(geocodeData[0].lat),
              gpsLongitude: parseFloat(geocodeData[0].lon),
              isGeocoded: true
            }
          } else {
            toast.error('Could not find location on map. Please try again.')
            router.push('/dashboard')
            return
          }
        } catch (error) {
          console.error('Geocoding error:', error)
          toast.error('Failed to locate the heritage site on map')
          router.push('/dashboard')
          return
        }
      }

      setSiteData({
        ...site,
        selectedImage
      })
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load map data')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-900 font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  if (!siteData) {
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-white">
      <Navbar userEmail={userEmail} isAdmin={isAdmin} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-3 sm:mb-4 text-sm sm:text-base transition-colors"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-orange-100">
            <div className="mb-3 sm:mb-4">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 leading-tight">{siteData.title}</h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{siteData.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-orange-200 flex-1 sm:flex-initial">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">{siteData.selectedImage.location}</span>
              </div>

              <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-blue-200 flex-1 sm:flex-initial">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <span className="font-mono text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-900 truncate">
                    {siteData.selectedImage.gpsLatitude.toFixed(4)}, {siteData.selectedImage.gpsLongitude.toFixed(4)}
                  </span>
                  {siteData.selectedImage.isGeocoded && (
                    <span className="text-[10px] sm:text-xs text-blue-600 bg-blue-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shrink-0">
                      Geocoded
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-green-200 flex-1 sm:flex-initial">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">Route from Bengaluru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border-2 border-orange-100">
          <div className="p-3 sm:p-4 bg-linear-to-r from-orange-500 to-amber-600">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>Interactive Route Map</span>
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-1">
              Route from Bengaluru to {siteData.selectedImage.location}
              {siteData.selectedImage.isGeocoded && ' (using geocoded location)'}
            </p>
          </div>
          <div className="p-3 sm:p-4 md:p-6">
            <RouteMap
              destinationLat={siteData.selectedImage.gpsLatitude}
              destinationLng={siteData.selectedImage.gpsLongitude}
              destinationName={siteData.selectedImage.location}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
