"use client";

import Link from 'next/link';

export default function FinalCTASection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-r from-orange-500 to-amber-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
          Ready to Preserve History?
        </h2>
        <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-6 sm:mb-8">
          Join thousands of heritage enthusiasts documenting India's ancient treasures
        </p>
        <Link href="/signup" className="inline-block">
          <button className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-white text-orange-600 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            Get Started Now
          </button>
        </Link>
      </div>
    </section>
  );
}
