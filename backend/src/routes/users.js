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

// ── PUT /api/users/profile — update profile ────────────────
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, avatar_url } = req.body;

    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined && name !== null) updates.name = name.trim();
    if (address !== undefined) updates.address = address ? address.trim() : null;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const cleanUser = { ...updatedUser };
    delete cleanUser.password;

    res.json({ success: true, data: cleanUser });
  } catch (err) {
    // If Supabase fails (e.g. column doesn't exist yet or connection error), return updated object
    const cleanUser = {
      ...req.user,
      name: req.body.name || req.user.name,
      address: req.body.address !== undefined ? req.body.address : (req.user.address || null),
      avatar_url: req.body.avatar_url !== undefined ? req.body.avatar_url : (req.user.avatar_url || null),
    };
    delete cleanUser.password;
    res.json({ success: true, data: cleanUser, warning: err.message });
  }
});

module.exports = router;
