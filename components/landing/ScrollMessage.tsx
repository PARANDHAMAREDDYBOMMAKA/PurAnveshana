"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ScrollMessage() {
  return (
    <section id="message" className="pt-20 sm:pt-24 lg:pt-28 pb-6 sm:pb-8 lg:pb-10 px-3 sm:px-6 lg:px-8 bg-linear-to-b from-amber-50 via-orange-50/50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-6 sm:mb-8">
          <div className="hidden sm:block absolute -left-2 top-1/2 w-1.5 h-1.5 bg-amber-700/40 rounded-full"></div>
          <div className="hidden sm:block absolute -left-4 top-1/3 w-1 h-1 bg-amber-600/30 rounded-full"></div>
          <div className="hidden sm:block absolute -right-3 top-2/3 w-1 h-1 bg-amber-700/30 rounded-full"></div>

          <div className="relative px-4 sm:px-10 py-5 sm:py-8">
            <div className="hidden sm:block absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #8B4513 0, #8B4513 1px, transparent 0, transparent 8px)',
              }}
            ></div>

            <div className="flex justify-center mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-10 sm:h-10 text-amber-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="16" y1="8" x2="2" y2="22" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="17.5" y1="15" x2="9" y2="15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="text-center relative">
              <p
                className="text-base sm:text-xl lg:text-2xl text-amber-900/90 leading-relaxed sm:tracking-wide"
                style={{
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                }}
              >
                <span className="text-amber-700">"</span>
                Started by{' '}
                <span className="relative inline-block">
                  <span className="font-semibold text-amber-800 not-italic">people who care</span>
                  <span className="hidden sm:block absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-600 to-transparent"></span>
                </span>
                {' '}about local history
                <span className="text-amber-700">"</span>
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 my-2 sm:my-3">
                <span className="w-6 sm:w-8 h-px bg-amber-600/40"></span>
                <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-amber-600/60 rounded-full"></span>
                <span className="w-6 sm:w-8 h-px bg-amber-600/40"></span>
              </div>

              <p
                className="text-xs sm:text-base text-amber-700/80 tracking-wider sm:tracking-widest uppercase"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                preservation begins with ordinary people
              </p>
            </div>

            <div className="hidden sm:block absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-600/20 rounded-tl-sm"></div>
            <div className="hidden sm:block absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-600/20 rounded-tr-sm"></div>
            <div className="hidden sm:block absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-600/20 rounded-bl-sm"></div>
            <div className="hidden sm:block absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-600/20 rounded-br-sm"></div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-700 rounded-full shadow-sm"></div>
              <div className="w-10 sm:w-24 h-0.5 sm:h-1 bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-700 rounded-full shadow-sm"></div>
            </div>
          </div>

          <div
            className="relative rounded-xl sm:rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 4px 24px rgba(139, 90, 43, 0.15), 0 1px 3px rgba(139, 90, 43, 0.1)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #f8f0e3 0%, #f0e4d0 25%, #f5edd8 50%, #ebe0c9 75%, #f2e8d5 100%)',
              }}
            ></div>

            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-linear-to-r from-amber-200 via-amber-100 to-amber-200"></div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-linear-to-r from-amber-300 via-amber-200 to-amber-300"></div>

            <div className="hidden sm:block absolute top-0 left-0 w-8 h-full bg-linear-to-r from-amber-900/[0.07] to-transparent"></div>
            <div className="hidden sm:block absolute top-0 right-0 w-8 h-full bg-linear-to-l from-amber-900/[0.07] to-transparent"></div>

            <div className="relative px-4 sm:px-10 lg:px-14 py-6 sm:py-12 lg:py-14">
              <div className="text-center mb-5 sm:mb-8">
                <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="w-6 sm:w-10 h-px bg-amber-600/30"></span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700/60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
                  </svg>
                  <span className="w-6 sm:w-10 h-px bg-amber-600/30"></span>
                </div>
                <h2
                  className="text-lg sm:text-2xl lg:text-3xl font-bold text-amber-900"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Message to the Puranveshi
                </h2>
                <p className="text-amber-700/60 text-[10px] sm:text-sm mt-1.5 sm:mt-2 tracking-wider uppercase">
                  Protectors of the Land
                </p>
              </div>

              <div
                className="space-y-4 sm:space-y-6 text-amber-900/80 text-sm sm:text-base lg:text-lg leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <p className="first-letter:text-2xl sm:first-letter:text-3xl first-letter:font-bold first-letter:text-amber-800 first-letter:float-left first-letter:mr-1.5 sm:first-letter:mr-2 first-letter:leading-none">
                  Our land, <strong className="text-amber-800">Bharata</strong>, is not just soil and stone. It is a living memory built over thousands of years.
                </p>

                <p>
                  Across villages, forests, and hill regions, ancient structures, rock paintings, and heritage sites still stand silently — carrying stories of those who came before us.
                </p>

                <p>
                  Today, many of these places are fading away. Some are forgotten. Some disappear without ever being recorded.
                </p>

                <p>
                  We created <strong className="text-amber-800 notranslate" translate="no">Puranveshana</strong> — a platform where people can document and preserve ancient heritage, without disturbing it.
                </p>

                <div className="py-3 sm:py-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-8 sm:w-12 h-px bg-amber-400/50"></span>
                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                    <span className="w-8 sm:w-12 h-px bg-amber-400/50"></span>
                  </div>
                </div>

                <p
                  className="text-center text-amber-800 font-medium text-sm sm:text-lg"
                  style={{ fontStyle: 'italic' }}
                >
                  "Preserve knowledge today, so future generations are not left with silence."
                </p>
              </div>

              <div className="mt-6 sm:mt-10 text-center">
                <Link href="/signup">
                  <button className="group inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 bg-amber-800 text-amber-50 rounded-full font-semibold text-sm sm:text-base hover:bg-amber-900 transition-all duration-300 shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/25">
                    Begin Your Journey
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div className="hidden sm:block absolute top-6 left-6 w-4 h-4 border-t border-l border-amber-700/20"></div>
              <div className="hidden sm:block absolute top-6 right-6 w-4 h-4 border-t border-r border-amber-700/20"></div>
              <div className="hidden sm:block absolute bottom-6 left-6 w-4 h-4 border-b border-l border-amber-700/20"></div>
              <div className="hidden sm:block absolute bottom-6 right-6 w-4 h-4 border-b border-r border-amber-700/20"></div>
            </div>
          </div>

          <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-700 rounded-full shadow-sm"></div>
              <div className="w-10 sm:w-24 h-0.5 sm:h-1 bg-linear-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full"></div>
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-amber-700 rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
