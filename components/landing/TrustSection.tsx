"use client";

import { Shield, Lock, MapPin, BookOpen, Heart, X } from 'lucide-react';

export function TrustSection() {
  return (
    <section id="trust" className="py-12 sm:py-16 lg:py-24 bg-linear-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-slate-700 to-slate-800 rounded-xl sm:rounded-2xl shadow-lg mb-4">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Our Trust & Responsibility
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Trust matters more than technology. We clearly state:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5">No Excavation</h3>
              <p className="text-xs sm:text-sm text-slate-600">We do not encourage digging of any kind</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5">No Removal</h3>
              <p className="text-xs sm:text-sm text-slate-600">Objects must stay at the site</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5">Data Privacy</h3>
              <p className="text-xs sm:text-sm text-slate-600">Your data is not shared publicly</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5">Location Protected</h3>
              <p className="text-xs sm:text-sm text-slate-600">Sensitive locations are hidden</p>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-0.5">Documentation Only</h3>
              <p className="text-xs sm:text-sm text-slate-600">Our purpose is preservation through documentation — nothing more</p>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-5 sm:p-8 text-center">
          <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-white text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Built with <span className="text-amber-400 font-semibold">responsibility</span>, <span className="text-amber-400 font-semibold">patience</span>, and <span className="text-amber-400 font-semibold">respect</span> — for people, heritage, and the future.
          </p>
        </div>
      </div>
    </section>
  );
}
