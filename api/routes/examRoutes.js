const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Public or student-accessible routes
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);

// Admin-only management routes
router.post('/', authenticate, requireAdmin, examController.createExam);
router.put('/:id', authenticate, requireAdmin, examController.updateExam);
router.delete('/:id', authenticate, requireAdmin, examController.deleteExam);

module.exports = router;
