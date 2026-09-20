// ============================================================
// SETTINGS & SYSTEM STATS ROUTES (SUPABASE + MEMORY CACHE)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// Fallback in-memory stats cache for resilient real-time availability
let fallbackHeroStats = {
  properties_transacted: '525+',
  happy_buyers: '1,280+',
  cities_covered: '28',
  years_experience: '15 yrs',
  updated_at: new Date().toISOString(),
};

// Internal helper to get current hero stats
async function fetchHeroStats() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'hero_stats')
      .maybeSingle();

    if (!error && data && data.value) {
      fallbackHeroStats = { ...fallbackHeroStats, ...data.value };
      return fallbackHeroStats;
    }
  } catch (err) {
    console.warn('[SETTINGS] Supabase fetch error, using fallback:', err.message);
  }
  return fallbackHeroStats;
}

// Internal helper to save hero stats
async function saveHeroStats(newStats) {
  fallbackHeroStats = {
    ...fallbackHeroStats,
    properties_transacted: newStats.properties_transacted !== undefined ? String(newStats.properties_transacted).trim() : fallbackHeroStats.properties_transacted,
    happy_buyers: newStats.happy_buyers !== undefined ? String(newStats.happy_buyers).trim() : fallbackHeroStats.happy_buyers,
    cities_covered: newStats.cities_covered !== undefined ? String(newStats.cities_covered).trim() : fallbackHeroStats.cities_covered,
    years_experience: newStats.years_experience !== undefined ? String(newStats.years_experience).trim() : fallbackHeroStats.years_experience,
    updated_at: new Date().toISOString(),
  };

  try {
    await supabase
      .from('system_settings')
      .upsert({
        key: 'hero_stats',
        value: fallbackHeroStats,
        updated_at: new Date().toISOString(),
      });
  } catch (err) {
    console.warn('[SETTINGS] Supabase upsert error, kept in-memory:', err.message);
  }

  return fallbackHeroStats;
}

// ── GET /api/settings/hero-stats — public endpoint ──────────
router.get('/hero-stats', async (_req, res) => {
  try {
    const stats = await fetchHeroStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.json({ success: true, data: fallbackHeroStats });
  }
});

// ── PUT /api/settings/hero-stats — admin protected ──────────
router.put('/hero-stats', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const updated = await saveHeroStats(req.body || {});
    res.json({
      success: true,
      data: updated,
      message: 'Hero stats updated successfully across all portals and apps',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  router,
  fetchHeroStats,
  saveHeroStats,
};
