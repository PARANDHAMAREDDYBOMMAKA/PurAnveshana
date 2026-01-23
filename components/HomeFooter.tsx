"use client";

import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomeFooterProps {
  setShowPrivacy: (value: boolean) => void;
  setShowTerms: (value: boolean) => void;
  setShowContact: (value: boolean) => void;
  setShowHelp: (value: boolean) => void;
  setShowGuidelines: (value: boolean) => void;
  setShowContributors: (value: boolean) => void;
  setShowStories: (value: boolean) => void;
  setShowMap: (value: boolean) => void;
  setShowSitemap: (value: boolean) => void;
  setShowAccessibility: (value: boolean) => void;
  setShowCookies: (value: boolean) => void;
}

export default function HomeFooter({
  setShowPrivacy,
  setShowTerms,
  setShowContact,
  setShowHelp,
  setShowGuidelines,
  setShowContributors,
  setShowStories,
  setShowMap,
  setShowSitemap,
  setShowAccessibility,
  setShowCookies,
}: HomeFooterProps) {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-amber-950 text-amber-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 sm:py-8">
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-amber-50" style={{ fontFamily: 'Georgia, serif' }}>
              Puranveshana
            </h3>
            <p className="text-amber-300/80 text-xs sm:text-sm max-w-md mx-auto">
              Discover, document, and preserve India's hidden ancient heritage.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-5 sm:mb-6">
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-2 text-[10px] sm:text-xs uppercase tracking-wider text-amber-400">Platform</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-amber-200/70">
                <li><a href="#yatra" className="hover:text-amber-100 transition-colors">Yatra</a></li>
                <li><a href="#features" className="hover:text-amber-100 transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="hover:text-amber-100 transition-colors">Dashboard</Link></li>
                {/* <li><a href="#faq" className="hover:text-amber-100 transition-colors">FAQ</a></li> */}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-2 text-[10px] sm:text-xs uppercase tracking-wider text-amber-400">Resources</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-amber-200/70">
                <li><button onClick={() => setShowGuidelines(true)} className="hover:text-amber-100 transition-colors">Guidelines</button></li>
                <li><button onClick={() => setShowContributors(true)} className="hover:text-amber-100 transition-colors">Contributors</button></li>
                <li><button onClick={() => setShowStories(true)} className="hover:text-amber-100 transition-colors">Stories</button></li>
                <li><button onClick={() => setShowMap(true)} className="hover:text-amber-100 transition-colors">Map</button></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-2 text-[10px] sm:text-xs uppercase tracking-wider text-amber-400">Legal</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-amber-200/70">
                <li><button onClick={() => setShowPrivacy(true)} className="hover:text-amber-100 transition-colors">Privacy</button></li>
                <li><button onClick={() => setShowTerms(true)} className="hover:text-amber-100 transition-colors">Terms</button></li>
                <li><button onClick={() => setShowCookies(true)} className="hover:text-amber-100 transition-colors">Cookies</button></li>
                <li><button onClick={() => setShowAccessibility(true)} className="hover:text-amber-100 transition-colors">Accessibility</button></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-2 text-[10px] sm:text-xs uppercase tracking-wider text-amber-400">Support</h4>
              <ul className="space-y-1 text-xs sm:text-sm text-amber-200/70">
                <li><button onClick={() => setShowContact(true)} className="hover:text-amber-100 transition-colors">Contact</button></li>
                <li><button onClick={() => setShowHelp(true)} className="hover:text-amber-100 transition-colors">Help Center</button></li>
                <li><button onClick={() => setShowSitemap(true)} className="hover:text-amber-100 transition-colors">Sitemap</button></li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-12 sm:w-16 h-px bg-amber-700/50"></span>
            <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
            <span className="w-12 sm:w-16 h-px bg-amber-700/50"></span>
          </div>

          <div className="text-center">
            <p className="text-amber-300/60 text-[10px] sm:text-xs mb-1 flex items-center justify-center gap-1">
              Made with <Heart className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> for heritage preservation
            </p>
            <p className="text-amber-400/50 text-[10px] sm:text-xs">
              &copy; {year || '2026'} Puranveshana. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
