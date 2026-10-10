import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import Timer from '../components/Timer';
import QuestionPalette from '../components/QuestionPalette';
import CheatingWarningModal from '../components/CheatingWarningModal';
import ConfirmSubmitModal from '../components/ConfirmSubmitModal';
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Loader2,
  RotateCcw,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startTimeRef = useRef(Date.now());
  const timerExpiredRef = useRef(false);

  // Fetch Exam Data
  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await api.get(`/exams/${id}?shuffle=true`);
        if (res.success && res.exam) {
          setExam(res.exam);
        } else {
          setError(res.message || 'Failed to load exam');
        }
      } catch (err) {
        setError(err.message || 'Error fetching exam');
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [id]);

  // Anti-cheating listeners (tab switch, visibility, blur)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !timerExpiredRef.current && !isSubmitting) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setShowWarningModal(true);
          return next;
        });
      }
    };

    const handleBlur = () => {
      if (!timerExpiredRef.current && !isSubmitting) {
        setTabSwitchCount((prev) => {
          const next = prev + 1;
          setShowWarningModal(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isSubmitting]);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Option selection handler
  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Clear current question selection
  const handleClearChoice = (questionId) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Toggle mark for review
  const handleToggleFlag = (questionId) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Final submit handler
  const handleSubmit = async (forcedByTimer = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    if (forcedByTimer) {
      timerExpiredRef.current = true;
    }

    const timeTakenSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const payload = {
        examId: id,
        answers,
        timeTakenSeconds,
        tabSwitchCount,
      };

      const res = await api.post('/attempts/submit', payload);
      if (res.success && res.attempt) {
        navigate(`/result/${res.attempt._id}`, {
          state: { attemptResult: res.attempt },
          replace: true,
        });
      } else {
        alert(res.message || 'Submission failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      alert(`Submission error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-sm text-slate-600 font-medium">Securing and preparing exam session...</p>
      </div>
    );
  }

  if (error || !exam || !exam.questions || exam.questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-rose-200 rounded-3xl text-center shadow-lg">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Unable to Load Exam</h3>
        <p className="text-xs text-slate-500 mb-6">{error || 'This exam has no questions available.'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const questions = exam.questions;
  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none">
      {/* Proctoring Header Bar */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base leading-tight">
                {exam.title}
              </h1>
              <div className="text-[11px] text-slate-400">
                Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switch strike counter */}
            {tabSwitchCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{tabSwitchCount} Strikes</span>
              </div>
            )}

            {/* Visual Countdown Timer */}
            <Timer
              initialSeconds={exam.durationMinutes * 60}
              onExpire={() => handleSubmit(true)}
            />

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Examination View */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Side: Active Question Display */}
        <main className="flex-1 flex flex-col justify-between bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div>
            {/* Question Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
                  Question {currentIndex + 1}
                </span>
                <span className="text-xs text-slate-400">
                  ({currentQ.marks || 1} {currentQ.marks === 1 ? 'Mark' : 'Marks'})
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  flagged[currentQ.id]
                    ? 'bg-purple-100 text-purple-700 border border-purple-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {flagged[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed mb-6">
              {currentQ.questionText}
            </h2>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {(currentQ.options || []).map((option, optIdx) => {
                const isSelected = answers[currentQ.id] === option;
                const letter = String.fromCharCode(65 + optIdx);

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, option)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {letter}
                    </div>
                    <span className="text-sm font-medium text-slate-800 leading-snug">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {answers[currentQ.id] !== undefined && (
                <button
                  type="button"
                  onClick={() => handleClearChoice(currentQ.id)}
                  className="py-2.5 px-3 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Choice
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isLastQuestion ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-200 transition"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-200 transition"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Exam
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Right Side: Question Matrix & Actions */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            flagged={flagged}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish & Submit Examination
          </button>
        </aside>
      </div>

      {/* Cheating Warning Modal */}
      <CheatingWarningModal
        isOpen={showWarningModal}
        strikeCount={tabSwitchCount}
        onClose={() => setShowWarningModal(false)}
      />

      {/* Confirm Submission Modal */}
      <ConfirmSubmitModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => handleSubmit(false)}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
