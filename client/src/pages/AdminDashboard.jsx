import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import {
  ShieldCheck,
  BookOpen,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  BarChart3,
  Search,
  Loader2,
  FileSpreadsheet,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exams'); // 'exams' or 'submissions'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    try {
      const [statsRes, examsRes, attemptsRes] = await Promise.all([
        api.get('/stats'),
        api.get('/exams'),
        api.get('/attempts/all'),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (examsRes.success) setExams(examsRes.exams || []);
      if (attemptsRes.success) setAttempts(attemptsRes.attempts || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteExam = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the exam "${title}"?`)) return;
    try {
      const res = await api.delete(`/exams/${id}`);
      if (res.success) {
        setExams((prev) => prev.filter((e) => e._id !== id));
        fetchAdminData();
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleTogglePublish = async (exam) => {
    try {
      const res = await api.put(`/exams/${exam._id}`, {
        isPublished: !exam.isPublished,
      });
      if (res.success) {
        setExams((prev) =>
          prev.map((e) => (e._id === exam._id ? { ...e, isPublished: !e.isPublished } : e))
        );
      }
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const filteredExams = exams.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttempts = attempts.filter((a) =>
    a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.examTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Examiner & Admin Control Center
            </h1>
            <p className="text-xs text-slate-500">
              Manage assessments, create question pools, and inspect candidate performance records.
            </p>
          </div>
        </div>

        <Link
          to="/admin/exams/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md shadow-purple-200 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Exam
        </Link>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Exams
              </span>
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalExams}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Students
              </span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalStudents}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Submissions
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.totalAttempts}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pass Rate
              </span>
              <TrendingUp className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{stats.passRate}%</span>
          </div>
        </div>
      )}

      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center bg-slate-200/80 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'exams'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Exam Catalog ({exams.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'submissions'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Submissions ({attempts.length})
          </button>
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>
      </div>

      {/* Tab 1: Exam Management Table */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading exams...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No exams found. Click "Create New Exam" to author one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Exam Title</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Duration</th>
                    <th className="py-4 px-6">Questions</th>
                    <th className="py-4 px-6">Pass %</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredExams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                        {exam.title}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium">
                          {exam.category || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {exam.durationMinutes} mins
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {exam.questionCount} Qs
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {exam.passingPercentage}%
                      </td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(exam)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition ${
                            exam.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {exam.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/exams/${exam._id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="Edit Exam & Questions"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteExam(exam._id, exam.title)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Exam"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Student Submissions Table */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading submissions...</p>
            </div>
          ) : filteredAttempts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No student submissions logged yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Exam</th>
                    <th className="py-4 px-6">Score</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Time</th>
                    <th className="py-4 px-6">Integrity</th>
                    <th className="py-4 px-6">Submitted</th>
                    <th className="py-4 px-6 text-right">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAttempts.map((att) => (
                    <tr key={att._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{att.studentName}</div>
                        <div className="text-[10px] text-slate-400">{att.studentEmail}</div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {att.examTitle}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {att.percentage}% ({att.obtainedMarks}/{att.totalMarks})
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            att.isPassed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {Math.floor((att.timeTakenSeconds || 0) / 60)}m {(att.timeTakenSeconds || 0) % 60}s
                      </td>
                      <td className="py-4 px-6">
                        {att.tabSwitchCount > 0 ? (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-semibold text-[11px] flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" /> {att.tabSwitchCount} Flags
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-[11px] font-semibold">Clean</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {new Date(att.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/result/${att._id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition inline-block"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
