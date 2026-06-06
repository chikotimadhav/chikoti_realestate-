// ============================================================
// AUTH ROUTES (MONGODB)
// ============================================================
const express  = require('express');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/auth/register ────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role = 'buyer' } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (!['buyer','seller'].includes(role))
      return res.status(400).json({ error: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const userDoc = await User.create({
      name,
      email,
      phone: phone || null,
      password: hashed,
      role
    });

    const user = userDoc.toObject();
    delete user.password;

    const token = generateToken(user);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email, is_active: true });
    if (!userDoc) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, userDoc.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userDoc.toObject();
    const token = generateToken(user);
    delete user.password;

    res.json({ success: true, data: { user, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/auth/me ───────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const { password, ...user } = req.user;
  res.json({ success: true, data: user });
});

module.exports = router;
