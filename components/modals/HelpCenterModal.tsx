"use client";

import { X } from 'lucide-react';

interface HelpCenterModalProps {
  show: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export default function HelpCenterModal({ show, onClose, onOpenContact }: HelpCenterModalProps) {
  if (!show) return null;

  const handleContactClick = () => {
    onClose();
    if (onOpenContact) {
      onOpenContact();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Help Center</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-lg">
            <h3 className="font-bold text-slate-900 mb-2">Quick Start</h3>
            <p className="text-sm text-slate-700">New to PurAnveshana? Check out our <a href="#yatra" onClick={onClose} className="text-orange-600 font-semibold">Yatra</a> section to learn about sharing your heritage journeys!</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Common Questions</h3>
            <div className="space-y-3">
              <details className="group bg-slate-50 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-slate-900">How do I upload a site?</summary>
                <p className="mt-2 text-sm text-slate-700">Sign up, go to your dashboard, click "Upload New Site", add photos with GPS enabled, write a description, and submit for verification.</p>
              </details>

              <details className="group bg-slate-50 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-slate-900">When will I get paid?</summary>
                <p className="mt-2 text-sm text-slate-700">Payments are processed within 15 days after your upload is verified. You'll receive a notification once verification is complete.</p>
              </details>

              <details className="group bg-slate-50 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-slate-900">Why was my upload rejected?</summary>
                <p className="mt-2 text-sm text-slate-700">Common reasons include: missing GPS data, duplicate content, poor image quality, or downloaded images. Check your email for specific feedback.</p>
              </details>

              <details className="group bg-slate-50 rounded-lg p-4">
                <summary className="font-semibold cursor-pointer text-slate-900">How do I become a Platinum member?</summary>
                <p className="mt-2 text-sm text-slate-700">Membership tiers are based on verified uploads: Silver (5+), Gold (20+), Platinum (50+). Keep contributing authentic discoveries!</p>
              </details>
            </div>
          </div>

          <div className="bg-linear-to-r from-orange-500 to-amber-600 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-2">Still need help?</h3>
            <p className="text-sm mb-3">Contact our support team for personalized assistance.</p>
            <button onClick={handleContactClick} className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
