import { useState, useEffect } from 'react'

export function useDashboardData() {
  const [profileData, setProfileData] = useState<any>(null)
  const [sitesData, setSitesData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<any>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [profileRes, sitesRes] = await Promise.all([
        fetch('/api/profile', { cache: 'no-store' }),
        fetch('/api/images', { cache: 'no-store' })
      ])

      if (!profileRes.ok) {
        const error: any = new Error('Failed to fetch profile')
        error.status = profileRes.status
        throw error
      }

      if (!sitesRes.ok) {
        const error: any = new Error('Failed to fetch sites')
        error.status = sitesRes.status
        throw error
      }

      const profileJson = await profileRes.json()
      const sitesJson = await sitesRes.json()

      setProfileData(profileJson.profile)
      setSitesData(sitesJson.sites || [])
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    profile: profileData,
    sites: sitesData,
    isLoading,
    error,
    refresh: fetchData,
  }
}
