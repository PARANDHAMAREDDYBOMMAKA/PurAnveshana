/**
 * Simple in-memory rate limiter
 * In production, use Cloudflare Workers KV or Redis
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  maxRequests: number;
  windowMs: number; // in milliseconds
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const key = `rl:${identifier}`;

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // New window or expired entry
    const resetAt = now + options.windowMs;
    rateLimitStore.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetAt,
      limit: options.maxRequests,
    };
  }

  // Check if limit exceeded
  if (entry.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      limit: options.maxRequests,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: options.maxRequests - entry.count,
    resetAt: entry.resetAt,
    limit: options.maxRequests,
  };
}

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Preset rate limit configurations
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH: {
    maxRequests: 30,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // API endpoints
  API: {
    maxRequests: 1000,
    windowMs: 60 * 1000, // 1 minute
  },
  // Upload endpoints
  UPLOAD: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // General endpoints
  GENERAL: {
    maxRequests: 500,
    windowMs: 60 * 1000, // 1 minute
  },
};
