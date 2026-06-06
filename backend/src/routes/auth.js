// ============================================================
// AUTH ROUTES (SUPABASE)
// ============================================================
const express  = require('express');
const bcrypt   = require('bcryptjs');
const supabase = require('../config/db');
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

    const { data: existing, error: existErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existErr) throw new Error(existErr.message);
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const { data: user, error: createErr } = await supabase
      .from('users')
      .insert({
        name,
        email,
        phone: phone || null,
        password: hashed,
        role
      })
      .select()
      .single();

    if (createErr || !user) throw new Error(createErr?.message || 'Failed to create user');

    const cleanUser = { ...user };
    delete cleanUser.password;

    const token = generateToken(cleanUser);
    res.status(201).json({ success: true, data: { user: cleanUser, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data: user, error: findErr } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .maybeSingle();

    if (findErr) throw new Error(findErr.message);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const cleanUser = { ...user };
    const token = generateToken(cleanUser);
    delete cleanUser.password;

    res.json({ success: true, data: { user: cleanUser, token } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/auth/me ───────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  const cleanUser = { ...req.user };
  delete cleanUser.password;
  res.json({ success: true, data: cleanUser });
});

module.exports = router;
