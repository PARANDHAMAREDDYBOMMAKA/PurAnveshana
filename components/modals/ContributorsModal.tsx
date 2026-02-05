"use client";

import { X, Check } from 'lucide-react';
import Link from 'next/link';

interface ContributorsModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ContributorsModal({ show, onClose }: ContributorsModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Contributors</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Join the PurAnveshi Community</h3>
            <p className="text-slate-700">Thousands of passionate explorers are documenting India's forgotten heritage. Become part of this movement to preserve our cultural legacy.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Membership Tiers</h3>
            <div className="space-y-3">
              <div className="bg-slate-100 border-2 border-slate-300 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-900">Silver PurAnveshi</h4>
                  <span className="px-3 py-1 bg-slate-400 text-white rounded-full text-xs font-bold">5+ Uploads</span>
                </div>
                <p className="text-sm text-slate-700">Entry-level contributors documenting local heritage sites</p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-900">Gold PurAnveshi</h4>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold">20+ Uploads</span>
                </div>
                <p className="text-sm text-slate-700">Active contributors with verified discoveries across multiple locations</p>
              </div>

              <div className="bg-purple-50 border-2 border-purple-400 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold text-slate-900">Platinum PurAnveshi</h4>
                  <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">50+ Uploads</span>
                </div>
                <p className="text-sm text-slate-700">Elite contributors dedicated to heritage preservation with exceptional discoveries</p>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Benefits of Higher Tiers</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Priority verification for new uploads</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Higher reward potential for rare discoveries</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Featured on our contributors leaderboard</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Special recognition badges on your profile</span>
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
            <h3 className="font-bold mb-2"><span className="notranslate" translate="no">पुरान्वेषी भव</span> — Be a PurAnveshi</h3>
            <p className="text-sm mb-4">Start your journey today and join our growing community of heritage preservers</p>
            <Link href="/signup">
              <button onClick={onClose} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                Join Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
