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

  useEffect(() => {
    const initialLang = getInitialLanguage();
    setCurrentLanguage(initialLang);
  }, []);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: 0,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const hideGoogleElements = () => {
      if (isTranslating) return;

      try {
        const iframes = document.querySelectorAll('iframe.goog-te-banner-frame, iframe.skiptranslate, iframe[id^="goog-gt-"]');
        iframes.forEach(iframe => {
          (iframe as HTMLElement).style.display = 'none';
        });

        const topBanner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
        if (topBanner) topBanner.style.display = 'none';

        const skipTranslate = document.querySelectorAll('body > .skiptranslate');
        skipTranslate.forEach(el => {
          const hasSelect = el.querySelector('.goog-te-combo');
          if (!hasSelect) {
            (el as HTMLElement).style.display = 'none';
          }
        });

        const spinners = document.querySelectorAll('.goog-te-spinner-pos, .goog-te-spinner');
        spinners.forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });

        document.querySelectorAll('[id^="goog-gt-"]').forEach(el => {
          const parent = el.closest('#google_translate_element');
          if (!parent && !el.classList.contains('goog-te-combo')) {
            (el as HTMLElement).style.display = 'none';
          }
        });

        document.body.style.top = '0';
        document.body.style.position = 'static';
      } catch { /* ignore DOM errors */ }
    };

    const runHide = () => {
      if (!isTranslating) {
        hideGoogleElements();
      }
    };

    const initialTimeout = setTimeout(runHide, 1000);

    removalIntervalRef.current = setInterval(runHide, 2000);

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

    setIsTranslating(true);

    const attemptChange = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;

      if (selectElement) {
        console.log('Found select element, changing to:', lang);
        console.log('Current value:', selectElement.value);
        console.log('Select element:', selectElement);

        const parent = selectElement.parentElement;
        if (parent) {
          parent.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; z-index: 999999 !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important;';
        }

        selectElement.style.cssText = 'display: block !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important;';

        selectElement.focus();

        selectElement.value = lang;

        const events = ['focus', 'click', 'input', 'change', 'blur'];
        events.forEach(eventType => {
          const event = new Event(eventType, { bubbles: true, cancelable: true });
          selectElement.dispatchEvent(event);
        });

        console.log('Value after change:', selectElement.value);

        setTimeout(() => {
          if (parent) {
            parent.style.cssText = '';
          }
          selectElement.style.cssText = '';

          setTimeout(() => {
            setIsTranslating(false);
          }, 5000);
        }, 500);

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
