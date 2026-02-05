"use client";

import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  openFaq: number | null;
  setOpenFaq: (value: number | null) => void;
}

export default function FAQSection({ openFaq, setOpenFaq }: FAQSectionProps) {
  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-white to-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">What we would like you to know ?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600">Everything you need to know about becoming a PurAnveshi</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <button
              onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 text-left">
                What is the criteria to get paid?
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                  openFaq === 1 ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === 1 && (
              <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                <p>To receive payment, your upload must meet these requirements:</p>
                <ul className="space-y-2">
                  <li className="pl-4"><strong>Original Content:</strong> Photo/video taken by you, not downloaded from internet</li>
                  <li className="pl-4"><strong>GPS Enabled:</strong> Location data embedded in the image (keep GPS ON)</li>
                  <li className="pl-4"><strong>Unique Discovery:</strong> Not already documented in our system or online</li>
                  <li className="pl-4"><strong>Clear Documentation:</strong> Good quality images with accurate description</li>
                  <li className="pl-4"><strong>Verified:</strong> Passes our authenticity verification process</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <button
              onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 text-left">
                When and how will I receive payment?
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                  openFaq === 2 ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === 2 && (
              <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                <p>Payment process:</p>
                <ul className="space-y-2">
                  <li className="pl-4"><strong>Verification Time:</strong> 3-7 working days after submission</li>
                  <li className="pl-4"><strong>Notification:</strong> You will receive an in-app notification when verified</li>
                  <li className="pl-4"><strong>Payment Method:</strong> Direct bank transfer or UPI</li>
                  <li className="pl-4"><strong>Processing:</strong> Payments processed within 15 days of verification</li>
                  <li className="pl-4"><strong>Tracking:</strong> View payment status anytime in your dashboard</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <button
              onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 text-left">
                What kind of images get paid higher?
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                  openFaq === 3 ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === 3 && (
              <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                <p>Higher rewards are given for:</p>
                <ul className="space-y-2">
                  <li className="pl-4"><strong>Rare Discoveries:</strong> Undocumented sites, ancient inscriptions, rare idols (up to 500 rupees and above)</li>
                  <li className="pl-4"><strong>Multiple Angles:</strong> Comprehensive documentation with 5 or more clear photos</li>
                  <li className="pl-4"><strong>Historical Context:</strong> Detailed descriptions with local history or legends</li>
                  <li className="pl-4"><strong>Remote Locations:</strong> Lesser-known sites from rural or tribal areas</li>
                  <li className="pl-4"><strong>Quality Documentation:</strong> High-resolution images with proper lighting</li>
                  <li className="pl-4"><strong>Complete EXIF Data:</strong> Full GPS coordinates and camera metadata</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <button
              onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 text-left">
                What happens if I upload fake or copied images?
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                  openFaq === 4 ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === 4 && (
              <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                <p>We take authenticity seriously:</p>
                <ul className="space-y-2">
                  <li className="pl-4"><strong>First Offense:</strong> Upload rejected, no reward</li>
                  <li className="pl-4"><strong>Repeated Violations:</strong> Account suspension (temporary or permanent)</li>
                  <li className="pl-4"><strong>Fraudulent Activity:</strong> Legal action may be taken for deliberate fraud</li>
                  <li className="pl-4"><strong>Our Promise:</strong> Genuine contributors are always protected and rewarded</li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
            <button
              onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition-colors"
            >
              <h3 className="text-lg font-bold text-slate-900 text-left">
                What happens to the images I upload?
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${
                  openFaq === 5 ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openFaq === 5 && (
              <div className="px-6 pb-5 text-slate-700 leading-relaxed space-y-3">
                <p>Right now, all images you upload are stored privately for review and research. They will not be shared publicly until verified and properly documented.</p>
                <p>Later, selected discoveries may appear on the PurAnveshana Heritage Map, with credit to the explorer — but without revealing exact coordinates or sensitive site details. This ensures both privacy and protection for the ancient sites.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
