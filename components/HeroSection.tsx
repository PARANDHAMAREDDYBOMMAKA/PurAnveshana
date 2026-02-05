"use client";
import Link from 'next/link';
import { Award, ChevronRight } from 'lucide-react';
import { IndiaMapAnimation } from './IndiaMapAnimation';

export function HeroSection() {
  return (
    <section className="relative pt-20 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-br from-amber-50 via-orange-50 to-white"></div>
        <div className="absolute top-10 sm:top-20 left-0 sm:left-10 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-20 sm:top-40 right-0 sm:right-10 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMCAwdjJoLTJ2LTJoMnptLTIgMmgtMnYtMmgycHYyem0wIDBoLTJ2Mmgydi0yem0yIDB2Mmgydi0yaC0yem0wIDBodjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          <div className="space-y-5 sm:space-y-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-linear-to-r from-orange-100 via-amber-100 to-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-bold shadow-md border border-orange-200 hover:shadow-lg transition-shadow duration-300">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="notranslate" translate="no">पुरान्वेषी भव</span>
              <span className="hidden sm:inline">—</span>
              <span>Be a PurAnveshi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Rediscover India's{' '}
              <span className="relative inline-block">
                <span className="bg-linear-to-r from-orange-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Hidden Heritage
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C60 3 140 3 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}and{' '}
              <strong className="text-orange-600 relative">
                Get Rewarded!
              </strong>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed max-w-2xl">
              Every forgotten temple, ruin, or inscription you uncover could earn you a{' '}
              <span className="font-bold text-green-600">cash reward</span> — because real explorers like you are helping us protect Bharat's lost heritage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link href="/signup" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto cursor-pointer px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-linear-to-r from-orange-500 via-orange-600 to-amber-600 text-white rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl text-sm sm:text-base md:text-lg relative overflow-hidden">
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  <span className="relative">Upload a Hidden Place</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 relative group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 border-2 border-orange-500 text-orange-600 rounded-full font-bold hover:bg-orange-50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg relative overflow-hidden group-hover:border-orange-600">
                  <span className="relative">Login</span>
                </button>
              </Link>
            </div>
          </div>

          <IndiaMapAnimation />
        </div>
      </div>
    </section>
  );
}
