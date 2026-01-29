"use client";
import Link from 'next/link';
import { Search, BookOpen, Users, ChevronRight } from 'lucide-react';

export function YatraSection() {
  const yatraFeatures = [
    { icon: Search, title: "Discover Heritage", desc: "Explore ancient sites during your journeys and pilgrimages across India" },
    { icon: BookOpen, title: "Share Your Story", desc: "Document discoveries with photos, narratives, historical insights, and cultural observations" },
    { icon: Users, title: "Inspire Community", desc: "Share yatra experiences and inspire others to preserve our rich cultural legacy" }
  ];

  return (
    <section id="yatra" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-amber-50 via-orange-50/30 to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Yatra - Share Your Heritage Journey</h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Document your spiritual and cultural journeys, share discoveries, and inspire others through your heritage experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          {yatraFeatures.map((item, idx) => (
            <div key={idx} className="relative group">
              <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 hover:border-orange-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              {idx < yatraFeatures.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-3 lg:-right-4 items-center justify-center">
                  <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-orange-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 text-white text-center shadow-xl">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Share Your Yatra Journey Today</h3>
          <p className="text-xs sm:text-sm lg:text-base text-orange-100 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Join fellow travelers in documenting sacred sites and heritage discoveries from your spiritual journeys. Your yatra stories inspire others.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-white text-orange-600 rounded-full font-bold text-sm hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-md">
                Join as PurAnveshi
              </button>
            </Link>
            <Link href="#faq" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
