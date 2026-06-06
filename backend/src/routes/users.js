// ============================================================
// USERS ROUTES (SUPABASE)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/users/favorites ───────────────────────────────
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*, property_id:properties(*)')
      .eq('user_id', req.user.id);

    if (error) throw new Error(error.message);

    // Filter out any favorites where the property has been deleted
    const data = favorites
      .map(f => f.property_id)
      .filter(p => p !== null);

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/users/favorites/:propId — toggle ─────────────
router.post('/favorites/:propId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const propId = req.params.propId;

    const { data: existing, error: findErr } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('property_id', propId)
      .maybeSingle();

    if (findErr) throw new Error(findErr.message);

    if (existing) {
      const { error: delErr } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      
      if (delErr) throw new Error(delErr.message);
      res.json({ success: true, favorited: false });
    } else {
      const { error: insErr } = await supabase
        .from('favorites')
        .insert({ user_id: userId, property_id: propId });
      
      if (insErr) throw new Error(insErr.message);
      res.json({ success: true, favorited: true });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
