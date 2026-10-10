import React from 'react';
import { Bookmark, CheckCircle2, Circle } from 'lucide-react';

export default function QuestionPalette({
  questions,
  currentIndex,
  answers,
  flagged,
  onSelectQuestion,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-wider">
        Question Palette
      </h3>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2.5 mb-6">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
          const isFlagged = flagged[q.id] === true;

          let btnColor = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
          if (isFlagged && isAnswered) {
            btnColor = 'bg-purple-100 text-purple-700 font-semibold border-2 border-purple-400';
          } else if (isFlagged) {
            btnColor = 'bg-amber-100 text-amber-800 font-semibold border border-amber-300';
          } else if (isAnswered) {
            btnColor = 'bg-emerald-500 text-white font-semibold shadow-sm shadow-emerald-200';
          }

          return (
            <button
              key={q.id || idx}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl font-medium text-sm flex items-center justify-center transition-all ${btnColor} ${
                isCurrent ? 'ring-2 ring-offset-2 ring-indigo-600 font-bold scale-105 z-10' : ''
              }`}
            >
              {idx + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-100 border border-purple-400 text-purple-700 flex items-center justify-center text-[10px]">★</div>
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">○</div>
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white border-2 border-indigo-600 text-[10px]" />
          <span>Current Active Question</span>
        </div>
      </div>
    </div>
  );
}
