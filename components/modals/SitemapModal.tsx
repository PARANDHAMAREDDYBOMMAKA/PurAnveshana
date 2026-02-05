"use client";

import { X } from 'lucide-react';
import Link from 'next/link';

interface SitemapModalProps {
  show: boolean;
  onClose: () => void;
  onOpenGuidelines?: () => void;
  onOpenContributors?: () => void;
  onOpenStories?: () => void;
  onOpenMap?: () => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
  onOpenContact?: () => void;
  onOpenHelp?: () => void;
  onOpenAccessibility?: () => void;
}

export default function SitemapModal({
  show,
  onClose,
  onOpenGuidelines,
  onOpenContributors,
  onOpenStories,
  onOpenMap,
  onOpenPrivacy,
  onOpenTerms,
  onOpenCookies,
  onOpenContact,
  onOpenHelp,
  onOpenAccessibility
}: SitemapModalProps) {
  if (!show) return null;

  const handleModalOpen = (callback?: () => void) => {
    onClose();
    if (callback) {
      callback();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Sitemap</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Main Pages</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><a href="/" className="hover:text-orange-600 transition-colors">Home</a></li>
              <li><a href="#features" onClick={onClose} className="hover:text-orange-600 transition-colors">Features</a></li>
              <li><a href="#yatra" onClick={onClose} className="hover:text-orange-600 transition-colors">Yatra</a></li>
              <li><a href="#faq" onClick={onClose} className="hover:text-orange-600 transition-colors">FAQ</a></li>
              <li><Link href="/dashboard" className="hover:text-orange-600 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Account</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/signup" className="hover:text-orange-600 transition-colors">Sign Up</Link></li>
              <li><Link href="/login" className="hover:text-orange-600 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><button onClick={() => handleModalOpen(onOpenGuidelines)} className="hover:text-orange-600 transition-colors">Contribution Guidelines</button></li>
              <li><button onClick={() => handleModalOpen(onOpenContributors)} className="hover:text-orange-600 transition-colors">Contributors</button></li>
              <li><button onClick={() => handleModalOpen(onOpenStories)} className="hover:text-orange-600 transition-colors">Success Stories</button></li>
              <li><button onClick={() => handleModalOpen(onOpenMap)} className="hover:text-orange-600 transition-colors">Heritage Map</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Legal & Support</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><button onClick={() => handleModalOpen(onOpenPrivacy)} className="hover:text-orange-600 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => handleModalOpen(onOpenTerms)} className="hover:text-orange-600 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => handleModalOpen(onOpenCookies)} className="hover:text-orange-600 transition-colors">Cookie Policy</button></li>
              <li><button onClick={() => handleModalOpen(onOpenContact)} className="hover:text-orange-600 transition-colors">Contact Us</button></li>
              <li><button onClick={() => handleModalOpen(onOpenHelp)} className="hover:text-orange-600 transition-colors">Help Center</button></li>
              <li><button onClick={() => handleModalOpen(onOpenAccessibility)} className="hover:text-orange-600 transition-colors">Accessibility</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
