const { examService, attemptService } = require('../services/db');

exports.submitExam = async (req, res) => {
  try {
    const { examId, answers = {}, timeTakenSeconds = 0, tabSwitchCount = 0 } = req.body;

    if (!examId) {
      return res.status(400).json({ success: false, message: 'examId is required' });
    }

    // Retrieve full exam including correct answers
    const exam = await examService.findById(examId, true);
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    const questions = exam.questions || [];
    let totalMarks = 0;
    let obtainedMarks = 0;
    let correctCount = 0;
    let answeredCount = 0;

    const questionResults = questions.map(q => {
      const qMarks = Number(q.marks) || 1;
      totalMarks += qMarks;

      const studentAns = answers[q.id];
      const hasAnswered = studentAns !== undefined && studentAns !== null && studentAns !== '';
      if (hasAnswered) {
        answeredCount++;
      }

      // Check correctness
      let isCorrect = false;
      if (hasAnswered) {
        if (Array.isArray(q.correctAnswer) && Array.isArray(studentAns)) {
          isCorrect = q.correctAnswer.length === studentAns.length &&
            q.correctAnswer.every(val => studentAns.includes(val));
        } else {
          isCorrect = String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
        }
      }

      if (isCorrect) {
        correctCount++;
        obtainedMarks += qMarks;
      }

      return {
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        options: q.options,
        studentAnswer: studentAns || null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marks: qMarks,
        obtainedMarks: isCorrect ? qMarks : 0,
        explanation: q.explanation || '',
      };
    });

    const totalQuestions = questions.length;
    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 1000) / 10 : 0;
    const isPassed = percentage >= (exam.passingPercentage || 50);

    const attempt = await attemptService.create({
      examId: exam._id,
      examTitle: exam.title,
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      totalQuestions,
      answeredCount,
      correctCount,
      totalMarks,
      obtainedMarks,
      percentage,
      isPassed,
      timeTakenSeconds: Math.max(0, Number(timeTakenSeconds)),
      tabSwitchCount: Math.max(0, Number(tabSwitchCount)),
      answers,
    });

    return res.status(201).json({
      success: true,
      message: 'Exam submitted successfully',
      attempt: {
        ...attempt,
        questionResults,
        examPassingPercentage: exam.passingPercentage,
      },
    });
  } catch (error) {
    console.error('submitExam error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAttemptById = async (req, res) => {
  try {
    const { id } = req.params;
    const attempt = await attemptService.findById(id);

    if (!attempt) {
      return res.status(404).json({ success: false, message: 'Attempt record not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isOwner = attempt.studentId.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this attempt' });
    }

    // Enrich with question details
    const exam = await examService.findById(attempt.examId, true);
    let questionResults = [];

    if (exam && exam.questions) {
      const answersMap = attempt.answers instanceof Map 
        ? Object.fromEntries(attempt.answers) 
        : (attempt.answers || {});

      questionResults = exam.questions.map(q => {
        const studentAns = answersMap[q.id];
        let isCorrect = false;
        if (studentAns !== undefined && studentAns !== null && studentAns !== '') {
          if (Array.isArray(q.correctAnswer) && Array.isArray(studentAns)) {
            isCorrect = q.correctAnswer.length === studentAns.length &&
              q.correctAnswer.every(val => studentAns.includes(val));
          } else {
            isCorrect = String(studentAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
          }
        }

        const qMarks = Number(q.marks) || 1;
        return {
          id: q.id,
          questionText: q.questionText,
          type: q.type,
          options: q.options,
          studentAnswer: studentAns || null,
          correctAnswer: q.correctAnswer,
          isCorrect,
          marks: qMarks,
          obtainedMarks: isCorrect ? qMarks : 0,
          explanation: q.explanation || '',
        };
      });
    }

    return res.json({
      success: true,
      attempt: {
        ...(attempt.toObject ? attempt.toObject() : attempt),
        questionResults,
        examPassingPercentage: exam ? exam.passingPercentage : 50,
      },
    });
  } catch (error) {
    console.error('getAttemptById error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await attemptService.findByStudent(req.user._id);
    return res.json({ success: true, attempts });
  } catch (error) {
    console.error('getMyAttempts error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAttempts = async (req, res) => {
  try {
    const attempts = await attemptService.getAll();
    return res.json({ success: true, attempts });
  } catch (error) {
    console.error('getAllAttempts error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await attemptService.getStats();
    return res.json({ success: true, stats });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
