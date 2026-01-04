import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache key prefixes for organization
export const CACHE_KEYS = {
  YATRA_STORY: 'yatra:story:',
  YATRA_STORIES: 'yatra:stories:',
  HERITAGE_SITE: 'heritage:site:',
  HERITAGE_SITES: 'heritage:sites:',
  USER_PROFILE: 'user:profile:',
  NOTIFICATIONS: 'notifications:user:',
  NOTIFICATION_COUNT: 'notifications:count:',
} as const;

// Default cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 1800, // 30 minutes
  VERY_LONG: 3600, // 1 hour
} as const;

/**
 * Cache helper functions
 */

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  try {
    await redis.set(key, value, { ex: ttl });
    return true;
  } catch (error) {
    console.error('Redis SET error:', error);
    return false;
  }
}

export async function deleteCached(key: string): Promise<boolean> {
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis DEL error:', error);
    return false;
  }
}

export async function invalidatePattern(pattern: string): Promise<number> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) return 0;
    await redis.del(...keys);
    return keys.length;
  } catch (error) {
    console.error('Redis pattern invalidation error:', error);
    return 0;
  }
}

/**
 * Increment counter (useful for notification counts, likes, etc.)
 */
export async function incrementCounter(key: string, amount: number = 1): Promise<number | null> {
  try {
    const result = await redis.incrby(key, amount);
    return result;
  } catch (error) {
    console.error('Redis INCRBY error:', error);
    return null;
  }
}

/**
 * Decrement counter
 */
export async function decrementCounter(key: string, amount: number = 1): Promise<number | null> {
  try {
    const result = await redis.decrby(key, amount);
    return result;
  } catch (error) {
    console.error('Redis DECRBY error:', error);
    return null;
  }
}

/**
 * Get multiple keys at once
 */
export async function getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
  try {
    if (keys.length === 0) return [];
    const results = await redis.mget<T[]>(...keys);
    return results;
  } catch (error) {
    console.error('Redis MGET error:', error);
    return keys.map(() => null);
  }
}

/**
 * Check if key exists
 */
export async function exists(key: string): Promise<boolean> {
  try {
    const result = await redis.exists(key);
    return result === 1;
  } catch (error) {
    console.error('Redis EXISTS error:', error);
    return false;
  }
}

/**
 * Set with expiration only if key doesn't exist
 */
export async function setIfNotExists<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<boolean> {
  try {
    const result = await redis.set(key, value, { ex: ttl, nx: true });
    return result === 'OK';
  } catch (error) {
    console.error('Redis SETNX error:', error);
    return false;
  }
}
