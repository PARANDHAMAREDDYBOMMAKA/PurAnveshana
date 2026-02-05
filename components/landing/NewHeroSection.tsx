"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MapPin } from 'lucide-react';

export function NewHeroSection() {
  const scrollToMessage = () => {
    document.getElementById('message')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-end justify-center pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      {/* Background Image Grid */}
      <div className="absolute inset-0 z-0">
        {/* Mobile: single hero image */}
        <div className="sm:hidden absolute inset-0">
          <Image
            src="/heritage/temple-gateway.jpeg"
            alt="Ancient temple gateway"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Desktop: mosaic grid */}
        <div className="hidden sm:grid grid-cols-3 h-full">
          <div className="relative overflow-hidden">
            <Image
              src="/heritage/yali-sculpture.jpeg"
              alt="Yali sculpture on temple pillar"
              fill
              className="object-cover"
              priority
              sizes="33vw"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src="/heritage/temple-gateway.jpeg"
              alt="Ancient temple gateway"
              fill
              className="object-cover"
              priority
              sizes="34vw"
            />
          </div>
          <div className="relative overflow-hidden">
            <Image
              src="/heritage/stone-ruins.jpeg"
              alt="Stone ruins against blue sky"
              fill
              className="object-cover"
              priority
              sizes="33vw"
            />
          </div>
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-amber-950/90 via-amber-950/40 to-amber-950/20"></div>
        <div className="absolute inset-0 bg-linear-to-b from-amber-950/30 via-transparent to-transparent"></div>

        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #fbbf24 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-900/40 backdrop-blur-md text-amber-200 rounded-full text-xs sm:text-sm font-medium border border-amber-600/30 mb-5 sm:mb-6">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="notranslate" translate="no">पुरान्वेषी भव</span>
          <span className="text-amber-500/60">|</span>
          <span>Be a Heritage Protector</span>
        </div>

        <h1
          className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-4 sm:mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Document India's
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-amber-200 to-amber-300">
            Forgotten Heritage
          </span>
        </h1>

        <p
          className="text-amber-100/80 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Ancient temples, rock paintings, forgotten ruins — they're disappearing.
          <span className="text-amber-200 font-medium"> Help us preserve them.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
          <Link href="/signup">
            <button className="w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-4 bg-linear-to-r from-amber-700 to-amber-800 text-amber-50 rounded-full font-semibold text-base sm:text-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 shadow-lg shadow-amber-900/40 hover:shadow-xl hover:scale-[1.02]"
              style={{ fontFamily: 'Georgia, serif' }}>
              Start Preserving
            </button>
          </Link>
          <Link href="/login">
            <button className="w-full sm:w-auto px-7 sm:px-9 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-amber-300/30 text-amber-100 rounded-full font-semibold text-base sm:text-lg hover:bg-white/20 hover:border-amber-300/50 transition-all duration-300"
              style={{ fontFamily: 'Georgia, serif' }}>
              Sign In
            </button>
          </Link>
        </div>

        <div className="hidden sm:flex items-center justify-center gap-6 text-sm text-amber-300/70 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span>Free to join</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span>No excavation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
            <span>Earn rewards</span>
          </div>
        </div>

        <button
          onClick={scrollToMessage}
          className="flex flex-col items-center gap-1 text-amber-400/60 hover:text-amber-300 transition-colors cursor-pointer mx-auto"
        >
          <span className="text-xs font-medium">Read Our Message</span>
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
