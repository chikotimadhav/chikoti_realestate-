// ============================================================
// UPDATES & ALERTS ROUTES (SUPABASE + MEMORY SYNC)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');

const router = express.Router();

// Fallback in-memory alerts cache for real-time responsiveness
let fallbackUpdates = [
  {
    id: 'update-initial-1',
    title: '🌟 Welcome to EstateHub Telangana',
    message: 'Official verified properties, agricultural lands and luxury residences across Telangana.',
    type: 'system',
    created_at: new Date().toISOString(),
  }
];

// Helper to push a live update
function pushLiveUpdate(update) {
  fallbackUpdates.unshift(update);
  if (fallbackUpdates.length > 50) fallbackUpdates.pop();
}

// ── GET /api/updates — public updates and alerts ────────────
router.get('/', async (_req, res) => {
  try {
    // Try fetching from supabase updates table
    const { data: dbUpdates, error } = await supabase
      .from('updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && dbUpdates && dbUpdates.length > 0) {
      return res.json({ success: true, data: dbUpdates });
    }

    // If table not populated yet, check latest approved properties to auto-generate alerts
    const { data: latestProps } = await supabase
      .from('properties')
      .select('id, title, location, land_type, listing_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (latestProps && latestProps.length > 0) {
      const generated = latestProps.map((p) => ({
        id: `update-prop-${p.id}`,
        title: `🌟 New ${p.land_type} Listed: ${p.title}`,
        message: `A new ${p.land_type} property is available in ${p.location} for ${p.listing_type}.`,
        type: 'listing',
        property_id: p.id,
        created_at: p.created_at,
      }));
      return res.json({ success: true, data: generated });
    }

    res.json({ success: true, data: fallbackUpdates });
  } catch (err) {
    res.json({ success: true, data: fallbackUpdates });
  }
});

// ── POST /api/updates — create alert ───────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, message, type = 'listing', property_id } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const newAlert = {
      title,
      message,
      type,
      property_id: property_id || null,
      created_at: new Date().toISOString(),
    };

    // Try saving in Supabase
    try {
      const { data, error } = await supabase
        .from('updates')
        .insert(newAlert)
        .select()
        .single();
      if (!error && data) {
        pushLiveUpdate(data);
        return res.status(201).json({ success: true, data });
      }
    } catch (_) {}

    newAlert.id = `alert-${Date.now()}`;
    pushLiveUpdate(newAlert);
    res.status(201).json({ success: true, data: newAlert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/updates/clear — clear all alerts ───────────
router.delete('/clear', async (_req, res) => {
  try {
    fallbackUpdates = [];
    try {
      await supabase.from('updates').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (_) {}

    res.json({ success: true, message: 'All updates and alerts cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.pushLiveUpdate = pushLiveUpdate;
