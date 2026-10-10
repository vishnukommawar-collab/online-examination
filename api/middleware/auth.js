const jwt = require('jsonwebtoken');
const { userService } = require('../services/db');

const JWT_SECRET = process.env.JWT_SECRET || 'examsphere_super_secret_jwt_key_2025';

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await userService.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session or user no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired', error: error.message });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin privileges required.' });
  }
  next();
}

module.exports = {
  authenticate,
  requireAdmin,
  JWT_SECRET,
};
