// ============================================================
// INQUIRIES ROUTES (MONGODB)
// ============================================================
const express = require('express');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/inquiries — buyer sends inquiry ──────────────
router.post('/', async (req, res) => {
  try {
    const { property_id, buyer_name, buyer_email, buyer_phone, message } = req.body;
    if (!property_id || !buyer_name || !buyer_email || !buyer_phone)
      return res.status(400).json({ error: 'All fields required' });

    await Inquiry.create({
      property_id,
      buyer_name,
      buyer_email,
      buyer_phone,
      message: message || ''
    });

    // Bump views
    await Property.updateOne({ _id: property_id }, { $inc: { views: 1 } });
    res.status(201).json({ success: true, message: 'Inquiry sent!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/inquiries/seller — seller's inquiries ─────────
router.get('/seller', authenticate, async (req, res) => {
  try {
    // Get all properties owned by this seller
    const sellerProperties = await Property.find({ seller_id: req.user.id }, '_id title');
    const propertyIds = sellerProperties.map(p => p._id);

    // Find inquiries for those properties
    const inquiries = await Inquiry.find({ property_id: { $in: propertyIds } })
      .sort({ created_at: -1 })
      .populate('property_id', 'title');

    // Flatten response properties to match what frontend expects
    const data = inquiries.map(i => {
      const obj = i.toObject();
      obj.property_title = i.property_id ? i.property_id.title : 'Deleted Property';
      obj.property_id = i.property_id ? i.property_id._id : null;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
