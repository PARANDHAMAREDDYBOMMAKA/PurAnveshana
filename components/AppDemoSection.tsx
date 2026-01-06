"use client";
import Link from 'next/link';
import AppDemo from '@/components/AppDemo';

export function AppDemoSection() {
  return (
    <section id="see-it-in-action" className="py-12 sm:py-16 lg:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
            See It In Action
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
            Watch how easy it is to document heritage sites and earn rewards
          </p>
        </div>

        <AppDemo />

        <div className="text-center mt-8 sm:mt-12">
          <Link href="/signup">
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              Start Uploading Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
