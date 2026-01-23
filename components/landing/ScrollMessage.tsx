"use client";

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function ScrollMessage() {
  return (
    <section id="message" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-amber-50 via-orange-50/50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <div className="relative h-8 sm:h-12 bg-linear-to-b from-amber-700 via-amber-600 to-amber-800 rounded-t-full shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-amber-900/30 via-transparent to-amber-900/30"></div>
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-linear-to-b from-amber-800 to-amber-900"></div>
            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-linear-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-linear-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>
          </div>

          <div
            className="relative px-5 sm:px-8 lg:px-12 py-6 sm:py-10 lg:py-12"
            style={{
              background: 'linear-gradient(180deg, #f5e6c8 0%, #e8d4a8 20%, #f0deb8 50%, #e5d0a0 80%, #dcc498 100%)',
              boxShadow: 'inset 0 0 40px rgba(139, 90, 43, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
            }}
          >
            <div className="absolute top-0 left-0 w-6 h-full bg-linear-to-r from-amber-900/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-6 h-full bg-linear-to-l from-amber-900/10 to-transparent"></div>

            <div className="relative z-10 space-y-4 sm:space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  Message to the Puranveshi
                </h2>
                <div className="w-16 sm:w-20 h-0.5 bg-linear-to-r from-transparent via-amber-700 to-transparent mx-auto"></div>
              </div>

              <p className="text-sm sm:text-base text-amber-900/90 italic text-center" style={{ fontFamily: 'Georgia, serif' }}>
                Greetings to my fellow Puranveshi, protectors of the land,
              </p>

              <div className="space-y-3 sm:space-y-4 text-amber-900/85 text-sm sm:text-base leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                <p>
                  Our land, <strong>Bharata</strong>, is not just soil and stone. It is a living memory built over thousands of years.
                </p>

                <p>
                  Across villages, forests, and hill regions, ancient structures, rock paintings, and heritage sites still stand silently — carrying stories of those who came before us.
                </p>

                <p>
                  Today, many of these places are fading away. Some are forgotten. Some disappear without ever being recorded.
                </p>

                <p>
                  We created <strong>Puranveshana</strong> — a platform where people can document and preserve ancient heritage, without disturbing it.
                </p>

                <p className="bg-amber-100/50 p-3 rounded-lg border-l-4 border-amber-700 text-sm">
                  Started by <strong>people who care about local history</strong> — preservation begins with ordinary people.
                </p>

                <p className="font-semibold text-amber-900 text-center">
                  Our purpose: preserve knowledge today, so future generations are not left with silence.
                </p>
              </div>

              <div className="pt-2 text-center">
                <Link href="/signup">
                  <button className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-linear-to-r from-amber-700 to-amber-800 text-white rounded-full font-semibold text-sm sm:text-base hover:from-amber-800 hover:to-amber-900 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Begin Your Journey
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative h-8 sm:h-12 bg-linear-to-t from-amber-700 via-amber-600 to-amber-800 rounded-b-full shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-amber-900/30 via-transparent to-amber-900/30"></div>
            <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-t from-amber-800 to-amber-900"></div>
            <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-linear-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>
            <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-6 sm:h-6 bg-linear-to-br from-amber-600 to-amber-800 rounded-full shadow-md"></div>

            <div className="absolute -top-4 sm:-top-5 right-6 sm:right-10 w-10 h-10 sm:w-12 sm:h-12">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-linear-to-br from-red-700 via-red-800 to-red-900 rounded-full shadow-lg"></div>
                <div className="absolute inset-1 bg-linear-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <span className="text-red-200 font-bold text-xs" style={{ fontFamily: 'Georgia, serif' }}>P</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
