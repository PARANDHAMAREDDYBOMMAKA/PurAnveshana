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
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed w-full z-50 px-3 sm:px-4 lg:px-6 pt-3 sm:pt-4">
      <nav className={`max-w-6xl mx-auto transition-all duration-500 rounded-2xl ${
        scrolled
          ? 'bg-white/75 backdrop-blur-xl shadow-lg shadow-black/5 border border-white/40'
          : 'bg-white/40 backdrop-blur-lg border border-white/30'
      }`}>
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                  Puranveshana
                </span>
                <span className="text-[8px] sm:text-[9px] text-orange-600/80 font-medium -mt-0.5 notranslate" translate="no">
                  पुरातन अन्वेषण
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => scrollToSection('message')}
                className="px-3 py-1.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-full transition-all duration-200 text-sm font-medium"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-3 py-1.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-full transition-all duration-200 text-sm font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('trust')}
                className="px-3 py-1.5 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-full transition-all duration-200 text-sm font-medium"
              >
                Trust
              </button>
              <div className="pl-1">
                <LanguageSelector />
              </div>
              <div className="flex items-center space-x-2 pl-2">
                <Link href="/login">
                  <button className="px-4 py-1.5 text-orange-600 hover:bg-orange-50/80 rounded-full font-semibold text-sm transition-all duration-200 border border-orange-200/50 hover:border-orange-300">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-1.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105">
                    Join Now
                  </button>
                </Link>
              </div>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl hover:bg-white/50 transition-colors"
              >
                {isMenuOpen ? <X className="text-slate-800 w-5 h-5" /> : <Menu className="text-slate-800 w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/30">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => scrollToSection('message')}
                className="block w-full text-left text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 py-2.5 px-4 rounded-xl transition-colors font-medium text-sm"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 py-2.5 px-4 rounded-xl transition-colors font-medium text-sm"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('trust')}
                className="block w-full text-left text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 py-2.5 px-4 rounded-xl transition-colors font-medium text-sm"
              >
                Trust
              </button>
              <div className="pt-2 space-y-2">
                <Link href="/login" className="block">
                  <button className="w-full px-5 py-2.5 border border-orange-200 text-orange-600 rounded-xl font-semibold text-sm hover:bg-orange-50/50 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup" className="block">
                  <button className="w-full px-5 py-2.5 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/20">
                    Join Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
