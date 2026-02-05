"use client";

import { Shield, Lock, MapPin, Eye, Hand, Heart } from 'lucide-react';

export function TrustSection() {
  return (
    <section id="trust" className="py-10 sm:py-14 lg:py-16 bg-linear-to-b from-slate-50 via-slate-100/50 to-white">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-px bg-slate-400"></span>
            <Shield className="w-5 h-5 text-slate-600" />
            <span className="w-8 h-px bg-slate-400"></span>
          </div>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-3"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Our Pledge
          </h2>
          <p className="text-slate-600 text-base sm:text-lg" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Trust is the foundation of preservation
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-b from-amber-50/50 via-transparent to-amber-50/50 rounded-3xl"></div>

          <div className="relative px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-700/30"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-700/30"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-700/30"></div>

            <div className="space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Hand className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    We Do Not Disturb
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    No excavation, no removal. Heritage stays where it belongs — in its original resting place.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-linear-to-r from-transparent via-amber-300 to-transparent"></div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    Your Data is Yours
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Personal information stays private. We protect what you share with the same care you give to heritage.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-linear-to-r from-transparent via-amber-300 to-transparent"></div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    Locations Stay Hidden
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Sensitive site coordinates are never publicly revealed. Protection through discretion.
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-linear-to-r from-transparent via-amber-300 to-transparent"></div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                    Documentation Only
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Our purpose is to record and preserve through images and words — nothing more, nothing less.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <div className="inline-block relative px-8 py-4">
            <Heart className="w-5 h-5 text-amber-600 mx-auto mb-3" />
            <p
              className="text-amber-800 text-base sm:text-lg leading-relaxed max-w-md"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              "Built with responsibility, patience, and respect — for people, heritage, and the future."
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-6 h-px bg-amber-400"></span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              <span className="w-6 h-px bg-amber-400"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
