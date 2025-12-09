/**
 * Utility to determine if Turnstile should be enabled
 * Only enable for production domain to avoid "Invalid domain" errors on Vercel deployments
 */

export function shouldEnableTurnstile(): boolean {
  // Only enable in production environment
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  // Check if we're on the production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Only enable for the main production domain
    return hostname === 'puranveshana.com' || hostname === 'www.puranveshana.com';
  }

  // Server-side: enable only if explicitly configured
  return process.env.ENABLE_TURNSTILE === 'true';
}

export function getTurnstileSiteKey(): string | undefined {
  if (!shouldEnableTurnstile()) {
    return undefined;
  }
  return process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
}
