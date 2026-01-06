import useSWR from 'swr'
import { fetcher } from '@/lib/swr-config'

export function useDashboardData() {
  const { data: profileData, error: profileError, isLoading: profileLoading } = useSWR(
    '/api/profile',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  )

  const { data: sitesData, error: sitesError, isLoading: sitesLoading, mutate: mutateSites } = useSWR(
    '/api/images',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  )

  return {
    profile: profileData?.profile,
    sites: sitesData?.sites || [],
    isLoading: profileLoading || sitesLoading,
    error: profileError || sitesError,
    refresh: mutateSites, // Function to manually refresh data
  }
}

export function useYatraStories(heritageSiteId?: string) {
  const url = heritageSiteId
    ? `/api/yatra?heritageSiteId=${heritageSiteId}`
    : '/api/yatra'

  const { data, error, isLoading, mutate } = useSWR(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 20000, // Cache for 20 seconds
    }
  )

  return {
    stories: data?.stories || [],
    isLoading,
    error,
    refresh: mutate,
  }
}
