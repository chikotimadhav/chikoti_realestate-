// ============================================================
// CHIKOTI REAL ESTATE — EXPRESS API SERVER
// ============================================================
require('dotenv').config();
require('./config/db');
const express    = require('express');
const cors       = require('cors');
const path       = require('path');

const authRoutes       = require('./routes/auth');
const propertyRoutes   = require('./routes/properties');
const inquiryRoutes    = require('./routes/inquiries');
const userRoutes       = require('./routes/users');
const uploadRoutes     = require('./routes/upload');
const adminRoutes      = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3001',  // buyer
  'http://localhost:3002',  // seller
  'http://localhost:3003',  // admin
  'https://www.chikotirealestate.com',
  'https://seller.chikotirealestate.com',
  'https://admin.chikotirealestate.com',
];

if (process.env.CORS_ORIGINS) {
  allowedOrigins.push(...process.env.CORS_ORIGINS.split(',').map(o => o.trim()));
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries',  inquiryRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/upload',     uploadRoutes);
app.use('/api/admin',      adminRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// ── 404 handler ────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`\n🚀 Chikoti API running on http://localhost:${PORT}\n`)
  );
}

module.exports = app;
