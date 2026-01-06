"use client";

import { X } from 'lucide-react';

interface TermsOfServiceModalProps {
  show: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({ show, onClose }: TermsOfServiceModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Terms of Service</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
          <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">1. Acceptance of Terms</h3>
          <p>By accessing and using PurAnveshana, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">2. User Responsibilities</h3>
          <p>You agree to provide authentic, original content with accurate location data. You must not upload copyrighted material, AI-generated images, or false information.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">3. Content Ownership</h3>
          <p>You retain ownership of your uploaded content but grant us a license to use, display, and distribute it for the purpose of preserving and showcasing India's heritage.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">4. Payment Terms</h3>
          <p>Payments are made for verified, unique contributions. We reserve the right to reject submissions that don't meet our quality or authenticity standards. Once payment processing begins, uploaded content cannot be edited or deleted.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">5. Account Termination</h3>
          <p>We reserve the right to suspend or terminate accounts that violate these terms, including those submitting fraudulent or copied content.</p>
        </div>
      </div>
    </div>
  );
}
