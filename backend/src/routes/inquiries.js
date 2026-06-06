// ============================================================
// INQUIRIES ROUTES (SUPABASE)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ── POST /api/inquiries — buyer sends inquiry ──────────────
router.post('/', async (req, res) => {
  try {
    const { property_id, buyer_name, buyer_email, buyer_phone, message } = req.body;
    if (!property_id || !buyer_name || !buyer_email || !buyer_phone)
      return res.status(400).json({ error: 'All fields required' });

    const { error: insErr } = await supabase
      .from('inquiries')
      .insert({
        property_id,
        buyer_name,
        buyer_email,
        buyer_phone,
        message: message || ''
      });

    if (insErr) throw new Error(insErr.message);

    // Bump views on the property
    const { data: prop, error: fetchErr } = await supabase
      .from('properties')
      .select('views')
      .eq('id', property_id)
      .maybeSingle();

    if (!fetchErr && prop) {
      await supabase
        .from('properties')
        .update({ views: (prop.views || 0) + 1 })
        .eq('id', property_id);
    }

    res.status(201).json({ success: true, message: 'Inquiry sent!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/inquiries/seller — seller's inquiries ─────────
router.get('/seller', authenticate, async (req, res) => {
  try {
    // Get all properties owned by this seller
    const { data: sellerProperties, error: propErr } = await supabase
      .from('properties')
      .select('id, title')
      .eq('seller_id', req.user.id);

    if (propErr) throw new Error(propErr.message);
    const propertyIds = sellerProperties.map(p => p.id);

    // Find inquiries for those properties
    const { data: inquiries, error: inqErr } = await supabase
      .from('inquiries')
      .select('*, property:properties(id, title)')
      .in('property_id', propertyIds)
      .order('created_at', { ascending: false });

    if (inqErr) throw new Error(inqErr.message);

    // Flatten response properties to match what frontend expects
    const data = inquiries.map(i => {
      const obj = { ...i };
      obj.property_title = i.property ? i.property.title : 'Deleted Property';
      obj.property_id = i.property ? i.property.id : null;
      delete obj.property;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
