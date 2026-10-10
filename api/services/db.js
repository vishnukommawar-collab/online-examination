const mongoose = require('mongoose');
const { seedUsers, seedExams, seedAttempts } = require('../data/seedData');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Attempt = require('../models/Attempt');

let cachedConnection = null;
let useMemoryStore = false;

// High fidelity in-memory fallback store
const memoryStore = {
  users: JSON.parse(JSON.stringify(seedUsers)),
  exams: JSON.parse(JSON.stringify(seedExams)),
  attempts: JSON.parse(JSON.stringify(seedAttempts)),
};

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    useMemoryStore = true;
    console.log('[Database] No MONGODB_URI found. Utilizing robust in-memory database store with seed data.');
    return null;
  }

  try {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    cachedConnection = await mongoose.connect(uri, opts);
    console.log('[Database] Successfully connected to MongoDB Atlas.');

    // Seed default data if database is brand new
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Database] Initializing database with default users and exams...');
        await User.insertMany(seedUsers);
        await Exam.insertMany(seedExams);
        await Attempt.insertMany(seedAttempts);
        console.log('[Database] Seed data successfully populated.');
      }
    } catch (seedErr) {
      console.warn('[Database] Seed check warning:', seedErr.message);
    }

    return cachedConnection;
  } catch (err) {
    console.warn(`[Database] MongoDB connection failed (${err.message}). Falling back gracefully to in-memory store.`);
    useMemoryStore = true;
    return null;
  }
}

// User Services
const userService = {
  async findByEmail(email) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findById(id) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find(u => u._id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async create(userData) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      const user = new User(userData);
      return await user.save();
    }
    const newUser = {
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...userData,
      email: userData.email.toLowerCase(),
      createdAt: new Date(),
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  async getAll() {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await User.find().select('-password').sort({ createdAt: -1 });
    }
    return memoryStore.users.map(({ password, ...u }) => u);
  }
};

// Exam Services
const examService = {
  async getAll() {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Exam.find().sort({ createdAt: -1 });
    }
    return [...memoryStore.exams].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getPublished() {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      // Return published exams without exposing correct answers or explanations to students
      const exams = await Exam.find({ isPublished: true }).sort({ createdAt: -1 });
      return exams.map(exam => {
        const obj = exam.toObject ? exam.toObject() : { ...exam };
        obj.questions = obj.questions.map(q => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        });
        return obj;
      });
    }

    return memoryStore.exams
      .filter(e => e.isPublished)
      .map(exam => {
        const copy = JSON.parse(JSON.stringify(exam));
        copy.questions = copy.questions.map(q => {
          const { correctAnswer, explanation, ...safeQ } = q;
          return safeQ;
        });
        return copy;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id, includeAnswers = false) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      const exam = await Exam.findById(id);
      if (!exam) return null;
      if (includeAnswers) return exam.toObject ? exam.toObject() : exam;
      const obj = exam.toObject ? exam.toObject() : { ...exam };
      obj.questions = obj.questions.map(q => {
        const { correctAnswer, explanation, ...safeQ } = q;
        return safeQ;
      });
      return obj;
    }

    const exam = memoryStore.exams.find(e => e._id.toString() === id.toString());
    if (!exam) return null;
    const copy = JSON.parse(JSON.stringify(exam));
    if (!includeAnswers) {
      copy.questions = copy.questions.map(q => {
        const { correctAnswer, explanation, ...safeQ } = q;
        return safeQ;
      });
    }
    return copy;
  },

  async create(examData) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      const exam = new Exam(examData);
      return await exam.save();
    }
    const newExam = {
      _id: 'exam_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...examData,
      createdAt: new Date(),
    };
    memoryStore.exams.push(newExam);
    return newExam;
  },

  async update(id, updateData) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Exam.findByIdAndUpdate(id, updateData, { new: true });
    }
    const index = memoryStore.exams.findIndex(e => e._id.toString() === id.toString());
    if (index === -1) return null;
    memoryStore.exams[index] = {
      ...memoryStore.exams[index],
      ...updateData,
    };
    return memoryStore.exams[index];
  },

  async delete(id) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Exam.findByIdAndDelete(id);
    }
    const index = memoryStore.exams.findIndex(e => e._id.toString() === id.toString());
    if (index === -1) return null;
    const removed = memoryStore.exams.splice(index, 1);
    return removed[0];
  }
};

// Attempt Services
const attemptService = {
  async create(attemptData) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      const attempt = new Attempt(attemptData);
      return await attempt.save();
    }
    const newAttempt = {
      _id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...attemptData,
      submittedAt: new Date(),
    };
    memoryStore.attempts.push(newAttempt);
    return newAttempt;
  },

  async findById(id) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Attempt.findById(id);
    }
    return memoryStore.attempts.find(a => a._id.toString() === id.toString()) || null;
  },

  async findByStudent(studentId) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Attempt.find({ studentId }).sort({ submittedAt: -1 });
    }
    return memoryStore.attempts
      .filter(a => a.studentId === studentId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async findByExam(examId) {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Attempt.find({ examId }).sort({ submittedAt: -1 });
    }
    return memoryStore.attempts
      .filter(a => a.examId.toString() === examId.toString())
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async getAll() {
    await connectDB();
    if (!useMemoryStore && mongoose.connection.readyState === 1) {
      return await Attempt.find().sort({ submittedAt: -1 });
    }
    return [...memoryStore.attempts].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  async getStats() {
    await connectDB();
    const attempts = await this.getAll();
    const exams = await examService.getAll();
    const users = await userService.getAll();

    const totalAttempts = attempts.length;
    const totalExams = exams.length;
    const totalStudents = users.filter(u => u.role === 'student').length;

    const passedAttempts = attempts.filter(a => a.isPassed).length;
    const passRate = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

    const avgScore = totalAttempts > 0
      ? Math.round((attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempts) * 10) / 10
      : 0;

    return {
      totalExams,
      totalStudents,
      totalAttempts,
      passRate,
      avgScore,
      recentAttempts: attempts.slice(0, 10),
    };
  }
};

module.exports = {
  connectDB,
  userService,
  examService,
  attemptService,
};
