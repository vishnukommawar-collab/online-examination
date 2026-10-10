const { examService } = require('../services/db');

exports.getExams = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const exams = isAdmin ? await examService.getAll() : await examService.getPublished();

    // Map light overview
    const overview = exams.map(e => ({
      _id: e._id,
      title: e.title,
      description: e.description,
      category: e.category,
      durationMinutes: e.durationMinutes,
      passingPercentage: e.passingPercentage,
      isPublished: e.isPublished,
      questionCount: e.questions ? e.questions.length : 0,
      totalMarks: e.questions ? e.questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0) : 0,
      createdAt: e.createdAt,
    }));

    return res.json({ success: true, exams: overview });
  } catch (error) {
    console.error('getExams error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    
    // Include answers only if requester is admin
    const exam = await examService.findById(id, isAdmin);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    if (!isAdmin && !exam.isPublished) {
      return res.status(403).json({ success: false, message: 'This exam is currently not published.' });
    }

    // Shuffle questions if configured and requested for taking
    if (exam.shuffleQuestions && !isAdmin && req.query.shuffle === 'true') {
      exam.questions = [...exam.questions].sort(() => Math.random() - 0.5);
    }

    return res.json({ success: true, exam });
  } catch (error) {
    console.error('getExamById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExam = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      durationMinutes,
      passingPercentage,
      isPublished,
      shuffleQuestions,
      questions,
    } = req.body;

    if (!title || !durationMinutes) {
      return res.status(400).json({ success: false, message: 'Title and duration are required.' });
    }

    // Sanitize questions
    const formattedQuestions = (questions || []).map((q, idx) => ({
      id: q.id || `q_${Date.now()}_${idx}`,
      questionText: q.questionText,
      type: q.type || 'single',
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      marks: Number(q.marks) || 1,
      explanation: q.explanation || '',
    }));

    const newExam = await examService.create({
      title,
      description: description || '',
      category: category || 'General',
      durationMinutes: Number(durationMinutes),
      passingPercentage: Number(passingPercentage) || 50,
      isPublished: isPublished !== false,
      shuffleQuestions: Boolean(shuffleQuestions),
      questions: formattedQuestions,
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, exam: newExam, message: 'Exam created successfully' });
  } catch (error) {
    console.error('createExam error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      durationMinutes,
      passingPercentage,
      isPublished,
      shuffleQuestions,
      questions,
    } = req.body;

    const existing = await examService.findById(id, true);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (category !== undefined) updatePayload.category = category;
    if (durationMinutes !== undefined) updatePayload.durationMinutes = Number(durationMinutes);
    if (passingPercentage !== undefined) updatePayload.passingPercentage = Number(passingPercentage);
    if (isPublished !== undefined) updatePayload.isPublished = Boolean(isPublished);
    if (shuffleQuestions !== undefined) updatePayload.shuffleQuestions = Boolean(shuffleQuestions);
    
    if (questions) {
      updatePayload.questions = questions.map((q, idx) => ({
        id: q.id || `q_${Date.now()}_${idx}`,
        questionText: q.questionText,
        type: q.type || 'single',
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        marks: Number(q.marks) || 1,
        explanation: q.explanation || '',
      }));
    }

    const updated = await examService.update(id, updatePayload);
    return res.json({ success: true, exam: updated, message: 'Exam updated successfully' });
  } catch (error) {
    console.error('updateExam error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await examService.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    return res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('deleteExam error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
