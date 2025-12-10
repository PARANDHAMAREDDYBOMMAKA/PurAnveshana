'use client';

import { useEffect, useRef, useState } from 'react';
import { getTurnstileSiteKey, isUsingTestKeys } from '@/lib/cloudflare/turnstile-config';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function TurnstileWidget({
  onVerify,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasRendered = useRef(false);
  const [usingTestKeys, setUsingTestKeys] = useState(false);

  // Check if using test keys for display purposes
  useEffect(() => {
    setUsingTestKeys(isUsingTestKeys());
  }, []);

  useEffect(() => {
    // Load Turnstile script - now always enabled in all environments
    const scriptId = 'turnstile-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else if (window.turnstile) {
      setIsLoaded(true);
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore errors during cleanup
        }
        widgetIdRef.current = null;
        hasRendered.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile && !hasRendered.current) {
      const siteKey = getTurnstileSiteKey();

      if (!siteKey) {
        console.error('Turnstile site key not configured');
        return;
      }

      // Clear container before rendering
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      try {
        // Render the widget - always enabled in all environments
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
          size,
        });
        hasRendered.current = true;
      } catch (e) {
        console.error('Failed to render Turnstile:', e);
      }
    }
  }, [isLoaded, onVerify, onError, onExpire, theme, size]);

  return (
    <div>
      <div ref={containerRef} />
      {!isLoaded && (
        <div className="h-16 flex items-center justify-center text-sm text-gray-500">
          Loading verification...
        </div>
      )}
      {usingTestKeys && process.env.NODE_ENV !== 'production' && (
        <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Test mode (auto-pass)
        </div>
      )}
    </div>
  );
}
