import { useState, useEffect, useCallback } from 'react'

const cache: {
  profile: any
  sites: any[]
  timestamp: number
} = {
  profile: null,
  sites: [],
  timestamp: 0
}

const CACHE_DURATION = 30000

export function useDashboardData() {
  const [profileData, setProfileData] = useState<any>(cache.profile)
  const [sitesData, setSitesData] = useState<any[]>(cache.sites)
  const [isLoading, setIsLoading] = useState(!cache.profile)
  const [error, setError] = useState<any>(null)

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now()
    const isCacheValid = cache.profile && (now - cache.timestamp) < CACHE_DURATION

    if (isCacheValid && !force) {
      setProfileData(cache.profile)
      setSitesData(cache.sites)
      setIsLoading(false)
      return
    }

    try {
      if (!cache.profile) setIsLoading(true)
      setError(null)

      const [profileRes, sitesRes] = await Promise.all([
        fetch('/api/profile', { credentials: 'include' }),
        fetch('/api/images', { credentials: 'include' })
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

      cache.profile = profileJson.profile
      cache.sites = sitesJson.sites || []
      cache.timestamp = now

      setProfileData(cache.profile)
      setSitesData(cache.sites)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refresh = useCallback(() => fetchData(true), [fetchData])

  return {
    profile: profileData,
    sites: sitesData,
    isLoading,
    error,
    refresh,
  }
}
