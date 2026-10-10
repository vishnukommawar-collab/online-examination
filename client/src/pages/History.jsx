import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import {
  History as HistoryIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  FileQuestion,
} from 'lucide-react';

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await api.get('/attempts/my');
        if (res.success) {
          setAttempts(res.attempts || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, []);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <HistoryIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Examination Records
          </h1>
          <p className="text-xs text-slate-500">
            Review previous test submissions, score cards, and performance histories.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading test history...</p>
        </div>
      ) : attempts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base mb-1">No exam records found</h3>
          <p className="text-xs text-slate-500 mb-6">
            You haven't completed any examinations yet. Head to the dashboard to take your first test.
          </p>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Browse Available Exams
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-4 px-6">Exam Name</th>
                  <th className="py-4 px-6">Date Taken</th>
                  <th className="py-4 px-6">Score</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Time Taken</th>
                  <th className="py-4 px-6">Integrity</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {attempts.map((att) => {
                  const minutes = Math.floor((att.timeTakenSeconds || 0) / 60);
                  const seconds = (att.timeTakenSeconds || 0) % 60;

                  return (
                    <tr key={att._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                        {att.examTitle}
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {new Date(att.submittedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-slate-900 text-sm">
                          {att.percentage}%
                        </span>{' '}
                        <span className="text-[11px] text-slate-400">
                          ({att.obtainedMarks}/{att.totalMarks})
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold ${
                            att.isPassed
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {att.isPassed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pass
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-rose-600" /> Fail
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{minutes}m {seconds}s</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {att.tabSwitchCount > 0 ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <ShieldAlert className="w-3 h-3" /> {att.tabSwitchCount} flags
                          </span>
                        ) : (
                          <span className="text-emerald-600 text-[11px] font-semibold">
                            Clean
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/result/${att._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                        >
                          View Report <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
