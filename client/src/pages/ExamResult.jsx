import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Printer,
  ArrowLeft,
  Loader2,
  AlertCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export default function ExamResult() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(location.state?.attemptResult || null);
  const [loading, setLoading] = useState(!attempt);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAttempt() {
      if (attempt) {
        if (attempt.isPassed) triggerCelebration();
        return;
      }

      try {
        const res = await api.get(`/attempts/${attemptId}`);
        if (res.success && res.attempt) {
          setAttempt(res.attempt);
          if (res.attempt.isPassed) triggerCelebration();
        } else {
          setError(res.message || 'Attempt not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load attempt result');
      } finally {
        setLoading(false);
      }
    }

    fetchAttempt();
  }, [attemptId]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // non-blocking
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Generating score assessment report...</p>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-200 rounded-3xl text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Result Not Found</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'Unable to retrieve this examination submission.'}</p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const {
    examTitle,
    studentName,
    percentage,
    isPassed,
    obtainedMarks,
    totalMarks,
    correctCount,
    totalQuestions,
    answeredCount,
    timeTakenSeconds,
    tabSwitchCount,
    questionResults = [],
    examPassingPercentage = 50,
  } = attempt;

  const minutesTaken = Math.floor(timeTakenSeconds / 60);
  const secondsRemainder = timeTakenSeconds % 60;
  const incorrectCount = (answeredCount || 0) - (correctCount || 0);
  const unattemptedCount = totalQuestions - (answeredCount || 0);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div
        className={`rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden ${
          isPassed
            ? 'bg-gradient-to-tr from-emerald-900 via-teal-800 to-slate-900'
            : 'bg-gradient-to-tr from-rose-950 via-slate-900 to-slate-900'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}
            >
              {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
              {isPassed ? 'Examination Passed' : 'Did Not Meet Passing Criteria'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {examTitle}
            </h1>
            <p className="mt-1 text-slate-300 text-xs">
              Candidate: <span className="font-semibold text-white">{studentName}</span> • Pass Threshold: {examPassingPercentage}%
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md px-8 py-5 rounded-2xl border border-white/20 text-center min-w-[180px]">
            <span className="text-4xl sm:text-5xl font-black tracking-tight">
              {percentage}%
            </span>
            <span className="text-xs font-medium text-slate-200 mt-1">
              {obtainedMarks} / {totalMarks} Marks Scored
            </span>
          </div>
        </div>

        {/* Quick Breakdown Ribbon */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-black/20 p-3 rounded-xl text-center">
            <span className="text-xl font-bold text-emerald-400">{correctCount}</span>
            <div className="text-[11px] text-slate-300 mt-0.5">Correct Answers</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl text-center">
            <span className="text-xl font-bold text-rose-400">{incorrectCount}</span>
            <div className="text-[11px] text-slate-300 mt-0.5">Incorrect Answers</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl text-center">
            <span className="text-xl font-bold text-amber-300">
              {minutesTaken}m {secondsRemainder}s
            </span>
            <div className="text-[11px] text-slate-300 mt-0.5">Time Taken</div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl text-center">
            <span
              className={`text-xl font-bold ${
                tabSwitchCount > 0 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {tabSwitchCount === 0 ? '0 (Clean)' : `${tabSwitchCount} Detected`}
            </span>
            <div className="text-[11px] text-slate-300 mt-0.5">Focus Proctoring</div>
          </div>
        </div>
      </div>

      {/* Question by Question Detailed Review */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-lg">
              Detailed Question Analysis & Explanations
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {questionResults.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-6">
          {questionResults.map((item, idx) => {
            const isCorrect = item.isCorrect;
            const notAnswered = item.studentAnswer === null || item.studentAnswer === undefined;

            return (
              <div
                key={item.id || idx}
                className={`p-5 rounded-2xl border transition-all ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : notAnswered
                    ? 'border-slate-200 bg-slate-50/40'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Question title & status badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {item.marks} {item.marks === 1 ? 'Mark' : 'Marks'}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : notAnswered
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+{item.obtainedMarks})
                      </>
                    ) : notAnswered ? (
                      <>
                        <HelpCircle className="w-3.5 h-3.5" /> Skipped (0)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                      </>
                    )}
                  </span>
                </div>

                {/* Prompt */}
                <p className="font-semibold text-slate-900 text-sm mb-4 leading-relaxed">
                  {item.questionText}
                </p>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-medium uppercase text-[10px] mb-1">
                      Your Answer:
                    </span>
                    <span
                      className={`font-semibold ${
                        isCorrect
                          ? 'text-emerald-700'
                          : notAnswered
                          ? 'text-slate-400 italic'
                          : 'text-rose-600 line-through'
                      }`}
                    >
                      {item.studentAnswer || 'Not Answered'}
                    </span>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                    <span className="text-emerald-800 block font-medium uppercase text-[10px] mb-1">
                      Correct Answer:
                    </span>
                    <span className="font-bold text-emerald-900">
                      {Array.isArray(item.correctAnswer)
                        ? item.correctAnswer.join(', ')
                        : String(item.correctAnswer)}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <div className="bg-slate-100/80 p-3 rounded-xl text-xs text-slate-700 mt-2">
                    <strong className="text-slate-900 font-semibold">Explanation: </strong>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
