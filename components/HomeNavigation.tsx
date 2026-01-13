"use client";
import Link from 'next/link';
import { MapPin, Award, Menu, X } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface HomeNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  scrolled: boolean;
}

export function HomeNavigation({ isMenuOpen, setIsMenuOpen, scrolled }: HomeNavigationProps) {
  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight">
                Puranveshana
              </span>
              <span className="text-[10px] sm:text-xs text-orange-600 font-semibold -mt-1 notranslate" translate="no">
                पुरातन अन्वेषण
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#yatra" className="text-slate-700 hover:text-orange-600 transition">Yatra</a>
            <a href="#rewards" className="text-slate-700 hover:text-orange-600 transition flex items-center gap-1">
              <Award className="w-4 h-4" />
              Rewards
            </a>
            <a href="#why-join" className="text-slate-700 hover:text-orange-600 transition">Why Join Puranveshana</a>
            <LanguageSelector />
            <Link href="/signup">
              <button className="px-6 py-2 bg-linear-to-r cursor-pointer from-orange-500 to-amber-600 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Join Now
              </button>
            </Link>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <LanguageSelector />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="text-black" /> : <Menu className="text-black" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a href="#yatra" className="block text-slate-700 hover:text-orange-600">Yatra</a>
            <a href="#rewards" className="flex items-center gap-2 text-slate-700 hover:text-orange-600">
              <Award className="w-4 h-4" />
              Rewards
            </a>
            <a href="#why-join" className="block text-slate-700 hover:text-orange-600">Why Join Puranveshana</a>
            <Link href="/signup">
              <button className="w-full px-6 py-2 cursor-pointer bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full">
                Join Now
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
