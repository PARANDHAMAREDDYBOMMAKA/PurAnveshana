"use client";

import { X } from 'lucide-react';

interface AccessibilityModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AccessibilityModal({ show, onClose }: AccessibilityModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Accessibility Statement</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
          <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Our Commitment</h3>
          <p>PurAnveshana is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Conformance Status</h3>
          <p>We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Accessibility Features</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keyboard navigation support</li>
            <li>Screen reader compatible</li>
            <li>Clear and consistent navigation</li>
            <li>Alternative text for images</li>
            <li>Responsive design for various devices</li>
            <li>High contrast color scheme options</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Feedback</h3>
          <p>We welcome your feedback on the accessibility of PurAnveshana. Please contact us if you encounter accessibility barriers:</p>
          <p>Email: <a href="mailto:accessibility@puranveshana.com" className="text-orange-600">accessibility@puranveshana.com</a></p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Technical Specifications</h3>
          <p>PurAnveshana relies on the following technologies to work with web browsers and assistive technologies:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript</li>
            <li>WAI-ARIA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
