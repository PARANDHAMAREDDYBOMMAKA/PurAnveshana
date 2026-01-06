"use client";

import Link from 'next/link';
import { MapPin } from 'lucide-react';

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
  return (
    <footer className="bg-linear-to-b from-gray-900 to-black text-white py-6 sm:py-10 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-10">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">Puranveshana</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mb-2 sm:mb-3 leading-relaxed">
              Discover, document, and preserve India's hidden ancient heritage.
            </p>
            <p className="text-xs text-slate-400 italic mb-3 sm:mb-4">
              <span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-xs sm:text-sm">f</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-xs sm:text-sm">t</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-xs sm:text-sm">in</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-800 hover:bg-orange-600 rounded-lg flex items-center justify-center transition-all duration-300">
                <span className="text-xs sm:text-sm">ig</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Platform</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li><a href="#yatra" className="hover:text-orange-400 transition-colors">Yatra</a></li>
              <li><a href="#features" className="hover:text-orange-400 transition-colors">Features</a></li>
              <li><Link href="/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
              <li><a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Resources</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li><button onClick={() => setShowGuidelines(true)} className="hover:text-orange-400 transition-colors">Guidelines</button></li>
              <li><button onClick={() => setShowContributors(true)} className="hover:text-orange-400 transition-colors">Contributors</button></li>
              <li><button onClick={() => setShowStories(true)} className="hover:text-orange-400 transition-colors">Stories</button></li>
              <li><button onClick={() => setShowMap(true)} className="hover:text-orange-400 transition-colors">Map</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base text-orange-400">Support</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-300">
              <li><button onClick={() => setShowPrivacy(true)} className="hover:text-orange-400 transition-colors">Privacy</button></li>
              <li><button onClick={() => setShowTerms(true)} className="hover:text-orange-400 transition-colors">Terms</button></li>
              <li><button onClick={() => setShowContact(true)} className="hover:text-orange-400 transition-colors">Contact</button></li>
              <li><button onClick={() => setShowHelp(true)} className="hover:text-orange-400 transition-colors">Help</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              &copy; 2025 Puranveshana. All rights reserved.
            </p>
            <div className="flex gap-3 sm:gap-5 text-xs text-slate-400">
              <button onClick={() => setShowSitemap(true)} className="hover:text-orange-400 transition-colors">Sitemap</button>
              <button onClick={() => setShowAccessibility(true)} className="hover:text-orange-400 transition-colors">Accessibility</button>
              <button onClick={() => setShowCookies(true)} className="hover:text-orange-400 transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
