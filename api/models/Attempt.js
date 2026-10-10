const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true,
    ref: 'Exam',
  },
  examTitle: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    ref: 'User',
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  answeredCount: {
    type: Number,
    default: 0,
  },
  correctCount: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  isPassed: {
    type: Boolean,
    required: true,
  },
  timeTakenSeconds: {
    type: Number,
    default: 0,
  },
  tabSwitchCount: {
    type: Number,
    default: 0,
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
