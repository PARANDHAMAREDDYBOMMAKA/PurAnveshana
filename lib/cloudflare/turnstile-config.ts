
const TEST_SITE_KEY = '1x00000000000000000000AA';
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';

function shouldUseProductionKeys(): boolean {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'puranveshana.com' || hostname === 'www.puranveshana.com';
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const isProd = siteUrl.includes('puranveshana.com');
    if (isProd) {
      return true;
    }
  }

  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    return vercelUrl === 'puranveshana.com' || vercelUrl === 'www.puranveshana.com';
  }

  return process.env.NODE_ENV === 'production';
}


export function getTurnstileSiteKey(): string {
  const productionKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

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

export function getTurnstileSecretKey(): string {
  const productionSecret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

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

export function isUsingTestKeys(): boolean {
  const siteKey = getTurnstileSiteKey();
  return siteKey === TEST_SITE_KEY || siteKey.startsWith('1x000');
}
