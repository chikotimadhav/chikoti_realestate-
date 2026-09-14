import React from 'react';

const TYPE_COLORS = {
  Agriculture: '#059669',
  Commercial: '#D97706',
  Residential: '#1D4F91',
};

export default function PropertyCard({ property: p, onClick, t = {} }) {
  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400';

  function formatPrice(n) {
    if (!n) return '—';
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`;
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  const categoryLabel = (p.land_type && t[p.land_type.toLowerCase()]) ? t[p.land_type.toLowerCase()] : p.land_type;
  const listingLabel = p.listing_type === 'Sale' ? (t.for_sale || 'For Sale') :
                       p.listing_type === 'Rent' ? (t.for_rent || 'For Rent') :
                       p.listing_type === 'Lease' ? (t.for_lease || 'For Lease') : `For ${p.listing_type}`;

  return (
    <div className="card" style={{ cursor: 'pointer', background: '#FFFFFF', border: '1px solid #E5E7EB' }} onClick={onClick}>
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={img}
          alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        <span style={{
          position: 'absolute', top: 12, left: 12,
          background: TYPE_COLORS[p.land_type] || '#1D4F91',
          color: 'white', padding: '0.25rem 0.75rem',
          borderRadius: 999, fontSize: '0.72rem', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: 0.5,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}>
          {categoryLabel}
        </span>
        <span style={{
          position: 'absolute', top: 12, right: 12,
          background: '#1D4F91', color: '#F0C040',
          padding: '0.25rem 0.75rem', borderRadius: 999,
          fontSize: '0.72rem', fontWeight: 700,
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        }}>
          {listingLabel}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F294D', lineHeight: 1.3 }}>
          {p.title}
        </h3>
        <p style={{ color: '#6B7280', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
          <span style={{ color: '#C9A84C' }}>📍</span>
          {p.location?.split(',').slice(0, 2).join(',')}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #F2F4F7' }}>
          <span className="price-tag" style={{ color: '#1D4F91' }}>{formatPrice(p.price)}</span>
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
            👁️ {p.views || 0} {t.views || 'views'}
          </span>
        </div>
        <button className="btn-gold" style={{
          width: '100%', justifyContent: 'center', marginTop: '1rem',
          padding: '0.65rem', fontSize: '0.9rem',
        }}>
          {t.view_details || 'View Details'}
        </button>
      </div>
    </div>
  );
}
