import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import {
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  Save,
} from 'lucide-react';

export default function CreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [passingPercentage, setPassingPercentage] = useState(60);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const [questions, setQuestions] = useState([
    {
      id: 'q_' + Date.now() + '_0',
      questionText: 'What is the primary function of the virtual DOM in React?',
      type: 'single',
      options: [
        'To directly modify browser memory addresses',
        'To optimize performance by computing minimal real DOM updates',
        'To compile JSX into assembly instructions',
        'To store persistent server-side database records',
      ],
      correctAnswer: 'To optimize performance by computing minimal real DOM updates',
      marks: 5,
      explanation: 'Virtual DOM enables React to diff component trees in memory before batching updates to the actual browser DOM.',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add blank question
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: 'q_' + Date.now() + '_' + prev.length,
        questionText: '',
        type: 'single',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        marks: 5,
        explanation: '',
      },
    ]);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      alert('An exam must contain at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update question field
  const handleUpdateQuestion = (idx, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Update specific option text
  const handleUpdateOption = (qIdx, optIdx, text) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const oldOpt = copy[qIdx].options[optIdx];
      const newOptions = [...copy[qIdx].options];
      newOptions[optIdx] = text;
      copy[qIdx].options = newOptions;

      // If this option was selected as the correct answer, update the correct answer reference too
      if (copy[qIdx].correctAnswer === oldOpt) {
        copy[qIdx].correctAnswer = text;
      }
      return copy;
    });
  };

  // Add option to question
  const handleAddOption = (qIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options = [...copy[qIdx].options, `Option ${copy[qIdx].options.length + 1}`];
      return copy;
    });
  };

  // Remove option from question
  const handleRemoveOption = (qIdx, optIdx) => {
    setQuestions((prev) => {
      const copy = [...prev];
      if (copy[qIdx].options.length <= 2) {
        alert('Each question must have at least 2 options.');
        return copy;
      }
      const removedOpt = copy[qIdx].options[optIdx];
      copy[qIdx].options = copy[qIdx].options.filter((_, i) => i !== optIdx);
      if (copy[qIdx].correctAnswer === removedOpt) {
        copy[qIdx].correctAnswer = copy[qIdx].options[0] || '';
      }
      return copy;
    });
  };

  // Preload Quick Template
  const handleLoadSampleTemplate = () => {
    setTitle('Full-Stack Web Engineering Assessment');
    setDescription('Comprehensive evaluation testing React hooks, Express routing, and MongoDB document database design.');
    setCategory('Web Development');
    setDurationMinutes(20);
    setPassingPercentage(70);
    setQuestions([
      {
        id: 'q_t1',
        questionText: 'Which React hook should be used to memoize expensive calculation results between renders?',
        type: 'single',
        options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
        correctAnswer: 'useMemo',
        marks: 5,
        explanation: 'useMemo returns a memoized value, recalculating only when dependencies change.',
      },
      {
        id: 'q_t2',
        questionText: 'In Express.js, what does the middleware signature (err, req, res, next) indicate?',
        type: 'single',
        options: [
          'An error handling middleware function',
          'A websocket upgrade listener',
          'A clustering worker process',
          'A database transaction interceptor',
        ],
        correctAnswer: 'An error handling middleware function',
        marks: 5,
        explanation: 'Express recognizes functions with 4 parameters specifically as error handlers.',
      },
      {
        id: 'q_t3',
        questionText: 'True or False: In MongoDB, documents in the same collection must adhere to identical schemas.',
        type: 'boolean',
        options: ['True', 'False'],
        correctAnswer: 'False',
        marks: 5,
        explanation: 'MongoDB is schema-flexible; documents in a single collection can have different sets of fields.',
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Exam title is required.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].questionText.trim()) {
        setError(`Question #${i + 1} is missing question prompt text.`);
        return;
      }
      if (!questions[i].correctAnswer) {
        setError(`Question #${i + 1} has no correct answer selected.`);
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        category,
        durationMinutes: Number(durationMinutes),
        passingPercentage: Number(passingPercentage),
        shuffleQuestions,
        isPublished,
        questions,
      };

      const res = await api.post('/exams', payload);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Failed to create exam');
      }
    } catch (err) {
      setError(err.message || 'Error creating exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 mb-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create New Examination
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleTemplate}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          Load Sample Questions Template
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 text-xs font-medium mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Exam Metadata Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" /> Exam Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Exam Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced React & Node.js Certification"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Instructions
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of exam syllabus and criteria..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Computer Science, DevOps, Mathematics"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min={1}
                max={300}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              />
            </div>

            <div className="flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                Shuffle Questions for Candidates
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
                Publish Immediately
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Questions Builder */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600" />
              Examination Questions ({questions.length})
            </h2>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
                  Question #{qIdx + 1}
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                    <span>Marks:</span>
                    <input
                      type="number"
                      min={1}
                      value={q.marks || 5}
                      onChange={(e) =>
                        handleUpdateQuestion(qIdx, 'marks', Number(e.target.value))
                      }
                      className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIdx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Question Prompt Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestion(qIdx, 'questionText', e.target.value)}
                  placeholder="Enter the question statement..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Options & Correct Answer Selection:
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddOption(qIdx)}
                    className="text-xs text-purple-600 font-bold hover:underline"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = q.correctAnswer === opt;

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition ${
                          isSelected
                            ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={isSelected}
                          onChange={() => handleUpdateQuestion(qIdx, 'correctAnswer', opt)}
                          title="Select as correct answer"
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-2"
                        />

                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                          className="flex-1 px-3 py-1.5 bg-transparent text-xs font-medium focus:outline-none"
                        />

                        {isSelected && (
                          <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100">
                            Correct Answer
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveOption(qIdx, optIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded mr-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Explanation (shown to student after submission)
                </label>
                <input
                  type="text"
                  value={q.explanation || ''}
                  onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                  placeholder="Why is this answer correct? Helpful for candidate review..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Card */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin"
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Publishing Exam...' : 'Save & Publish Exam'}
          </button>
        </div>
      </form>
    </div>
  );
}
