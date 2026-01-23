"use client";

import Link from 'next/link';
import { Search, Camera, MapPin, BookOpen, Users, ChevronRight, AlertCircle, Check } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
            What You Can Do
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Two Ways to Contribute
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Choose how you want to help preserve India's heritage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          <div className="relative bg-linear-to-br from-orange-50 via-amber-50/50 to-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-orange-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="hidden sm:block absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-500 to-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Search className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Anveshan</h3>
                  <p className="text-orange-600 font-medium text-sm sm:text-base">Document Heritage</p>
                </div>
              </div>

              <p className="text-slate-600 mb-4 sm:mb-5 text-sm sm:text-base leading-relaxed">
                Found an ancient site? Document it through Anveshan and help preserve it for future generations.
              </p>

              <div className="space-y-2.5 mb-4 sm:mb-5">
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                  <span>Take photographs of the site</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                  <span>Share the location details</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 shrink-0" />
                  <span>Add basic description</span>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-amber-800 mb-0.5">Important</p>
                    <p className="text-amber-700">No digging or excavation. Only photograph what's visible.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm font-medium">
                  <Check className="w-4 h-4" />
                  <span>Eligible for rewards</span>
                </div>
                <Link href="/signup">
                  <button className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors">
                    Start Anveshan
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative bg-linear-to-br from-slate-50 via-slate-50/50 to-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="hidden sm:block absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full -translate-y-12 translate-x-12 opacity-50"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-slate-600 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/20">
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Yatra</h3>
                  <p className="text-slate-600 font-medium text-sm sm:text-base">Share Your Journey</p>
                </div>
              </div>

              <p className="text-slate-600 mb-4 sm:mb-5 text-sm sm:text-base leading-relaxed">
                Been on a heritage journey? Share your experience and inspire others to explore our past.
              </p>

              <div className="space-y-2.5 mb-4 sm:mb-5">
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                  <span>Share your travel route</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                  <span>Describe your experience</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 text-sm sm:text-base">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0" />
                  <span>Inspire the community</span>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 mt-0.5 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <p className="font-semibold text-slate-800 mb-0.5">Community Feature</p>
                    <p className="text-slate-600">Public stories to inspire awareness and connection.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm font-medium">
                  <span>Free to share</span>
                </div>
                <Link href="/signup">
                  <button className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-700 text-white rounded-full font-semibold text-sm hover:bg-slate-800 transition-colors">
                    Share Yatra
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
