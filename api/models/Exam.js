const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  type: { type: String, enum: ['single', 'boolean', 'multiple'], default: 'single' },
  options: [{ type: String, required: true }],
  correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  marks: { type: Number, default: 1 },
  explanation: { type: String, default: '' },
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide exam title'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  durationMinutes: {
    type: Number,
    required: [true, 'Duration in minutes is required'],
    min: 1,
  },
  passingPercentage: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  shuffleQuestions: {
    type: Boolean,
    default: false,
  },
  questions: [questionSchema],
  createdBy: {
    type: String,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Exam || mongoose.model('Exam', examSchema);
