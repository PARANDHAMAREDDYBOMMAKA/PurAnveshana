"use client";

import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';

export function SimpleCTASection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Preserve History?
            </h2>

            <p className="text-lg text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
              "When I see an ancient place next time, I know exactly what to do."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center gap-2">
                  Join as Puranveshi
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/login">
                <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
