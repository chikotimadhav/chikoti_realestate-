import React from 'react';
import { MONTHLY_EARNINGS_SERIES } from '../../data/mockData.js';

export default function EarningsChart() {
  const maxAmount = 1500000;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
      <div className="card-title-row">
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--emerald-neon)', fontWeight: 800, textTransform: 'uppercase' }}>
            Commission Growth
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: 2 }}>Monthly Commission Trajectory</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--emerald-neon)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Disbursed Commission</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--teal-primary)' }}></span>
            <span style={{ color: 'var(--text-secondary)' }}>Deals Closed</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 220,
        paddingTop: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        gap: '1rem'
      }}>
        {MONTHLY_EARNINGS_SERIES.map((item, idx) => {
          const heightPct = Math.round((item.amount / maxAmount) * 100);
          const isHighest = item.amount === Math.max(...MONTHLY_EARNINGS_SERIES.map(m => m.amount));

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative'
              }}
            >
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: isHighest ? 'var(--emerald-neon)' : 'var(--text-muted)',
                marginBottom: 6,
                whiteSpace: 'nowrap'
              }}>
                ₹{(item.amount / 100000).toFixed(1)}L
              </div>

              <div
                style={{
                  width: '75%',
                  maxWidth: 50,
                  height: `${heightPct}%`,
                  borderRadius: '6px 6px 0 0',
                  background: isHighest 
                    ? 'linear-gradient(180deg, #22C55E, #0D9488)' 
                    : 'linear-gradient(180deg, rgba(13,148,136,0.8), rgba(15,23,42,0.6))',
                  boxShadow: isHighest ? '0 0 16px rgba(34,197,94,0.4)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                title={`${item.month}: ₹${item.amount.toLocaleString('en-IN')} (${item.deals} deals)`}
              ></div>

              <div style={{
                marginTop: 8,
                fontSize: '0.76rem',
                fontWeight: 700,
                color: isHighest ? '#FFF' : 'var(--text-secondary)'
              }}>
                {item.month}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
