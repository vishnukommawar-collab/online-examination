import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  ShieldCheck,
  Zap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Server,
  Eye,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = async (role) => {
    try {
      await demoLogin(role);
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Full-Stack MERN • Production Ready on Vercel</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Enterprise Online Examination{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Engineered for Integrity
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
              Create, administer, and take proctored online examinations with real-time timers, browser focus anti-cheating tracking, automated grading, and comprehensive performance analytics.
            </p>

            {/* Quick Actions */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center gap-2"
                  >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/login"
                    className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base transition-all shadow-sm"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Instant Demo Sandbox Access */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 inline-flex flex-col sm:flex-row items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1-Click Instant Demo:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDemo('student')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition shadow-sm flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  Try as Student (Alex)
                </button>
                <button
                  onClick={() => handleDemo('admin')}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition shadow-sm flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Try as Admin / Examiner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Engineered with Modern MERN Architecture
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Zero-config deployment on Vercel Serverless Functions with MongoDB Atlas support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Timed Proctored Testing
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Precise countdown timer with visual urgency alerts, auto-submission upon expiration, and interactive question status navigation palette.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Anti-Cheat Focus Tracking
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitors browser focus, tab switches, and fullscreen integrity strikes. Warnings are logged directly onto candidate submissions.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Instant Grading & Analytics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automated score computation, Pass/Fail thresholds, celebratory feedback, and detailed question-by-question answer explanations.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Vercel Serverless Ready
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Optimized Express backend seamlessly exported for Vercel Serverless Functions with zero extra server maintenance required.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-5">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                MongoDB Atlas + Turnkey Mode
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connects to MongoDB Atlas via Mongoose with auto-fallback in-memory store so it runs instantly without database setup.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Full Examiner Admin Suite
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create dynamic exams, configure multiple choice questions, set custom pass rates, toggle draft/published, and monitor candidate records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Banner */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
            Full-Stack Technology Stack (MERN)
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> MongoDB & Mongoose
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Express.js REST API
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> React 18 & Vite
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Node.js Runtime
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Tailwind CSS
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span> Vercel Cloud Platform
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
