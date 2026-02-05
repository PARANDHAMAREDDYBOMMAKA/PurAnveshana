"use client";

import { X } from 'lucide-react';

interface GuidelinesModalProps {
  show: boolean;
  onClose: () => void;
}

export default function GuidelinesModal({ show, onClose }: GuidelinesModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Contribution Guidelines</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="prose prose-sm sm:prose max-w-none text-slate-700 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">What to Upload</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ancient temples, ruins, and historical structures</li>
            <li>Rock art, cave paintings, and inscriptions</li>
            <li>Forgotten monuments and archaeological sites</li>
            <li>Traditional architecture and heritage buildings</li>
            <li>Historical landmarks not widely documented</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Photography Guidelines</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep GPS location ON while capturing photos</li>
            <li>Take multiple angles of the site (5+ photos recommended)</li>
            <li>Ensure good lighting and clear visibility</li>
            <li>Include context shots showing surroundings</li>
            <li>Use high resolution (minimum 1920x1080)</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-6">Description Best Practices</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide exact location details</li>
            <li>Include historical context if known</li>
            <li>Mention local legends or stories</li>
            <li>Describe the current condition</li>
            <li>Note any unique architectural features</li>
          </ul>

          <h3 className="text-lg font-bold text-slate-900 mt-6">What NOT to Upload</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Images downloaded from internet</li>
            <li>AI-generated or manipulated photos</li>
            <li>Copyrighted content</li>
            <li>Modern buildings or recent constructions</li>
            <li>Sites already well-documented online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
