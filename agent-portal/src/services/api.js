// ============================================================
// ESTATEHUB AGENT PORTAL — DATABASE API CLIENT
// Interacts with shared EstateHub backend (MongoDB / Supabase)
// ============================================================
import { API_URL } from '../config.js';

// Format currency to Indian Lakhs / Crores
export function formatIndianCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₹' + amount;
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

// 1. Health check to test database connectivity
export async function checkDatabaseHealth() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// 2. Fetch live properties from shared database
export async function fetchDatabaseProperties() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${API_URL}/api/properties`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    const rawList = result.data || [];

    // Map database properties to agent portal property format
    return rawList.map((item, idx) => {
      const price = Number(item.price) || 2500000;
      const commissionPct = 2.5;
      const expectedCommission = Math.round(price * (commissionPct / 100));

      const rawImages = Array.isArray(item.images) ? item.images : [];
      const primaryImage = rawImages[0] || (
        item.land_type === 'Commercial'
          ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080'
          : item.land_type === 'Agriculture'
          ? 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1080'
          : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1080'
      );

      const areaStr = item.area_sqft
        ? `${item.area_sqft.toLocaleString('en-IN')} sq.ft`
        : item.acres
        ? `${item.acres} Acres`
        : item.built_area
        ? `${item.built_area.toLocaleString('en-IN')} sq.ft`
        : 'Prime Area';

      const typeMap = {
        'Residential': 'Villas',
        'Commercial': 'Commercial',
        'Agriculture': 'Farm Lands'
      };

      return {
        id: String(item.id || item._id || `PROP-DB-${idx + 1}`),
        dbId: item._id || item.id,
        title: item.title,
        slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        type: typeMap[item.land_type] || item.land_type || 'Apartments',
        category: item.land_type === 'Agriculture' ? 'Land' : (item.land_type || 'Residential'),
        price: price,
        priceFormatted: formatIndianCurrency(price),
        area: areaStr,
        bedrooms: item.bedrooms || null,
        bathrooms: item.bathrooms || null,
        location: item.location || 'Telangana, India',
        lat: item.lat || 17.3850,
        lng: item.lng || 78.4867,
        status: item.status === 'approved' ? 'Available' : (item.status || 'Available'),
        commissionPct: commissionPct,
        expectedCommission: expectedCommission,
        commissionFormatted: formatIndianCurrency(expectedCommission),
        image: primaryImage,
        gallery: rawImages.length > 0 ? rawImages : [primaryImage],
        description: item.description || 'Verified property listing directly loaded from EstateHub shared database.',
        amenities: [
          ...(Array.isArray(item.agri_facilities) ? item.agri_facilities : []),
          ...(Array.isArray(item.comm_amenities) ? item.comm_amenities : []),
          ...(Array.isArray(item.res_amenities) ? item.res_amenities : []),
          'Verified Title Documents',
          'Immediate Registration'
        ].slice(0, 6),
        seller: {
          name: item.seller?.name || 'Verified Landowner',
          type: item.seller?.email ? 'Verified Seller' : 'EstateHub Direct',
          verified: true,
          phone: item.contact_number || item.whatsapp_number || '+91 98490 XXXXX'
        },
        reraReg: item.land_type === 'Agriculture' ? 'Dharani / Passbook' : 'TS-RERA Approved',
        isDatabaseProperty: true
      };
    });
  } catch (err) {
    console.warn('Could not fetch properties from database API, using cached fallback:', err.message);
    return null;
  }
}

// 3. Post lead / inquiry to shared database
export async function sendLeadToDatabase(leadData) {
  try {
    const payload = {
      property_id: leadData.interestedPropertyId || '6a7c7846f9ac9be478d309bc',
      buyer_name: leadData.customerName,
      buyer_email: leadData.email || 'lead@estatehub.in',
      buyer_phone: leadData.phone,
      message: `[Agent Lead: ${leadData.assignedAgent || 'Agent'}] Budget: ${leadData.budget || 'Open'}. Notes: ${leadData.notes || 'Inquiry via Agent Portal'}`
    };

    const res = await fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.warn('Failed to sync lead with database:', err.message);
    return { ok: false, error: err.message };
  }
}

// 4. Authenticate agent against database users
export async function loginAgentToDatabase(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return { ok: true, data: data.data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
