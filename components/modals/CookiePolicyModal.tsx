"use client";

import { X } from 'lucide-react';

interface CookiePolicyModalProps {
  show: boolean;
  onClose: () => void;
}

export default function CookiePolicyModal({ show, onClose }: CookiePolicyModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Cookie Policy</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
          <p className="text-sm text-slate-500">Last updated: November 6, 2025</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">What Are Cookies</h3>
          <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">How We Use Cookies</h3>
          <p>We use cookies for the following purposes:</p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-slate-200 rounded-lg mt-4">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Cookie Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">Essential</td>
                  <td className="px-4 py-3 text-sm text-slate-700">Required for authentication and basic site functionality</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">Functional</td>
                  <td className="px-4 py-3 text-sm text-slate-700">Remember your preferences and settings</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">Analytics</td>
                  <td className="px-4 py-3 text-sm text-slate-700">Help us understand how you use the platform</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">Performance</td>
                  <td className="px-4 py-3 text-sm text-slate-700">Improve site speed and user experience</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Managing Cookies</h3>
          <p>You can control and manage cookies in your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Third-Party Cookies</h3>
          <p>We may use third-party services that also set cookies on your device. These include analytics providers and authentication services. These third parties have their own privacy policies.</p>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Contact Us</h3>
          <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@puranveshana.com" className="text-orange-600">privacy@puranveshana.com</a></p>
        </div>
      </div>
    </div>
  );
}
