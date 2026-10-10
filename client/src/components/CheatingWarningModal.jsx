import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function CheatingWarningModal({ strikeCount, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-300 text-center animate-in fade-in zoom-in-95 duration-150">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-rose-50">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Security Alert: Focus Lost!
        </h3>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-semibold rounded-full border border-rose-200 mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          Proctor Strike Counter: {strikeCount}
        </div>

        <p className="text-sm text-slate-600 mb-6">
          You navigated away from the exam tab or minimized the browser window. All tab switches and focus losses are automatically logged with your submission and visible to your proctor.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition shadow-md shadow-rose-200"
        >
          I Understand, Return to Exam
        </button>
      </div>
    </div>
  );
}
