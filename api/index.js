const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { connectDB } = require('./services/db');

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'ExamSphere API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: process.env.MONGODB_URI ? 'MongoDB Atlas' : 'In-Memory Store (Turnkey Ready)',
  });
});

// Setup API Router
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/exams', examRoutes);
apiRouter.use('/attempts', attemptRoutes);
apiRouter.use('/stats', statsRoutes);

// Mount under /api and root fallback (guarantees compatibility with all Vercel rewrite patterns)
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start local server if run directly (e.g. npm run server)
if (!process.env.VERCEL && require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[ExamSphere API] Server listening on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
