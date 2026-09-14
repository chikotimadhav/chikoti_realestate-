import React from 'react';

export default function LeadSourceWidget({ onNavigateLeads }) {
  const sources = [
    { label: 'Organic', pct: '38%', color: '#22C55E' },
    { label: 'Web Portal', pct: '27%', color: '#0D9488' },
    { label: 'Direct Referral', pct: '18%', color: '#F59E0B' },
    { label: 'Email', pct: '11%', color: '#8B5CF6' },
    { label: 'Phone Call', pct: '6%', color: '#3B82F6' },
  ];

  const recentClients = [
    { email: 'vikram.varma@techventures.io', tag: '+10 clients', role: 'NRI Tech Lead' },
    { email: 'ananya.deshmukh@gmail.com', tag: '+5 clients', role: 'Luxury Penthouse' },
    { email: 'sanjay.chawla@capitalinvest.com', tag: '+18 clients', role: 'Commercial Grade-A' },
  ];

  return (
    <div className="lead-source-widget">
      <div className="card-title-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="card-title">Lead Source</span>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.55rem',
            borderRadius: 999,
            background: 'rgba(34, 197, 94, 0.2)',
            color: 'var(--emerald-neon)',
            fontWeight: 800
          }}>
            Active
          </span>
        </div>

        <button 
          onClick={onNavigateLeads}
          style={{ fontSize: '0.78rem', color: 'var(--teal-light)', fontWeight: 700 }}
        >
          Manage Leads ↗
        </button>
      </div>

      <div className="lead-source-stat-top">
        <div className="lead-source-number">1,446</div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/for this month</span>
        <span className="lead-source-pill-percent">
          <i className="fa-solid fa-arrow-up" style={{ fontSize: '0.65rem' }}></i> 4.63%
        </span>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="lead-source-bar">
        {sources.map((s, idx) => (
          <div key={idx} style={{ width: s.pct, background: s.color, height: '100%' }} title={`${s.label}: ${s.pct}`}></div>
        ))}
      </div>

      <div className="lead-source-legend">
        {sources.slice(0, 4).map((s, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }}></span>
            <span>{s.label} ({s.pct})</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
        {recentClients.map((c, i) => (
          <div key={i} className="client-lead-item">
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{c.email}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.role}</div>
            </div>
            <span className="client-tag-pill">{c.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
