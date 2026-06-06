// ============================================================
// JWT AUTH MIDDLEWARE
// ============================================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'chikoti_secret_2024';

/** Verify JWT token */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id, is_active: true });
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user.toObject();
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/** Require specific role(s) */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    next();
  };
}

/** Generate JWT token */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { authenticate, requireRole, generateToken };
