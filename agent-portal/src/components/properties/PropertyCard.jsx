import React from 'react';

export default function PropertyCard({ property, onSelect, onShare, onScheduleVisit }) {
  return (
    <div className="property-card" onClick={() => onSelect(property)} style={{ cursor: 'pointer' }}>
      {/* Property Thumbnail & Commission Pill */}
      <div className="property-img-wrapper">
        <img src={property.image} alt={property.title} className="property-img" loading="lazy" />
        
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(6px)',
          padding: '0.25rem 0.65rem',
          borderRadius: 999,
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--teal-light)'
        }}>
          {property.type}
        </div>

        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: property.status === 'Available' ? 'rgba(34,197,94,0.9)' : 'rgba(245,158,11,0.9)',
          color: property.status === 'Available' ? '#052E16' : '#451A03',
          padding: '0.2rem 0.6rem',
          borderRadius: 999,
          fontSize: '0.68rem',
          fontWeight: 800,
          textTransform: 'uppercase'
        }}>
          {property.status}
        </div>

        {/* Expected Commission Pill */}
        <div className="property-commission-badge">
          <i className="fa-solid fa-coins"></i>
          <span>Comm: {property.commissionFormatted} ({property.commissionPct}%)</span>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ID: {property.id}</div>
          <h4 style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            marginTop: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {property.title}
          </h4>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--teal-light)', fontSize: '0.75rem' }}></i>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.location}</span>
          </div>
        </div>

        {/* Price & Specs */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.65rem',
          marginTop: 'auto'
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Listing Price</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{property.priceFormatted}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Configuration</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {property.bedrooms ? `${property.bedrooms} BHK • ` : ''}{property.area}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div 
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onShare(property)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <i className="fa-solid fa-share-nodes"></i> Share
          </button>

          <button
            onClick={() => onScheduleVisit(property)}
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <i className="fa-solid fa-calendar-plus"></i> Visit
          </button>
        </div>
      </div>
    </div>
  );
}
