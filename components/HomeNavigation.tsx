"use client";
import Link from 'next/link';
import { MapPin, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface HomeNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  scrolled: boolean;
}

export function HomeNavigation({ isMenuOpen, setIsMenuOpen, scrolled }: HomeNavigationProps) {
  return (
    <div className="fixed w-full z-50 px-3 sm:px-4 lg:px-6 pt-2 sm:pt-3">
      <nav className={`max-w-4xl mx-auto transition-all duration-300 ${
        isMenuOpen
          ? 'rounded-2xl'
          : 'rounded-full'
      } ${
        scrolled
          ? 'bg-amber-50/90 backdrop-blur-xl shadow-md shadow-amber-900/5 border border-amber-200/50'
          : 'bg-amber-50/60 backdrop-blur-md border border-amber-100/50'
      }`}>
        <div className="px-3 sm:px-5">
          <div className="flex justify-between items-center h-12 sm:h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                scrolled
                  ? 'bg-amber-800 shadow-sm'
                  : 'bg-amber-700'
              }`}>
                <MapPin className="w-4 h-4 text-amber-50" />
              </div>
              <span
                className="text-base sm:text-lg font-bold text-amber-900 group-hover:text-amber-700 transition-colors notranslate"
                style={{ fontFamily: 'Georgia, serif' }}
                translate="no"
              >
                Puranveshana <br /> पुरातन अन्वेषण
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <LanguageSelector />
              <Link href="/login">
                <button className="px-5 py-2 text-amber-800 hover:text-amber-900 font-medium text-sm transition-colors">
                  Login
                </button>
              </Link>
              {/* <Link href="/signup">
                <button className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-full font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md">
                  Get Started
                </button>
              </Link> */}
            </div>

            <div className="sm:hidden flex items-center gap-1">
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-amber-100/50 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="text-amber-800 w-5 h-5" />
                ) : (
                  <Menu className="text-amber-800 w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="sm:hidden border-t border-amber-200/50 mx-3 pb-3">
            <div className="py-3 space-y-2">
              <Link href="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2.5 bg-amber-800 text-amber-50 rounded-lg font-medium text-sm hover:bg-amber-900 transition-colors text-center">
                  Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
