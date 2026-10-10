const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, attemptController.getStats);

module.exports = router;
