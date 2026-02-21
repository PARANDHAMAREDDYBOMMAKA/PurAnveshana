"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ScrollMessage() {
  return (
    <section id="message" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6 lg:px-8 bg-linear-to-b from-amber-50 via-orange-50/50 to-white">
      <div className="max-w-3xl mx-auto">
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
                  A Call to the Puranveshi
                </h2>
              </div>

              {/* Single article block for better translation context */}
              <article
                className="text-amber-900/80 text-sm sm:text-base lg:text-lg leading-relaxed sm:leading-loose"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                India has a great and rich history. The proof of that history can be seen in every village. Near our villages, beside lakes, near hills, we see ancient structures, stones, sculptures, and old paintings on walls. They are the memories of our ancestors.
                <br /><br />
                Today, many of these places are slowly disappearing. Some are getting damaged. Some are being lost without anyone even knowing. That is why we started Puranveshana.
                <br /><br />
                <span className="flex justify-center py-2">
                  <span className="w-8 sm:w-12 h-px bg-amber-400/50 inline-block"></span>
                  <span className="w-1 h-1 bg-amber-500 rounded-full mx-2 inline-block"></span>
                  <span className="w-8 sm:w-12 h-px bg-amber-400/50 inline-block"></span>
                </span>
                <br />
                If you see an ancient place, take a photo and upload it on our platform. There is no need for excavation. There is no need to remove any stone or object. Only record what is visible.
                <br /><br />
                The information you share will be kept safe. Selected valuable submissions will receive a small encouragement reward.
                <br /><br />
                You can also write about your journey in Yatra. Share how you went there and what you experienced. That will be visible to everyone.
                <br /><br />
                <span className="flex justify-center py-2">
                  <span className="w-8 sm:w-12 h-px bg-amber-400/50 inline-block"></span>
                  <span className="w-1 h-1 bg-amber-500 rounded-full mx-2 inline-block"></span>
                  <span className="w-8 sm:w-12 h-px bg-amber-400/50 inline-block"></span>
                </span>
                <br />
                <span className="block text-center font-medium text-amber-800">
                  Our history belongs to us. We must protect it. Let us preserve our heritage safely for our children and future generations.
                </span>
              </article>

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
