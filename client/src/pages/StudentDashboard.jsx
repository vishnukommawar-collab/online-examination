import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  GraduationCap,
  Clock,
  HelpCircle,
  Award,
  Search,
  Filter,
  Play,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  X,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExamForModal, setSelectedExamForModal] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [examsRes, attemptsRes] = await Promise.all([
          api.get('/exams'),
          api.get('/attempts/my'),
        ]);

        if (examsRes.success) setExams(examsRes.exams || []);
        if (attemptsRes.success) setAttempts(attemptsRes.attempts || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categories = ['All', ...new Set(exams.map((e) => e.category).filter(Boolean))];

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || exam.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate student statistics
  const completedCount = attempts.length;
  const avgScore =
    completedCount > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) /
            completedCount
        )
      : 0;
  const passedCount = attempts.filter((a) => a.isPassed).length;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Candidate Assessment Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-2 text-indigo-100/90 text-sm leading-relaxed">
            Select an exam below to begin your proctored assessment. Make sure you are in a quiet environment before initiating the test.
          </p>
        </div>

        {/* Quick Stats Banner inside header */}
        <div className="mt-6 pt-6 border-t border-indigo-700/50 grid grid-cols-3 gap-4 max-w-xl">
          <div>
            <span className="text-2xl font-bold tracking-tight">{exams.length}</span>
            <div className="text-xs text-indigo-200 font-medium mt-0.5">Available Exams</div>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight">{completedCount}</span>
            <div className="text-xs text-indigo-200 font-medium mt-0.5">Completed</div>
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-emerald-400">
              {completedCount > 0 ? `${avgScore}%` : 'N/A'}
            </span>
            <div className="text-xs text-indigo-200 font-medium mt-0.5">Average Score</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exams by title or topic..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading available examinations...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No examinations found</h3>
          <p className="text-xs text-slate-500">
            No exams matching your search criteria or category filter were found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const hasAttempted = attempts.some((a) => a.examId === exam._id);

            return (
              <div
                key={exam._id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-100 uppercase tracking-wide">
                      {exam.category || 'General'}
                    </span>
                    {hasAttempted && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Attempted
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-indigo-600 transition">
                    {exam.title}
                  </h3>

                  <p className="text-slate-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {exam.description || 'Comprehensive evaluation covering key competencies.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 mb-5">
                    <div className="bg-slate-50 py-2 rounded-xl">
                      <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />
                      <span className="font-bold text-slate-800">{exam.durationMinutes}</span>
                      <span className="block text-[10px] text-slate-400">mins</span>
                    </div>
                    <div className="bg-slate-50 py-2 rounded-xl">
                      <HelpCircle className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />
                      <span className="font-bold text-slate-800">{exam.questionCount}</span>
                      <span className="block text-[10px] text-slate-400">questions</span>
                    </div>
                    <div className="bg-slate-50 py-2 rounded-xl">
                      <Award className="w-3.5 h-3.5 mx-auto mb-1 text-slate-500" />
                      <span className="font-bold text-slate-800">{exam.passingPercentage}%</span>
                      <span className="block text-[10px] text-slate-400">passing</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedExamForModal(exam)}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs shadow-sm shadow-indigo-200 transition flex items-center justify-center gap-2 group-hover:shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {hasAttempted ? 'Retake Examination' : 'Start Examination'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Rules & Launch Modal */}
      {selectedExamForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Examination Instructions
                  </h3>
                  <span className="text-xs text-indigo-600 font-semibold">
                    {selectedExamForModal.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedExamForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Time Limit: </strong>
                  You have exactly <strong>{selectedExamForModal.durationMinutes} minutes</strong>. The exam will automatically submit when the timer expires.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950">Anti-Cheating Policy: </strong>
                  Do not switch browser tabs or minimize your window. All lost-focus events and tab switches are logged and audited.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                <Award className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Scoring & Passing: </strong>
                  You must score at least <strong>{selectedExamForModal.passingPercentage}%</strong> to earn a passing grade. Immediate question explanations will be available post-submission.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedExamForModal(null)}
                className="flex-1 py-2.5 px-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const examId = selectedExamForModal._id;
                  setSelectedExamForModal(null);
                  navigate(`/exam/${examId}/take`);
                }}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-200 text-xs flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                I Understand, Start Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
