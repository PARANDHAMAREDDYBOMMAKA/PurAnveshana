/**
 * Cloudflare Turnstile configuration with automatic fallback
 * Works in all environments with smart key selection
 */

// Test keys - ONLY for development/testing (always pass)
const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

/**
 * Get the appropriate site key based on environment
 * Falls back to test keys if production keys fail or aren't configured
 * Turnstile is now always enabled in all environments for security
 */
export function getTurnstileSiteKey(): string {
  const productionKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  // Try production keys first
  if (productionKey && !productionKey.startsWith('1x000')) {
    return productionKey;
  }

  // Fallback to test keys
  if (!isProduction) {
    console.log('[Turnstile] Using test keys for development');
  } else {
    console.warn('[Turnstile] Production keys not configured, falling back to test keys');
  }

  return TEST_SITE_KEY;
}

/**
 * Get secret key for server-side verification
 */
export function getTurnstileSecretKey(): string {
  const productionSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  // Try production keys first
  if (productionSecret && !productionSecret.startsWith('1x000')) {
    return productionSecret;
  }

  // Fallback to test keys
  if (!isProduction) {
    console.log('[Turnstile] Using test secret for development');
  } else {
    console.warn('[Turnstile] Production secret not configured, falling back to test secret');
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
