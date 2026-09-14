// ============================================================
// PROPERTIES ROUTES (SUPABASE)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');
const { pushLiveUpdate } = require('./updates');

const router = express.Router();

// ── GET /api/properties — public, approved only ────────────
router.get('/', async (req, res) => {
  try {
    const { type, listing, search, sort, limit = 20, offset = 0 } = req.query;
    
    let queryBuilder = supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved');

    if (type)    queryBuilder = queryBuilder.eq('land_type', type);
    if (listing) queryBuilder = queryBuilder.eq('listing_type', listing);
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,location.ilike.%${search}%`);
    }

    if (sort === 'price_asc')  queryBuilder = queryBuilder.order('price', { ascending: true });
    if (sort === 'price_desc') queryBuilder = queryBuilder.order('price', { ascending: false });
    if (sort === 'newest')     queryBuilder = queryBuilder.order('created_at', { ascending: false });

    const { data, error } = await queryBuilder
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) throw new Error(error.message);

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/featured ──────────────────────────
router.get('/featured', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'approved')
      .eq('is_featured', true)
      .limit(6);

    if (error) throw new Error(error.message);

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/:id — increment views ──────────────
router.get('/:id', async (req, res) => {
  try {
    const { data: prop, error: fetchErr } = await supabase
      .from('properties')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (fetchErr) throw new Error(fetchErr.message);
    if (!prop) return res.status(404).json({ error: 'Property not found' });

    const { data: updatedProp, error: updateErr } = await supabase
      .from('properties')
      .update({ views: (prop.views || 0) + 1 })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateErr) throw new Error(updateErr.message);

    res.json({ success: true, data: updatedProp });
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

    const { data: propertyDoc, error: createErr } = await supabase
      .from('properties')
      .insert({
        seller_id: req.user.id,
        title, land_type, listing_type, price: parseFloat(price), location, lat, lng, description,
        contact_number, whatsapp_number,
        status: 'approved',
        acres: acres ? parseFloat(acres) : null,
        soil_type, water_source, current_crop,
        crop_yield: crop_yield ? parseFloat(crop_yield) : null,
        electricity, fencing,
        agri_facilities: parseJsonArray(agri_facilities),
        built_area: built_area ? parseFloat(built_area) : null,
        floor,
        frontage: frontage ? parseFloat(frontage) : null,
        business_type, parking, footfall, landmarks,
        comm_amenities: parseJsonArray(comm_amenities),
        area_sqft: area_sqft ? parseFloat(area_sqft) : null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        furnishing, res_floor,
        res_amenities: parseJsonArray(res_amenities),
        images: parseJsonArray(images)
      })
      .select()
      .single();

    if (createErr || !propertyDoc) throw new Error(createErr?.message || 'Failed to create listing');

    // Automatically generate live update alert for both website & app
    try {
      const alertData = {
        title: `🌟 New ${land_type} Listed: ${title}`,
        message: `A new ${land_type} property is available in ${location} for ${listing_type}.`,
        type: 'listing',
        property_id: propertyDoc.id,
        created_at: new Date().toISOString(),
      };
      await supabase.from('updates').insert(alertData);
      if (typeof pushLiveUpdate === 'function') pushLiveUpdate(alertData);
    } catch (_) {
      if (typeof pushLiveUpdate === 'function') {
        pushLiveUpdate({
          id: `alert-${Date.now()}`,
          title: `🌟 New ${land_type} Listed: ${title}`,
          message: `A new ${land_type} property is available in ${location} for ${listing_type}.`,
          type: 'listing',
          property_id: propertyDoc.id,
          created_at: new Date().toISOString(),
        });
      }
    }

    res.status(201).json({ success: true, data: { id: propertyDoc.id }, message: 'Property listed successfully and live on website & app' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/properties/seller/mine — seller's own listings
router.get('/seller/mine', authenticate, requireRole('seller'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('seller_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE /api/properties/:id — seller deletes own ────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { data: propertyDoc, error: findErr } = await supabase
      .from('properties')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (findErr || !propertyDoc) return res.status(404).json({ error: 'Not found' });
    if (propertyDoc.seller_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Forbidden' });

    const { error: delErr } = await supabase
      .from('properties')
      .delete()
      .eq('id', req.params.id);

    if (delErr) throw new Error(delErr.message);
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
