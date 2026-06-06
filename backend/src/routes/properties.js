// ============================================================
// PROPERTIES ROUTES (MONGODB)
// ============================================================
const express  = require('express');
const Property = require('../models/Property');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/properties — public, approved only ────────────
router.get('/', async (req, res) => {
  try {
    const { type, listing, search, sort, limit = 20, offset = 0 } = req.query;
    const query = { status: 'approved' };

    if (type)    query.land_type = type;
    if (listing) query.listing_type = listing;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = {};
    if (sort === 'price_asc')  sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'newest')     sortOption = { created_at: -1 };

    const docs = await Property.find(query)
      .sort(sortOption)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const data = docs.map(d => d.toObject());
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/featured ──────────────────────────
router.get('/featured', async (_req, res) => {
  try {
    const docs = await Property.find({ status: 'approved', is_featured: true })
      .limit(6);
    const data = docs.map(d => d.toObject());
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/:id — increment views ──────────────
router.get('/:id', async (req, res) => {
  try {
    const propertyDoc = await Property.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!propertyDoc) return res.status(404).json({ error: 'Property not found' });
    res.json({ success: true, data: propertyDoc.toObject() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── POST /api/properties — seller creates listing ──────────
router.post('/', authenticate, requireRole('seller', 'admin'), async (req, res) => {
  try {
    const {
      title, land_type, listing_type, price, location, lat, lng, description,
      contact_number, whatsapp_number,
      // agri
      acres, soil_type, water_source, current_crop, crop_yield, electricity, fencing, agri_facilities,
      // commercial
      built_area, floor, frontage, business_type, parking, footfall, landmarks, comm_amenities,
      // residential
      area_sqft, bedrooms, bathrooms, furnishing, res_floor, res_amenities,
      images = [],
    } = req.body;

    const parseJsonArray = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try { return JSON.parse(val); } catch { return []; }
    };

    const propertyDoc = await Property.create({
      seller_id: req.user.id,
      title, land_type, listing_type, price, location, lat, lng, description,
      contact_number, whatsapp_number,
      status: 'pending',
      acres, soil_type, water_source, current_crop, crop_yield, electricity, fencing,
      agri_facilities: parseJsonArray(agri_facilities),
      built_area, floor, frontage, business_type, parking, footfall, landmarks,
      comm_amenities: parseJsonArray(comm_amenities),
      area_sqft, bedrooms, bathrooms, furnishing, res_floor,
      res_amenities: parseJsonArray(res_amenities),
      images: parseJsonArray(images)
    });

    res.status(201).json({ success: true, data: { id: propertyDoc._id }, message: 'Property submitted for review' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/seller/mine — seller's own listings
router.get('/seller/mine', authenticate, requireRole('seller'), async (req, res) => {
  try {
    const docs = await Property.find({ seller_id: req.user.id })
      .sort({ created_at: -1 });
    const data = docs.map(d => d.toObject());
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/properties/:id — seller deletes own ────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const propertyDoc = await Property.findById(req.params.id);
    if (!propertyDoc) return res.status(404).json({ error: 'Not found' });
    if (propertyDoc.seller_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });

    await Property.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
