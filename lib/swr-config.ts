import { SWRConfiguration } from 'swr'

// Default fetcher for SWR
export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // @ts-ignore
    error.info = await res.json()
    // @ts-ignore
    error.status = res.status
    throw error
  }

  return res.json()
}

// Default SWR configuration
export const swrConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false, // Don't revalidate when window gets focus
  revalidateOnReconnect: true, // Revalidate when reconnecting
  dedupingInterval: 10000, // Dedupe requests within 10 seconds
  focusThrottleInterval: 30000, // Throttle focus revalidation to 30 seconds
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 5000, // Wait 5 seconds between retries
  // Cache responses for 5 minutes before revalidating
  refreshInterval: 0, // Disable automatic polling by default
}
