// ============================================================
// ADMIN ROUTES — property approval, user management, stats (MONGODB)
// ============================================================
const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

// ── GET /api/admin/stats ───────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const [
      totalProps,
      pendingProps,
      approvedProps,
      totalUsers,
      totalSellers,
      totalInquiries,
      viewsAggregate
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' }),
      Property.countDocuments({ status: 'approved' }),
      User.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      Inquiry.countDocuments(),
      Property.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ])
    ]);

    const totalViews = viewsAggregate[0] ? viewsAggregate[0].totalViews : 0;

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
    const filter = {};
    if (status) filter.status = status;

    const properties = await Property.find(filter)
      .sort({ created_at: -1 })
      .populate('seller_id', 'name email');

    // Format response to match SQL flat structure expected by frontend
    const data = properties.map(p => {
      const obj = p.toObject();
      obj.seller_name = p.seller_id ? p.seller_id.name : 'Unknown Seller';
      obj.seller_email = p.seller_id ? p.seller_id.email : '';
      obj.seller_id = p.seller_id ? p.seller_id._id : null;
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

    const propertyDoc = await Property.findByIdAndUpdate(
      req.params.id,
      { status, is_featured: !!is_featured },
      { new: true }
    );
    if (!propertyDoc) return res.status(404).json({ error: 'Property not found' });
    
    res.json({ success: true, message: `Property ${status}` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/admin/users ───────────────────────────────────
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find({}, 'id name email phone role is_verified is_active created_at')
      .sort({ created_at: -1 });
    const data = users.map(u => u.toObject());
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── PATCH /api/admin/users/:id — toggle active/verified ────
router.patch('/users/:id', async (req, res) => {
  try {
    const { is_active, is_verified } = req.body;
    const userDoc = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: !!is_active, is_verified: !!is_verified },
      { new: true }
    );
    if (!userDoc) return res.status(404).json({ error: 'User not found' });
    
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── GET /api/admin/inquiries ───────────────────────────────
router.get('/inquiries', async (_req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .sort({ created_at: -1 })
      .populate('property_id', 'title land_type');

    // Format response to match SQL flat structure expected by frontend
    const data = inquiries.map(i => {
      const obj = i.toObject();
      obj.property_title = i.property_id ? i.property_id.title : 'Deleted Property';
      obj.land_type = i.property_id ? i.property_id.land_type : null;
      obj.property_id = i.property_id ? i.property_id._id : null;
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
