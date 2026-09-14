import React, { useState } from 'react';
import StatCard from '../components/common/StatCard.jsx';

export default function PerformancePage() {
  const [dateRange, setDateRange] = useState('30 Days');

  const DATE_FILTERS = ['Today', '7 Days', '30 Days', '3 Months', '6 Months', '1 Year'];

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Performance Analytics</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Deep dive into your deal conversion funnel, pipeline velocity, and revenue impact.
          </p>
        </div>

        {/* Date Filter Strip from Requirement 10 */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: 3,
          overflowX: 'auto'
        }}>
          {DATE_FILTERS.map(d => (
            <button
              key={d}
              onClick={() => setDateRange(d)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: dateRange === d ? 'var(--bg-card-hover)' : 'transparent',
                color: dateRange === d ? 'var(--teal-light)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                whiteSpace: 'nowrap'
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 8 Core Metrics from Requirement 10 */}
      <div className="stat-card-grid">
        <StatCard
          label="Total Leads"
          value="64"
          delta="+14%"
          deltaType="up"
          deltaPeriod={dateRange}
          icon="fa-solid fa-users"
          iconBg="rgba(59,130,246,0.18)"
          iconColor="#60A5FA"
        />

        <StatCard
          label="Qualified Leads"
          value="42"
          delta="65.6% Qual"
          deltaType="up"
          deltaPeriod={dateRange}
          icon="fa-solid fa-user-check"
          iconBg="rgba(168,85,247,0.18)"
          iconColor="#C084FC"
        />

        <StatCard
          label="Site Visits Completed"
          value="29"
          delta="88% Show rate"
          deltaType="up"
          deltaPeriod={dateRange}
          icon="fa-solid fa-calendar-circle-check"
          iconBg="rgba(13,148,136,0.18)"
          iconColor="var(--teal-light)"
        />

        <StatCard
          label="Bookings Created"
          value="12"
          delta="+3 new"
          deltaType="up"
          deltaPeriod={dateRange}
          icon="fa-solid fa-handshake"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
        />

        <StatCard
          label="Completed Sales"
          value="9"
          delta="100% Registered"
          deltaType="up"
          deltaPeriod={dateRange}
          icon="fa-solid fa-trophy"
          iconBg="rgba(245,158,11,0.18)"
          iconColor="var(--gold-accent)"
        />

        <StatCard
          label="Conversion Rate"
          value="18.6%"
          delta="Top 5% Agent"
          deltaType="up"
          deltaPeriod="Platform benchmark: 8%"
          icon="fa-solid fa-arrow-up-right-dots"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
        />

        <StatCard
          label="Revenue Generated"
          value="₹14.2 Cr"
          delta="High HNI Volume"
          deltaType="up"
          deltaPeriod="Total deal value"
          icon="fa-solid fa-landmark"
          iconBg="rgba(13,148,136,0.18)"
          iconColor="var(--teal-light)"
        />

        <StatCard
          label="Commission Earned"
          value="₹14.85 L"
          delta="Avg 2.2%"
          deltaType="up"
          deltaPeriod="Disbursed & cleared"
          icon="fa-solid fa-circle-dollar-to-slot"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
        />
      </div>

      {/* Visual Conversion Funnel */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Conversion Funnel Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Total Inquiries Received', count: 64, pct: 100, color: '#3B82F6' },
            { label: 'Qualified Buyer Consultations', count: 42, pct: 65, color: '#8B5CF6' },
            { label: 'Site Walkthroughs Conducted', count: 29, pct: 45, color: '#0D9488' },
            { label: 'Negotiation & Token Bookings', count: 12, pct: 19, color: '#F59E0B' },
            { label: 'Sale Deeds Registered & Closed', count: 9, pct: 14, color: '#22C55E' },
          ].map((step, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontWeight: 700, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-main)' }}>{step.label}</span>
                <span style={{ color: step.color }}>{step.count} ({step.pct}%)</span>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${step.pct}%`, height: '100%', background: step.color, borderRadius: 999 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
