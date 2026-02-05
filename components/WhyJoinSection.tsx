"use client";

import Link from 'next/link';
import { BadgeIndianRupee, MapPin, Award, Users, ChevronRight } from 'lucide-react';

export default function WhyJoinSection() {
  return (
    <section id="why-join" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white via-slate-50 to-amber-50/30 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-linear-to-br from-orange-300 to-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-linear-to-br from-amber-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            Why Join PurAnveshana
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Be part of a movement preserving India's forgotten heritage while earning rewards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-green-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BadgeIndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Earn Real Money</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Simple, transparent, direct-to-UPI payments for every verified contribution you make.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full">Instant Payouts</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-semibold rounded-full">No Hidden Fees</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-amber-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-100 to-orange-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Preserve Heritage</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Your discoveries help us build the comprehensive map of forgotten India's cultural treasures.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold rounded-full">Cultural Impact</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs sm:text-sm font-semibold rounded-full">Legacy Builder</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-purple-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-violet-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Get Recognized</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Be featured on our "Hall of Heritage" page and showcase your contributions to the nation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold rounded-full">Public Recognition</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold rounded-full">Top Contributor</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-blue-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-cyan-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 sm:gap-4 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Join the Movement</h3>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-4">
                Become one of India's first citizen-archaeologists and shape the future of heritage preservation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">Community First</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm font-semibold rounded-full">Pioneer Status</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <div className="bg-linear-to-r from-orange-500 via-amber-600 to-orange-500 rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Make an Impact?
            </h3>
            <p className="text-base sm:text-lg text-orange-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of PurAnveshis across India who are documenting our shared heritage and earning rewards for their contributions.
            </p>
            <Link href="/signup">
              <button className="px-8 sm:px-10 lg:px-12 py-3 sm:py-4 bg-white text-orange-600 rounded-full font-bold text-base sm:text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3">
                Start Your Journey Today
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
