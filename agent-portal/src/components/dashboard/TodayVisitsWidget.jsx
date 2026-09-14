import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function TodayVisitsWidget({ visits, onNavigateVisits, onOpenScheduleVisit }) {
  const upcoming = visits.filter(v => v.status === 'Scheduled' || v.status === 'Confirmed').slice(0, 3);

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-title-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="card-title">Today's Visits</span>
          <span style={{
            fontSize: '0.72rem',
            padding: '0.15rem 0.55rem',
            borderRadius: 999,
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60A5FA',
            fontWeight: 800
          }}>
            {upcoming.length} Scheduled
          </span>
        </div>

        <button 
          onClick={onNavigateVisits}
          style={{ fontSize: '0.78rem', color: 'var(--teal-light)', fontWeight: 700 }}
        >
          Calendar ↗
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '1.8rem', marginBottom: '0.5rem', display: 'block' }}></i>
            No more visits scheduled for today.
          </div>
        ) : (
          upcoming.map(v => (
            <div
              key={v.id}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'transform 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  {v.clientName}
                </span>
                <StatusBadge status={v.status} type="visit" />
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="fa-solid fa-building" style={{ color: 'var(--teal-light)' }}></i>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.propertyTitle}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                <span><i className="fa-regular fa-clock" style={{ marginRight: 4 }}></i>{v.time} • {v.date}</span>
                <a
                  href={`https://wa.me/${v.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${v.clientName}, looking forward to our site visit today at ${v.time} for ${v.propertyTitle}. Let me know if you need location directions.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--emerald-neon)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  <i className="fa-brands fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onOpenScheduleVisit}
        className="btn btn-outline btn-sm"
        style={{ width: '100%', marginTop: '1rem', borderRadius: 'var(--radius-md)' }}
      >
        <i className="fa-solid fa-calendar-plus"></i>
        <span>Schedule New Visit</span>
      </button>
    </div>
  );
}
