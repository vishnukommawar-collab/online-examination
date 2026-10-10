import React from 'react';
import { GraduationCap, Heart, CheckCircle2, Cloud } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-800 text-sm">ExamSphere</span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs text-slate-500">MERN Online Examination Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Vercel Ready
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
              <Cloud className="w-3.5 h-3.5" />
              MongoDB Atlas Support
            </span>
            <span>Anti-Cheat Monitored</span>
          </div>

          <div className="text-xs text-slate-400">
            Built with React, Express, MongoDB & Node.js
          </div>
        </div>
      </div>
    </footer>
  );
}
