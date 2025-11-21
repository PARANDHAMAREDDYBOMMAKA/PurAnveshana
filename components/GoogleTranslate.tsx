"use client";

import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  // Initialize language from cookie
  const getInitialLanguage = () => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));

    if (cookie) {
      const lang = cookie.split('/')[2];
      return lang || 'en';
    }
    return 'en';
  };

  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const removalIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scriptLoadedRef = useRef(false);

  // Set initial language from cookie on mount
  useEffect(() => {
    const initialLang = getInitialLanguage();
    setCurrentLanguage(initialLang);
  }, []);

  // Load Google Translate script once
  useEffect(() => {
    // Only load the script once
    if (scriptLoadedRef.current) return;

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi', // English and Hindi
            layout: 0, // Simple layout
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Load the Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  }, []); // Run only once

  // Handle element hiding (using CSS instead of removal to avoid React conflicts) and language detection
  useEffect(() => {
    // Hide Google Translate UI elements using CSS instead of removing them
    const hideGoogleElements = () => {
      if (isTranslating) return;

      try {
        // Hide all iframes
        const iframes = document.querySelectorAll('iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id^="goog-gt-"]');
        iframes.forEach(iframe => {
          (iframe as HTMLElement).style.display = 'none';
        });

        // Hide top banner
        const topBanner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
        if (topBanner) topBanner.style.display = 'none';

        // Hide skiptranslate divs but preserve the one with goog-te-combo select
        const skipTranslate = document.querySelectorAll('body > .skiptranslate');
        skipTranslate.forEach(el => {
          const hasSelect = el.querySelector('.goog-te-combo');
          if (!hasSelect) {
            (el as HTMLElement).style.display = 'none';
          }
        });

        // Hide spinner and loading elements
        const spinners = document.querySelectorAll('.goog-te-spinner-pos, .goog-te-spinner');
        spinners.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });

        // Hide any element with ID starting with goog-gt- except necessary ones
        document.querySelectorAll('[id^="goog-gt-"]').forEach(el => {
          const parent = el.closest('#google_translate_element');
          if (!parent && !el.classList.contains('goog-te-combo')) {
            (el as HTMLElement).style.display = 'none';
          }
        });

        // Reset body position
        document.body.style.top = '0';
        document.body.style.position = 'static';
      } catch { /* ignore DOM errors */ }
    };

    // Run hide function
    const runHide = () => {
      if (!isTranslating) {
        hideGoogleElements();
      }
    };

    // Initial cleanup after a delay
    const initialTimeout = setTimeout(runHide, 1000);

    // Run hide function periodically
    removalIntervalRef.current = setInterval(runHide, 2000);

    // Check for language change from cookies
    const checkLanguage = setInterval(() => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('googtrans='));

      if (cookie) {
        const lang = cookie.split('/')[2];
        if (lang && lang !== currentLanguage) {
          setCurrentLanguage(lang);
        }
      }
    }, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(checkLanguage);
      if (removalIntervalRef.current) {
        clearInterval(removalIntervalRef.current);
      }
    };
  }, [isTranslating, currentLanguage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const changeLanguage = (lang: string) => {
    let attempts = 0;
    const maxAttempts = 20;

    // Stop removing Google elements during translation
    setIsTranslating(true);

    const attemptChange = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (selectElement) {
        console.log('Found select element, changing to:', lang);
        console.log('Current value:', selectElement.value);
        console.log('Select element:', selectElement);

        // Make select temporarily visible and interactable
        const parent = selectElement.parentElement;
        if (parent) {
          parent.style.position = 'fixed';
          parent.style.top = '0';
          parent.style.left = '0';
          parent.style.zIndex = '999999';
          parent.style.opacity = '1';
          parent.style.visibility = 'visible';
        }

        selectElement.style.opacity = '1';
        selectElement.style.visibility = 'visible';

        // Focus on the select
        selectElement.focus();

        // Set the value
        selectElement.value = lang;

        // Trigger multiple event types
        selectElement.dispatchEvent(new Event('focus', { bubbles: true }));
        selectElement.dispatchEvent(new Event('click', { bubbles: true }));
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        selectElement.dispatchEvent(new Event('blur', { bubbles: true }));

        console.log('Value after change:', selectElement.value);

        // Hide it again and resume element removal after translation completes
        setTimeout(() => {
          if (parent) {
            parent.style.position = '';
            parent.style.top = '';
            parent.style.left = '';
            parent.style.zIndex = '';
            parent.style.opacity = '';
            parent.style.visibility = '';
          }
          selectElement.style.opacity = '';
          selectElement.style.visibility = '';

          // Resume element removal after 5 seconds (give Google more time to translate)
          setTimeout(() => {
            setIsTranslating(false);
          }, 5000);
        }, 500);

        // Update our state
        setCurrentLanguage(lang);
        setIsOpen(false);
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          console.log('Select element not found, retrying... Attempt:', attempts);
          setTimeout(attemptChange, 300);
        } else {
          console.error('Failed to find Google Translate select element after', maxAttempts, 'attempts');
          setIsTranslating(false);
        }
      }
    };

    attemptChange();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden Google Translate Element - CSS handles hiding */}
      <div id="google_translate_element"></div>

      {/* Custom Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm notranslate"
        aria-label="Select Language"
        translate="no"
      >
        <Globe className="w-5 h-5 text-black" />
        <span className="text-sm font-medium text-black">
          {currentLanguage === 'hi' ? 'हिन्दी' : 'English'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 notranslate" translate="no">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full text-left px-4 py-2 text-sm text-black hover:bg-slate-50 transition-colors ${
                currentLanguage === 'en' ? 'bg-slate-100 font-medium' : ''
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`w-full text-left px-4 py-2 text-sm text-black hover:bg-slate-50 transition-colors ${
                currentLanguage === 'hi' ? 'bg-slate-100 font-medium' : ''
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
