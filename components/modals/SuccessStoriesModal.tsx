"use client";

import { X, Users, Camera, Shield, Award } from 'lucide-react';
import Link from 'next/link';

interface SuccessStoriesModalProps {
  show: boolean;
  onClose: () => void;
}

export default function SuccessStoriesModal({ show, onClose }: SuccessStoriesModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Success Stories</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <p className="text-slate-700">Inspiring stories from PurAnveshis who are making a difference in heritage preservation.</p>

          <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ramesh's Ancient Temple Discovery</h3>
                <p className="text-sm text-orange-600 font-semibold">Chhattisgarh</p>
              </div>
            </div>
            <p className="text-slate-700 mb-3">Ramesh, a school teacher from rural Chhattisgarh, discovered a 10th-century stone temple hidden in the forest near his village. His detailed documentation with GPS data earned him recognition and a reward of 150 rupees. The site is now being studied by archaeologists.</p>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">Verified Discovery</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">150 rupees earned</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shrink-0">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Priya's Rock Art Documentation</h3>
                <p className="text-sm text-blue-600 font-semibold">Madhya Pradesh</p>
              </div>
            </div>
            <p className="text-slate-700 mb-3">Priya, a college student and photography enthusiast, documented prehistoric rock paintings in a remote cave system. Her comprehensive photo series helped researchers date the art to over 8,000 years old. She received a rare find bonus of 600 rupees and achieved Gold PurAnveshi status.</p>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-600 font-semibold">Rare Discovery</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">600 rupees earned</span>
            </div>
          </div>

          <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <div className="flex items-start gap-4 mb-3">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Vikram's Heritage Village Project</h3>
                <p className="text-sm text-green-600 font-semibold">Rajasthan</p>
              </div>
            </div>
            <p className="text-slate-700 mb-3">Vikram systematically documented 35 forgotten step-wells and water structures in his district over 6 months. His dedication earned him Platinum PurAnveshi status and his work is now featured in a heritage conservation report by the state government.</p>
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-semibold">Platinum PurAnveshi</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">35+ sites documented</span>
            </div>
          </div>

          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
            <h3 className="font-bold mb-2">Your Story Could Be Next</h3>
            <p className="text-sm mb-4">Every heritage site you discover adds to India's cultural map and helps preserve our history for future generations</p>
            <Link href="/signup">
              <button onClick={onClose} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                Start Your Journey
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
