import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function VisitCalendar({ visits, onSelectVisit }) {
  const [currentMonth, setCurrentMonth] = useState('September 2026');

  // Days in September 2026: starts on Tuesday (Sep 1)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <i className="fa-solid fa-calendar-days" style={{ fontSize: '1.25rem', color: 'var(--teal-light)' }}></i>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentMonth}</h3>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className="btn btn-outline btn-sm">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="btn btn-outline btn-sm">Today</button>
          <button className="btn btn-outline btn-sm">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '0.76rem',
        color: 'var(--text-muted)',
        marginBottom: '0.5rem',
        textTransform: 'uppercase'
      }}>
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Days Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0.4rem',
        minHeight: 440
      }}>
        {/* Sep 1, 2026 is Tuesday -> 2 empty offsets (Sun, Mon) */}
        <div style={{ background: 'transparent' }}></div>
        <div style={{ background: 'transparent' }}></div>

        {daysInMonth.map(day => {
          const dayStr = `2026-09-${day < 10 ? '0' + day : day}`;
          const dayVisits = visits.filter(v => v.date === dayStr);
          const isToday = day === 14;

          return (
            <div
              key={day}
              style={{
                minHeight: 78,
                borderRadius: 'var(--radius-sm)',
                background: isToday ? 'rgba(13,148,136,0.1)' : 'var(--bg-surface-elevated)',
                border: isToday ? '2px solid var(--teal-light)' : '1px solid var(--border-subtle)',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontWeight: isToday ? 900 : 600,
                color: isToday ? 'var(--emerald-neon)' : 'var(--text-secondary)'
              }}>
                <span>{day}</span>
                {isToday && (
                  <span style={{ fontSize: '0.62rem', background: 'var(--emerald-neon)', color: '#000', padding: '0 4px', borderRadius: 4 }}>
                    TODAY
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 4 }}>
                {dayVisits.map(v => (
                  <div
                    key={v.id}
                    onClick={() => onSelectVisit(v)}
                    style={{
                      padding: '2px 5px',
                      borderRadius: 4,
                      background: v.status === 'Confirmed' ? 'rgba(34,197,94,0.2)' : 'rgba(59,130,246,0.2)',
                      border: `1px solid ${v.status === 'Confirmed' ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.4)'}`,
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: v.status === 'Confirmed' ? 'var(--emerald-neon)' : '#60A5FA',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={`${v.time} - ${v.clientName} (${v.propertyTitle})`}
                  >
                    {v.time.split(' ')[0]} {v.clientName.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
