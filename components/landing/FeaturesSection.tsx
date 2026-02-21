"use client";

import Link from 'next/link';
import { Search, Camera, MapPin, BookOpen, Users, Footprints, Compass } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-10 sm:py-16 lg:py-20 bg-linear-to-b from-white via-amber-50/30 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-12 h-px bg-amber-600/40"></span>
            <Compass className="w-5 h-5 text-amber-700" />
            <span className="w-12 h-px bg-amber-600/40"></span>
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Two Ways to Contribute
          </h2>
          <p className="text-amber-700/80 text-base sm:text-lg max-w-md mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
            Document hidden sites or share your heritage journeys
          </p>
        </div>

        <div className="md:hidden space-y-6">
          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-br from-orange-200/50 via-amber-100/30 to-orange-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, #fffaf5 0%, #fff7ed 50%, #fef3e2 100%)',
                boxShadow: '0 4px 30px rgba(194, 120, 60, 0.12), 0 1px 4px rgba(194, 120, 60, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-orange-400 to-transparent"></div>

              <div className="absolute top-2 left-2 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500/60 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-0 h-full w-0.5 bg-linear-to-b from-orange-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-linear-to-l from-orange-500/60 to-transparent rounded-full"></div>
                <div className="absolute top-0 right-0 h-full w-0.5 bg-linear-to-b from-orange-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute bottom-2 left-2 w-8 h-8">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-orange-500/60 to-transparent rounded-full"></div>
                <div className="absolute bottom-0 left-0 h-full w-0.5 bg-linear-to-t from-orange-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-linear-to-l from-orange-500/60 to-transparent rounded-full"></div>
                <div className="absolute bottom-0 right-0 h-full w-0.5 bg-linear-to-t from-orange-500/60 to-transparent rounded-full"></div>
              </div>

              <div className="relative px-5 py-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                      Anveshan
                    </h3>
                    <p className="text-orange-600 font-medium text-sm">Document ancient heritage. Preserve it for generations.</p>
                  </div>
                </div>

                <p className="text-amber-800/80 text-sm mb-4 leading-relaxed">
                  Found an ancient site? Through Anveshan, you become a guardian of history — documenting what time might otherwise forget.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-orange-100 to-amber-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200/50">
                    <Camera className="w-3 h-3" />
                    Photograph
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-orange-100 to-amber-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200/50">
                    <MapPin className="w-3 h-3" />
                    Locate
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-orange-100 to-amber-50 text-orange-700 rounded-full text-xs font-medium border border-orange-200/50">
                    <BookOpen className="w-3 h-3" />
                    Document
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-linear-to-r from-amber-50/80 to-orange-50/50 border-l-3 border-orange-400 mb-4">
                  <p className="text-amber-800 text-xs italic" style={{ fontFamily: 'Georgia, serif' }}>
                    "Only photograph what is visible. Never disturb, never remove."
                  </p>
                </div>

                <Link href="/signup" className="inline-block">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-orange-500/25">
                    Begin your Anveshan
                    <Footprints className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-linear-to-br from-slate-200/50 via-slate-100/30 to-slate-200/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(145deg, #fafafa 0%, #f5f5f5 50%, #f0f0f0 100%)',
                boxShadow: '0 4px 30px rgba(71, 85, 105, 0.12), 0 1px 4px rgba(71, 85, 105, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-slate-500 to-transparent"></div>

              <div className="absolute top-2 left-2 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-slate-500/60 to-transparent rounded-full"></div>
                <div className="absolute top-0 left-0 h-full w-0.5 bg-linear-to-b from-slate-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8">
                <div className="absolute top-0 right-0 w-full h-0.5 bg-linear-to-l from-slate-500/60 to-transparent rounded-full"></div>
                <div className="absolute top-0 right-0 h-full w-0.5 bg-linear-to-b from-slate-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute bottom-2 left-2 w-8 h-8">
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-slate-500/60 to-transparent rounded-full"></div>
                <div className="absolute bottom-0 left-0 h-full w-0.5 bg-linear-to-t from-slate-500/60 to-transparent rounded-full"></div>
              </div>
              <div className="absolute bottom-2 right-2 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-0.5 bg-linear-to-l from-slate-500/60 to-transparent rounded-full"></div>
                <div className="absolute bottom-0 right-0 h-full w-0.5 bg-linear-to-t from-slate-500/60 to-transparent rounded-full"></div>
              </div>

              <div className="relative px-5 py-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/25">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800" style={{ fontFamily: 'Georgia, serif' }}>
                      Yatra
                    </h3>
                    <p className="text-slate-500 font-medium text-sm">Share your journey. Inspire preservation.</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Been on a heritage journey? Through Yatra, your experiences become bridges — connecting others to places they've never seen.
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-slate-100 to-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-200/50">
                    <MapPin className="w-3 h-3" />
                    Routes
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-slate-100 to-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-200/50">
                    <BookOpen className="w-3 h-3" />
                    Stories
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-linear-to-r from-slate-100 to-slate-50 text-slate-600 rounded-full text-xs font-medium border border-slate-200/50">
                    <Users className="w-3 h-3" />
                    Community
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-linear-to-r from-slate-100/80 to-slate-50/50 border-l-3 border-slate-400 mb-4">
                  <p className="text-slate-600 text-xs italic" style={{ fontFamily: 'Georgia, serif' }}>
                    "Every journey told is a seed planted for the next traveler."
                  </p>
                </div>

                <Link href="/signup" className="inline-block">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-slate-600 to-slate-700 text-white font-semibold text-sm rounded-full shadow-lg shadow-slate-500/25">
                    Share your Yatra
                    <Footprints className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-amber-300 to-transparent"></div>

          <div className="space-y-0">
            <div className="grid grid-cols-2 gap-16 items-center">
              <div className="relative text-right pr-12">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-linear-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 z-10">
                  <Search className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Anveshan
                </h3>
                <p className="text-orange-600 font-medium mb-4 text-sm sm:text-base">Document ancient heritage. Preserve it for generations.</p>

                <p className="text-amber-800/80 mb-6 leading-relaxed">
                  Found an ancient site? Through Anveshan, you become a guardian of history — documenting what time might otherwise forget.
                </p>

                <div className="flex flex-wrap gap-3 justify-end mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/80 text-orange-700 rounded-full text-sm">
                    <Camera className="w-3.5 h-3.5" />
                    Photograph
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/80 text-orange-700 rounded-full text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    Locate
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/80 text-orange-700 rounded-full text-sm">
                    <BookOpen className="w-3.5 h-3.5" />
                    Document
                  </span>
                </div>

                <div className="relative p-4 rounded-xl border-l-2 border-amber-400 bg-amber-50/50 mb-6 ml-auto max-w-sm">
                  <p className="text-amber-800 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
                    "Only photograph what is visible. Never disturb, never remove."
                  </p>
                </div>

                <Link href="/signup" className="inline-block">
                  <span className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group">
                    Begin your Anveshan
                    <Footprints className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

              <div></div>
            </div>

            <div className="grid grid-cols-2 gap-16 items-center mt-16">
              <div></div>

              <div className="relative pl-12">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-linear-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg shadow-slate-500/30 z-10">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Yatra
                </h3>
                <p className="text-slate-600 font-medium mb-4 text-sm sm:text-base">Share your journey. Inspire preservation.</p>

                <p className="text-slate-600 mb-6 leading-relaxed">
                  Been on a heritage journey? Through Yatra, your experiences become bridges — connecting others to places they've never seen.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    Routes
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    <BookOpen className="w-3.5 h-3.5" />
                    Stories
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm">
                    <Users className="w-3.5 h-3.5" />
                    Community
                  </span>
                </div>

                <div className="relative p-4 rounded-xl border-l-2 border-slate-300 bg-slate-50/50 mb-6 max-w-sm">
                  <p className="text-slate-600 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
                    "Every journey told is a seed planted for the next traveler."
                  </p>
                </div>

                <Link href="/signup" className="inline-block">
                  <span className="inline-flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-800 transition-colors group">
                    Share your Yatra
                    <Footprints className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-3">
          <span className="w-16 sm:w-24 h-px bg-linear-to-r from-transparent via-amber-400 to-transparent"></span>
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="w-16 sm:w-24 h-px bg-linear-to-r from-transparent via-amber-400 to-transparent"></span>
        </div>
      </div>
    </section>
  );
}
