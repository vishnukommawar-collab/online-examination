import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TakeExam from './pages/TakeExam';
import ExamResult from './pages/ExamResult';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import CreateExam from './pages/CreateExam';
import EditExam from './pages/EditExam';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:id/take"
          element={
            <ProtectedRoute>
              <TakeExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:attemptId"
          element={
            <ProtectedRoute>
              <ExamResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

        {/* Examiner / Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams/:id/edit"
          element={
            <ProtectedRoute adminOnly>
              <EditExam />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
