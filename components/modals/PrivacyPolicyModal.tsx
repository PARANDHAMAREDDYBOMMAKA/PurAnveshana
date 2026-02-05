"use client";

import { X } from 'lucide-react';

interface PrivacyPolicyModalProps {
  show: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ show, onClose }: PrivacyPolicyModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Privacy Policy</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
          <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">1. Information We Collect</h3>
          <p>We collect information you provide directly to us when you create an account, upload heritage site information, or communicate with us. This includes your email address, mobile number, uploaded images with GPS data, and site descriptions.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">2. How We Use Your Information</h3>
          <p>We use the information we collect to operate and improve our platform, verify authenticity of uploads, process payments, and communicate with you about your contributions.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">3. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">4. Your Rights</h3>
          <p>You have the right to access, update, or delete your personal information. Contact us at privacy@puranveshana.com for any privacy-related requests.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">5. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at privacy@puranveshana.com</p>
        </div>
      </div>
    </div>
  );
}
