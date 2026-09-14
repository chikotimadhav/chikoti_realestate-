import React, { useState } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useAgentData();
  const [filterType, setFilterType] = useState('ALL');

  const filtered = notifications.filter(n => {
    if (filterType === 'ALL') return true;
    return n.type === filterType;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'lead': return { icon: 'fa-user-plus', color: 'var(--teal-light)' };
      case 'visit': return { icon: 'fa-calendar-clock', color: '#60A5FA' };
      case 'commission': return { icon: 'fa-wallet', color: 'var(--emerald-neon)' };
      case 'property': return { icon: 'fa-house-chimney', color: 'var(--gold-accent)' };
      case 'announcement': return { icon: 'fa-bullhorn', color: '#C084FC' };
      default: return { icon: 'fa-bell', color: 'var(--text-secondary)' };
    }
  };

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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Notification Center</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Real-time operational alerts, commission approvals, and site visit reminders.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={markAllNotificationsRead}
            className="btn btn-outline btn-sm"
          >
            <i className="fa-solid fa-check-double"></i> Mark All as Read
          </button>

          <button
            onClick={clearNotifications}
            className="btn btn-ghost btn-sm"
            style={{ color: '#F87171' }}
          >
            <i className="fa-solid fa-trash-can"></i> Clear All
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        marginBottom: '1.5rem',
        paddingBottom: '0.5rem'
      }}>
        {['ALL', 'lead', 'visit', 'commission', 'property', 'announcement'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'capitalize',
              background: filterType === cat ? 'rgba(13,148,136,0.2)' : 'var(--bg-surface-elevated)',
              color: filterType === cat ? 'var(--teal-light)' : 'var(--text-secondary)',
              border: filterType === cat ? '1px solid var(--teal-light)' : '1px solid var(--border-color)',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'ALL' ? 'All Alerts' : `${cat}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <i className="fa-regular fa-bell-slash" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
          <p style={{ fontWeight: 700 }}>No notifications in this category</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(item => {
            const { icon, color } = getIcon(item.type);

            return (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                style={{
                  padding: '1.15rem 1.35rem',
                  borderRadius: 'var(--radius-lg)',
                  background: item.read ? 'var(--bg-card)' : 'rgba(13,148,136,0.08)',
                  border: item.read ? '1px solid var(--border-color)' : '1px solid rgba(13,148,136,0.35)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s'
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  <i className={`fa-solid ${icon}`}></i>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFF' }}>{item.title}</span>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        color: color
                      }}>
                        {item.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.timestamp}</span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
