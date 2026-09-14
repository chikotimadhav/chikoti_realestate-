import React, { useState } from 'react';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function MobileNav({ activeTab, onTabChange }) {
  const { leads, visits } = useAgentData();
  const [showDrawer, setShowDrawer] = useState(false);

  const newLeads = leads.filter(l => l.status === 'NEW').length;

  const PRIMARY_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-grid-2' },
    { id: 'leads', label: 'Leads', icon: 'fa-solid fa-user-group', count: newLeads },
    { id: 'properties', label: 'Properties', icon: 'fa-solid fa-building-circle-check' },
    { id: 'visits', label: 'Visits', icon: 'fa-solid fa-calendar-check' },
    { id: 'earnings', label: 'Earnings', icon: 'fa-solid fa-wallet' }
  ];

  const SECONDARY_ITEMS = [
    { id: 'clients', label: 'Clients CRM', icon: 'fa-solid fa-address-book' },
    { id: 'bookings', label: 'Bookings', icon: 'fa-solid fa-handshake-simple' },
    { id: 'performance', label: 'Performance Analytics', icon: 'fa-solid fa-chart-line-up' },
    { id: 'notifications', label: 'Notifications', icon: 'fa-solid fa-bell' },
    { id: 'profile', label: 'Profile & RERA Verification', icon: 'fa-solid fa-id-badge' },
    { id: 'support', label: 'Support Desk', icon: 'fa-solid fa-headset' }
  ];

  return (
    <>
      <nav className="mobile-bottom-nav">
        {PRIMARY_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
            >
              <div style={{ position: 'relative' }}>
                <i className={item.icon}></i>
                {item.count > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'var(--emerald-neon)',
                    color: '#000',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.count}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* More drawer trigger */}
        <button
          className={`mobile-nav-btn ${showDrawer ? 'active' : ''}`}
          onClick={() => setShowDrawer(prev => !prev)}
        >
          <i className="fa-solid fa-bars"></i>
          <span>More</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {showDrawer && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'flex-end'
          }}
          onClick={() => setShowDrawer(false)}
        >
          <div 
            style={{
              width: '100%',
              background: 'var(--bg-surface-elevated)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderTop: '1px solid var(--border-color)',
              padding: '1.5rem 1.25rem 2.5rem',
              animation: 'scaleUp 0.2s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>EstateHub Agent Menu</div>
              <button 
                onClick={() => setShowDrawer(false)}
                style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {SECONDARY_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { onTabChange(item.id); setShowDrawer(false); }}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === item.id ? 'rgba(13,148,136,0.15)' : 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: activeTab === item.id ? 'var(--teal-light)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.84rem'
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
