"use client";

import Link from 'next/link';
import { ChevronRight, ChevronDown, Sparkles } from 'lucide-react';

export function NewHeroSection() {
  const scrollToMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50/80 to-white"></div>
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm text-orange-700 rounded-full text-xs sm:text-sm font-semibold shadow-md border border-orange-200/50 mb-5 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="notranslate" translate="no">पुरान्वेषी भव</span>
          <span className="text-orange-400">•</span>
          <span>Be a Heritage Protector</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.15] tracking-tight mb-4 sm:mb-6">
          Document India's
          <br />
          <span className="relative inline-block mt-1 sm:mt-2">
            <span className="bg-linear-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Forgotten Heritage
            </span>
            <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full" height="6" viewBox="0 0 300 6" fill="none">
              <path d="M2 4C80 1 220 1 298 4" stroke="url(#hero-underline)" strokeWidth="3" strokeLinecap="round"/>
              <defs>
                <linearGradient id="hero-underline" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          Ancient temples, rock paintings, forgotten ruins — they're disappearing.
          <span className="text-slate-800 font-medium"> Help us preserve them.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
          <Link href="/signup" className="group">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              Start Preserving
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-full font-bold text-base sm:text-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>

        <div className="hidden sm:flex items-center justify-center gap-6 text-sm text-slate-500 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Free to join</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No excavation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Earn rewards</span>
          </div>
        </div>

        <button
          onClick={scrollToMessage}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-500 transition-colors cursor-pointer mx-auto"
        >
          <span className="text-xs font-medium">Read Our Message</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
