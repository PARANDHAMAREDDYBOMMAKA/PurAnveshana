/**
 * Cloudflare CDN cache management utilities.
 *
 * Requires environment variables:
 *   CLOUDFLARE_API_TOKEN  — API token with Zone.Cache Purge permission
 *   CLOUDFLARE_ZONE_ID    — Zone ID for the domain (found on CF dashboard overview)
 */

const CF_API_BASE = 'https://api.cloudflare.com/client/v4'

function getConfig() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID

  if (!apiToken || !zoneId) {
    return null
  }

  return { apiToken, zoneId }
}

/**
 * Purge specific URLs from Cloudflare's CDN cache.
 * Use this after content updates (e.g. story publish, profile change).
 */
export async function purgeUrls(urls: string[]): Promise<boolean> {
  const config = getConfig()
  if (!config) {
    console.warn('[CDN] Cloudflare not configured — skipping cache purge')
    return false
  }

  try {
    const response = await fetch(
      `${CF_API_BASE}/zones/${config.zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: urls }),
      }
    )

    const data = await response.json()

    if (!data.success) {
      console.error('[CDN] Cache purge failed:', data.errors)
      return false
    }

    return true
  } catch (error) {
    console.error('[CDN] Cache purge request failed:', error)
    return false
  }
}

/**
 * Purge cached pages by path prefixes.
 * Constructs full URLs using the configured site URL.
 */
export async function purgePaths(paths: string[]): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puranveshana.com'
  const urls = paths.map((path) => `${siteUrl}${path}`)
  return purgeUrls(urls)
}

/**
 * Purge the entire CDN cache.
 * Use sparingly — only for deployments or major content changes.
 */
export async function purgeEverything(): Promise<boolean> {
  const config = getConfig()
  if (!config) {
    console.warn('[CDN] Cloudflare not configured — skipping full cache purge')
    return false
  }

  try {
    const response = await fetch(
      `${CF_API_BASE}/zones/${config.zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ purge_everything: true }),
      }
    )

    const data = await response.json()

    if (!data.success) {
      console.error('[CDN] Full cache purge failed:', data.errors)
      return false
    }

    return true
  } catch (error) {
    console.error('[CDN] Full cache purge request failed:', error)
    return false
  }
}

/**
 * Purge cache by cache tags (requires Enterprise plan).
 * Tags are set via the Cache-Tag response header.
 */
export async function purgeTags(tags: string[]): Promise<boolean> {
  const config = getConfig()
  if (!config) {
    console.warn('[CDN] Cloudflare not configured — skipping tag purge')
    return false
  }

  try {
    const response = await fetch(
      `${CF_API_BASE}/zones/${config.zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      }
    )

    const data = await response.json()

    if (!data.success) {
      console.error('[CDN] Tag-based cache purge failed:', data.errors)
      return false
    }

    return true
  } catch (error) {
    console.error('[CDN] Tag-based cache purge request failed:', error)
    return false
  }
}
