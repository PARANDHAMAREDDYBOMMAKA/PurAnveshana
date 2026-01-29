"use client";

import Link from 'next/link';
import { Check, MapPin, Shield, Users, ChevronRight } from 'lucide-react';

export default function VerificationSection() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center px-2">What "Verified" Means</h3>
          <p className="text-center text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            We verify every upload for authenticity, location, and uniqueness.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">1. Authentic Content</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">सत्य / वास्तविक</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0">•</span>
                  <span>You must click the photo or record the video yourself.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0">•</span>
                  <span>Uploads from Google, social media, or AI tools are rejected.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5 shrink-0">•</span>
                  <span>Only real places and heritage objects are rewarded.</span>
                </li>
              </ul>
            </div>

            <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">2. Geotagged Location</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">भौगोलिकाङ्कित</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                  <span>Keep your phone's location (GPS) ON while capturing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                  <span>This confirms that the image was taken on-site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5 shrink-0">•</span>
                  <span>Verified locations appear on our "India's Hidden Heritage Map."</span>
                </li>
              </ul>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 shrink-0" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">3. Unique Discovery</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 mb-2 font-medium notranslate" translate="no">पुरातन स्थान अन्वेषण</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm lg:text-base text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                  <span>Our system checks if the same image exists online.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                  <span>If it's new and not listed anywhere — you earn the reward.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5 shrink-0">•</span>
                  <span>Truly rare finds may get a PurAnveshi Bonus (₹500+).</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border-2 border-orange-200">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Example</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <span className="font-semibold">Ramesh from Chhattisgarh</span> found an old stone carving near his village.
                He uploaded clear photos with GPS on, added a short note about the site.
                The system verified it — and he earned <span className="font-bold text-green-600">₹150</span> as an authentic, geotagged discovery.
                His find now appears on the national PurAnveshana map.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12 px-2">
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
            <span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Explore, record, and preserve the stories of India's forgotten past.
            Every discovery you make brings ancient India closer to life again.
          </p>
          <Link href="/signup" className="inline-block">
            <button className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-linear-to-r from-orange-500 to-amber-600 text-white rounded-full font-bold text-base sm:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
              Become a PurAnveshi
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
