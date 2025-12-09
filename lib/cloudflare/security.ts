/**
 * Cloudflare security utilities
 */

interface CloudflareHeaders {
  'CF-Connecting-IP'?: string;
  'CF-IPCountry'?: string;
  'CF-Ray'?: string;
  'CF-Visitor'?: string;
}

/**
 * Extract real client IP from Cloudflare headers
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('CF-Connecting-IP') ||
    headers.get('X-Forwarded-For')?.split(',')[0] ||
    headers.get('X-Real-IP') ||
    'unknown'
  );
}

/**
 * Get country code from Cloudflare headers
 */
export function getCountryCode(headers: Headers): string | null {
  return headers.get('CF-IPCountry');
}

/**
 * Check if request is coming through Cloudflare
 */
export function isCloudflareRequest(headers: Headers): boolean {
  return !!headers.get('CF-Ray');
}

/**
 * Block requests from specific countries
 */
export function isBlockedCountry(
  headers: Headers,
  blockedCountries: string[] = []
): boolean {
  if (blockedCountries.length === 0) return false;

  const country = getCountryCode(headers);
  return country ? blockedCountries.includes(country) : false;
}

/**
 * Verify request is legitimate and not a bot
 * Only returns false if we have strong evidence of bot behavior
 */
export function verifyCloudflareBot(headers: Headers): boolean {
  const botScore = headers.get('CF-Bot-Score');

  // Bot score is between 1-99, lower = more likely bot
  // Only block if score is very low (20 or below = definitely automated)
  if (botScore) {
    const score = parseInt(botScore, 10);
    return score > 20; // More lenient threshold
  }

  // If no bot score, allow by default (direct Vercel access)
  return true;
}

/**
 * Get Cloudflare Ray ID for logging and debugging
 */
export function getRayId(headers: Headers): string | null {
  return headers.get('CF-Ray');
}

/**
 * Rate limiting using Cloudflare API
 */
export interface RateLimitConfig {
  limit: number;
  period: number; // in seconds
  endpoint: string;
}

export async function checkRateLimit(
  ip: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining?: number; resetAt?: number }> {
  // This would integrate with Cloudflare's Rate Limiting API
  // For now, we'll use a simple in-memory store
  // In production, use Cloudflare Workers KV or API

  const key = `ratelimit:${config.endpoint}:${ip}`;

  // In production, implement with Cloudflare API or Workers KV
  // This is a placeholder that always allows
  return { allowed: true };
}

/**
 * Log security event to Cloudflare
 */
export async function logSecurityEvent(
  eventType: string,
  ip: string,
  details: Record<string, unknown>
): Promise<void> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    console.warn('Cloudflare API not configured for security logging');
    return;
  }

  try {
    // Log to console for now
    console.log('Security Event:', {
      type: eventType,
      ip,
      timestamp: new Date().toISOString(),
      ...details,
    });

    // In production, you could send this to Cloudflare Logs or custom endpoint
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}
