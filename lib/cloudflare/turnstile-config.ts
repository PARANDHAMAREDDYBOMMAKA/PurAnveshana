/**
 * Cloudflare Turnstile configuration with automatic fallback
 * Works in all environments with smart key selection
 */

// Test keys - ONLY for development/testing (always pass)
const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

/**
 * Check if we should use production Cloudflare Turnstile keys
 * Only use real keys for the production domain (puranveshana.com)
 */
function shouldUseProductionKeys(): boolean {
  // In browser, check the hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'puranveshana.com' || hostname === 'www.puranveshana.com';
  }

  // On server, check NEXT_PUBLIC_SITE_URL first (most reliable for production)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const isProd = siteUrl.includes('puranveshana.com');
    if (isProd) {
      return true;
    }
  }

  // Fallback: check VERCEL_URL or other env vars
  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    return vercelUrl === 'puranveshana.com' || vercelUrl === 'www.puranveshana.com';
  }

  // Default to production keys if NODE_ENV is production and not on Vercel preview
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the appropriate site key based on environment
 * Falls back to test keys if production keys fail or aren't configured
 * Turnstile is now always enabled in all environments for security
 */
export function getTurnstileSiteKey(): string {
  const productionKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

  // Use production keys only for puranveshana.com
  if (shouldUseProductionKeys()) {
    if (productionKey && !productionKey.startsWith('1x000')) {
      console.log('[Turnstile] Using production keys for puranveshana.com');
      return productionKey;
    }
    console.warn('[Turnstile] Production domain but keys not configured, falling back to test keys');
  } else {
    console.log('[Turnstile] Using test keys (auto-pass) for non-production domain');
  }

  return TEST_SITE_KEY;
}

/**
 * Get secret key for server-side verification
 */
export function getTurnstileSecretKey(): string {
  const productionSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  // Use production keys only for puranveshana.com
  if (shouldUseProductionKeys()) {
    if (productionSecret && !productionSecret.startsWith('1x000')) {
      console.log('[Turnstile] Using production secret for puranveshana.com');
      return productionSecret;
    }
    console.warn('[Turnstile] Production domain but secret not configured, falling back to test secret');
  } else {
    console.log('[Turnstile] Using test secret (auto-pass) for non-production domain');
  }

  return TEST_SECRET_KEY;
}

/**
 * Check if we're using test keys
 */
export function isUsingTestKeys(): boolean {
  const siteKey = getTurnstileSiteKey();
  return siteKey === TEST_SITE_KEY || siteKey.startsWith('1x000');
}
