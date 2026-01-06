"use client";

import { X, MapPin, Check } from 'lucide-react';
import Link from 'next/link';

interface HeritageMapModalProps {
  show: boolean;
  onClose: () => void;
}

export default function HeritageMapModal({ show, onClose }: HeritageMapModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">India's Hidden Heritage Map</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon!</h3>
                <p className="text-slate-700">We are building an interactive map to showcase all the heritage sites discovered by PurAnveshis across India.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Planned Features</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Interactive Map View</h4>
                  <p className="text-sm text-slate-700">Explore heritage sites on an interactive map of India with zoom and filter options</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">GPS-Tagged Locations</h4>
                  <p className="text-sm text-slate-700">Every verified site will appear with exact GPS coordinates and detailed information</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Filter by Category</h4>
                  <p className="text-sm text-slate-700">Search for temples, ruins, inscriptions, rock art, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Contributor Credits</h4>
                  <p className="text-sm text-slate-700">See which PurAnveshi discovered each site and read their stories</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900">Virtual Tours</h4>
                  <p className="text-sm text-slate-700">View photo galleries and 360-degree images of documented sites</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white text-center">
            <h3 className="font-bold mb-2">Help Build the Map</h3>
            <p className="text-sm mb-4">Every verified upload you make will appear on our heritage map. Start discovering today!</p>
            <Link href="/signup">
              <button onClick={onClose} className="bg-white text-orange-600 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                Become a PurAnveshi
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
