'use client';

import { useEffect, useRef, useState } from 'react';
import { shouldEnableTurnstile, getTurnstileSiteKey } from '@/lib/cloudflare/turnstile-config';

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
  const [isTurnstileEnabled, setIsTurnstileEnabled] = useState(false);

  // Check if Turnstile should be enabled
  useEffect(() => {
    setIsTurnstileEnabled(shouldEnableTurnstile());
  }, []);

  // Auto-verify if Turnstile is disabled
  useEffect(() => {
    if (!isTurnstileEnabled) {
      // Provide a dummy token when Turnstile is disabled (e.g., on Vercel deployments)
      onVerify('turnstile-disabled');
    }
  }, [isTurnstileEnabled, onVerify]);

  useEffect(() => {
    // Don't load Turnstile if it's disabled
    if (!isTurnstileEnabled) {
      return;
    }
    // Load Turnstile script
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
    if (!isTurnstileEnabled) {
      return;
    }

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
        // Render the widget only once
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
  }, [isLoaded, onVerify, onError, onExpire, theme, size, isTurnstileEnabled]);

  // Don't render anything if Turnstile is disabled
  if (!isTurnstileEnabled) {
    return null;
  }

  return (
    <div>
      <div ref={containerRef} />
      {!isLoaded && (
        <div className="h-16 flex items-center justify-center text-sm text-gray-500">
          Loading verification...
        </div>
      )}
    </div>
  );
}
