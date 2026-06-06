// ============================================================
// USERS ROUTES (MONGODB)
// ============================================================
const express = require('express');
const Favorite = require('../models/Favorite');
const Property = require('../models/Property');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/users/favorites ───────────────────────────────
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user_id: req.user.id })
      .populate('property_id');

    // Filter out any favorites where the property has been deleted
    const data = favorites
      .map(f => f.property_id)
      .filter(p => p !== null)
      .map(p => p.toObject());

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/users/favorites/:propId — toggle ─────────────
router.post('/favorites/:propId', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const propId = req.params.propId;

    const existing = await Favorite.findOne({ user_id: userId, property_id: propId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      res.json({ success: true, favorited: false });
    } else {
      await Favorite.create({ user_id: userId, property_id: propId });
      res.json({ success: true, favorited: true });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
