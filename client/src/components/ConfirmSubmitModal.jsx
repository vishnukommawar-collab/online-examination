import React from 'react';
import { AlertCircle, CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';

export default function ConfirmSubmitModal({
  isOpen,
  onClose,
  onConfirm,
  totalQuestions,
  answeredCount,
  flaggedCount,
  isSubmitting,
}) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit Examination?
            </h3>
            <p className="text-xs text-slate-500">
              Please review your summary before final submission.
            </p>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-3 gap-3 my-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-emerald-700">{answeredCount}</span>
            <div className="text-[11px] font-medium text-emerald-800 flex items-center justify-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> Answered
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-purple-700">{flaggedCount}</span>
            <div className="text-[11px] font-medium text-purple-800 flex items-center justify-center gap-1 mt-1">
              <Bookmark className="w-3 h-3" /> For Review
            </div>
          </div>

          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-2xl font-bold text-slate-700">{unansweredCount}</span>
            <div className="text-[11px] font-medium text-slate-600 flex items-center justify-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Unanswered
            </div>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl p-3 mb-5 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              You still have <strong>{unansweredCount}</strong> unanswered question{unansweredCount > 1 ? 's' : ''}. Unanswered questions will receive 0 marks.
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition text-sm disabled:opacity-50"
          >
            Review Questions
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-200 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Evaluating...' : 'Yes, Submit Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
