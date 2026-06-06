// ============================================================
// ADMIN ROUTES — property approval, user management, stats (SUPABASE)
// ============================================================
const express  = require('express');
const supabase = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

// ── GET /api/admin/stats ───────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const [
      totalPropsRes,
      pendingPropsRes,
      approvedPropsRes,
      totalUsersRes,
      totalSellersRes,
      totalInquiriesRes,
      viewsRes
    ] = await Promise.all([
      supabase.from('properties').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('role', 'seller'),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }),
      supabase.from('properties').select('views')
    ]);

    const totalProps = totalPropsRes.count || 0;
    const pendingProps = pendingPropsRes.count || 0;
    const approvedProps = approvedPropsRes.count || 0;
    const totalUsers = totalUsersRes.count || 0;
    const totalSellers = totalSellersRes.count || 0;
    const totalInquiries = totalInquiriesRes.count || 0;
    
    const totalViews = (viewsRes.data || []).reduce((acc, p) => acc + (p.views || 0), 0);

    res.json({ success: true, data: {
      properties: totalProps, 
      pending: pendingProps, 
      approved: approvedProps,
      users: totalUsers, 
      sellers: totalSellers,
      inquiries: totalInquiries, 
      views: totalViews,
    }});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/admin/properties — all properties with any status
router.get('/properties', async (req, res) => {
  try {
    const { status } = req.query;
    let queryBuilder = supabase
      .from('properties')
      .select('*, seller:users(name, email)')
      .order('created_at', { ascending: false });

    if (status) queryBuilder = queryBuilder.eq('status', status);

    const { data: properties, error } = await queryBuilder;

    if (error) throw new Error(error.message);

    // Format response to match SQL flat structure expected by frontend
    const data = properties.map(p => {
      const obj = { ...p };
      obj.seller_name = p.seller ? p.seller.name : 'Unknown Seller';
      obj.seller_email = p.seller ? p.seller.email : '';
      obj.seller_id = p.seller_id;
      delete obj.seller;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/admin/properties/:id/status ─────────────────
router.patch('/properties/:id/status', async (req, res) => {
  try {
    const { status, is_featured } = req.body;
    if (!['approved','rejected','pending'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    const { data: propertyDoc, error: updateErr } = await supabase
      .from('properties')
      .update({ status, is_featured: !!is_featured })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateErr || !propertyDoc) return res.status(404).json({ error: 'Property not found' });
    
    res.json({ success: true, message: `Property ${status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/admin/users ───────────────────────────────────
router.get('/users', async (_req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, is_verified, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    res.json({ success: true, data: users });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/admin/users/:id — toggle active/verified ────
router.patch('/users/:id', async (req, res) => {
  try {
    const { is_active, is_verified } = req.body;
    const { data: userDoc, error: updateErr } = await supabase
      .from('users')
      .update({ is_active: !!is_active, is_verified: !!is_verified })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateErr || !userDoc) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/admin/inquiries ───────────────────────────────
router.get('/inquiries', async (_req, res) => {
  try {
    const { data: inquiries, error } = await supabase
      .from('inquiries')
      .select('*, property:properties(id, title, land_type)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Format response to match SQL flat structure expected by frontend
    const data = inquiries.map(i => {
      const obj = { ...i };
      obj.property_title = i.property ? i.property.title : 'Deleted Property';
      obj.land_type = i.property ? i.property.land_type : null;
      obj.property_id = i.property ? i.property.id : null;
      delete obj.property;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
