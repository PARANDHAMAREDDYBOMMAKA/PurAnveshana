"use client";

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function SimpleCTASection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-amber-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-2 sm:-inset-4 bg-linear-to-br from-amber-200/40 via-orange-100/30 to-amber-200/40 rounded-4xl sm:rounded-[3rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
            style={{
              background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 30%, #fef5e7 60%, #fdf2e0 100%)',
              boxShadow: '0 8px 50px rgba(180, 100, 40, 0.15), 0 2px 8px rgba(180, 100, 40, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.9)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-300 via-orange-400 to-amber-300"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-200 via-orange-300 to-amber-200"></div>

            <div className="absolute top-4 left-4 w-14 h-14 sm:w-20 sm:h-20">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute top-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-amber-400/50 rounded-tl"></div>
              <svg className="absolute top-4 left-4 sm:top-6 sm:left-6 w-4 h-4 sm:w-5 sm:h-5 text-amber-400/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
            </div>
            <div className="absolute top-4 right-4 w-14 h-14 sm:w-20 sm:h-20">
              <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-l from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute top-0 right-0 h-full w-1 bg-linear-to-b from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-amber-400/50 rounded-tr"></div>
              <svg className="absolute top-4 right-4 sm:top-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 text-amber-400/40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-14 h-14 sm:w-20 sm:h-20">
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute bottom-0 left-0 h-full w-1 bg-linear-to-t from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-amber-400/50 rounded-bl"></div>
              <svg className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-4 h-4 sm:w-5 sm:h-5 text-amber-400/40 rotate-180" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 w-14 h-14 sm:w-20 sm:h-20">
              <div className="absolute bottom-0 right-0 w-full h-1 bg-linear-to-l from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute bottom-0 right-0 h-full w-1 bg-linear-to-t from-amber-500/50 to-transparent rounded-full"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-amber-400/50 rounded-br"></div>
              <svg className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-4 h-4 sm:w-5 sm:h-5 text-amber-400/40 rotate-180" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
            </div>

            <div className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #92400e 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            ></div>

            <div className="relative px-8 sm:px-12 lg:px-20 py-12 sm:py-16 lg:py-20 text-center">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="w-10 sm:w-16 h-px bg-linear-to-r from-transparent to-amber-400"></span>
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md"></div>
                  <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <span className="w-10 sm:w-16 h-px bg-linear-to-l from-transparent to-amber-400"></span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-900 mb-5 sm:mb-8 leading-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                The past is waiting.<br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-700 via-orange-600 to-amber-700">Will you answer?</span>
              </h2>

              <div className="relative max-w-xl mx-auto mb-10 sm:mb-12">
                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-linear-to-b from-transparent via-amber-400/40 to-transparent rounded-full"></div>
                <div className="absolute -right-2 top-0 bottom-0 w-1 bg-linear-to-b from-transparent via-amber-400/40 to-transparent rounded-full"></div>
                <p
                  className="text-amber-700/80 text-lg sm:text-xl lg:text-2xl leading-relaxed px-4"
                  style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                >
                  "When I see an ancient place next time, I know exactly what to do."
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center">
                <Link href="/signup">
                  <button className="group relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-linear-to-r from-amber-800 via-amber-700 to-amber-800 text-white rounded-full font-semibold text-lg sm:text-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/30 transform hover:scale-[1.02]">
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Become a Puranveshi
                      <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-linear-to-r from-amber-900 via-amber-800 to-amber-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
                        backgroundSize: '200% 200%',
                        animation: 'shimmer 3s infinite',
                      }}
                    ></div>
                  </button>
                </Link>

                <Link href="/login">
                  <button className="px-8 sm:px-10 py-3 sm:py-4 text-amber-800 font-semibold text-base sm:text-lg hover:text-amber-900 transition-colors underline underline-offset-4 decoration-2 decoration-amber-300 hover:decoration-amber-500">
                    Already a member? Sign in
                  </button>
                </Link>
              </div>

              <div className="mt-12 sm:mt-16 flex items-center justify-center gap-3">
                <span className="w-12 sm:w-20 h-px bg-linear-to-r from-transparent to-amber-300/50"></span>
                <div className="px-4 py-2 rounded-full bg-amber-100/50 border border-amber-200/50">
                  <span className="text-amber-600/70 text-sm sm:text-base" style={{ fontFamily: 'Georgia, serif' }}>पुरातन अन्वेषण</span>
                </div>
                <span className="w-12 sm:w-20 h-px bg-linear-to-l from-transparent to-amber-300/50"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
