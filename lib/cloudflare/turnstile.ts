/**
 * Cloudflare Turnstile verification with automatic fallback
 * Tries production keys first, falls back to test keys if needed
 */

import { getTurnstileSecretKey, isUsingTestKeys } from './turnstile-config';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<{ success: boolean; error?: string }> {
  if (!token) {
    return {
      success: false,
      error: 'Security verification token is missing.',
    };
  }

  const secretKey = getTurnstileSecretKey();
  const usingTestKeys = isUsingTestKeys();

  if (usingTestKeys) {
    console.log('[Turnstile] Verification using test keys (auto-pass mode)');
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudflare API returned ${response.status}`);
    }

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      const errorCodes = data['error-codes'] || [];
      console.error('[Turnstile] Verification failed:', errorCodes);

      // If using test keys, they should always pass
      // If they fail, something else is wrong
      if (usingTestKeys) {
        console.warn('[Turnstile] Test keys failed unexpectedly');
      }

      return {
        success: false,
        error: 'Security verification failed. Please try again.',
      };
    }

    if (!usingTestKeys) {
      console.log('[Turnstile] Verification successful with production keys');
    }

    return { success: true };
  } catch (error) {
    console.error('[Turnstile] Verification error:', error);

    // If using test keys and there's an error, it might be a network issue
    // In this case, we can be lenient for development
    if (usingTestKeys && process.env.NODE_ENV !== 'production') {
      console.warn('[Turnstile] Network error with test keys in dev mode, allowing through');
      return { success: true };
    }

    return {
      success: false,
      error: 'Security verification error. Please try again.',
    };
  }
}
