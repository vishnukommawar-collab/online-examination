const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/submit', authenticate, attemptController.submitExam);
router.get('/my', authenticate, attemptController.getMyAttempts);
router.get('/all', authenticate, requireAdmin, attemptController.getAllAttempts);
router.get('/:id', authenticate, attemptController.getAttemptById);

module.exports = router;
