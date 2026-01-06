"use client";

import { X, Mail, Phone, MapPin } from 'lucide-react';

interface ContactUsModalProps {
  show: boolean;
  onClose: () => void;
}

export default function ContactUsModal({ show, onClose }: ContactUsModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Contact Us</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Email</h3>
              <a href="mailto:support@puranveshana.com" className="text-orange-600 hover:text-orange-700">support@puranveshana.com</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
              <a href="tel:+911234567890" className="text-orange-600 hover:text-orange-700">+91 123 456 7890</a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Address</h3>
              <p className="text-slate-600 text-sm">Heritage Preservation Society<br />New Delhi, India</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-slate-700">
              <strong className="text-orange-700">Support Hours:</strong><br />
              Monday - Friday: 9:00 AM - 6:00 PM IST<br />
              Response time: Within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
