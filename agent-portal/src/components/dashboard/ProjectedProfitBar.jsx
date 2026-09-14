import React from 'react';

export default function ProjectedProfitBar({ onActionClick }) {
  const segments = [
    { name: 'Willow Grove Villa', val: '₹2,15,931', type: 'green', flex: 1.2 },
    { name: 'Silver Pines Suites', val: '₹3,44,715', type: 'amber', flex: 1.4 },
    { name: 'Cedar Haven Plots', val: '₹1,51,791', type: 'pattern', flex: 0.9 },
    { name: 'Rosewood Manor', val: '₹3,52,802', type: 'teal', flex: 1.5 },
  ];

  return (
    <div className="projected-profit-card">
      <div className="profit-header">
        <div className="profit-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--emerald-neon)',
              boxShadow: '0 0 10px var(--emerald-neon)'
            }}></span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--emerald-neon)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Commission Pipeline
            </span>
          </div>
          <h2 style={{ marginTop: 4 }}>Projected Profit & Earnings</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Projected Value</span>
            <div className="profit-total-value">₹10,65,239</div>
          </div>

          <button 
            className="btn btn-outline btn-sm"
            onClick={onActionClick}
            style={{ borderRadius: 999, padding: '0.55rem 1.1rem', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <span>View All Deals</span>
            <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }}></i>
          </button>
        </div>
      </div>

      {/* Segmented Bar styled like the reference monitor */}
      <div className="segmented-progress-bar">
        {segments.map((seg, i) => (
          <div 
            key={i} 
            className={`bar-segment ${seg.type}`}
            style={{ flex: seg.flex }}
            title={`${seg.name}: ${seg.val} expected commission`}
            onClick={onActionClick}
          >
            <span>{seg.name}</span>
            <span style={{ opacity: 0.95, fontWeight: 900 }}>{seg.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
