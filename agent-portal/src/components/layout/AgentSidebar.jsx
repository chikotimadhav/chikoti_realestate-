import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function AgentSidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) {
  const { currentAgent, logout } = useAuth();
  const { leads, visits, notifications } = useAgentData();

  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;
  const todayVisitsCount = visits.filter(v => v.status === 'Scheduled' || v.status === 'Confirmed').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-solid fa-grid-2', badge: null },
    { id: 'leads', label: 'Leads', icon: 'fa-solid fa-user-group', badge: newLeadsCount > 0 ? newLeadsCount : null },
    { id: 'properties', label: 'Properties', icon: 'fa-solid fa-building-circle-check', badge: null },
    { id: 'clients', label: 'Clients', icon: 'fa-solid fa-address-book', badge: null },
    { id: 'visits', label: 'Site Visits', icon: 'fa-solid fa-calendar-check', badge: todayVisitsCount > 0 ? todayVisitsCount : null },
    { id: 'bookings', label: 'Bookings', icon: 'fa-solid fa-handshake-simple', badge: null },
    { id: 'earnings', label: 'My Earnings', icon: 'fa-solid fa-wallet', badge: null },
    { id: 'performance', label: 'Performance', icon: 'fa-solid fa-chart-line-up', badge: null },
    { id: 'notifications', label: 'Notifications', icon: 'fa-solid fa-bell', badge: unreadNotifsCount > 0 ? unreadNotifsCount : null },
    { id: 'profile', label: 'Profile & RERA', icon: 'fa-solid fa-id-badge', badge: currentAgent?.status === 'Under Review' ? 'Review' : null },
    { id: 'support', label: 'Support Desk', icon: 'fa-solid fa-headset', badge: null }
  ];

  return (
    <aside className={`agent-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-logo">E</div>
        {!isCollapsed && (
          <div className="sidebar-brand-text">
            <h2>EstateHub</h2>
            <span>AGENT PORTAL</span>
          </div>
        )}
      </div>

      {/* Ecosystem switcher badge */}
      {!isCollapsed && (
        <div style={{
          padding: '0.45rem 0.75rem',
          margin: '0 0.25rem 1rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.74rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Ecosystem:</span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <a 
              href="http://localhost:3001" 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: 'var(--teal-light)', fontWeight: 700 }}
              title="Open Buyer Portal"
            >
              Buyer ↗
            </a>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <a 
              href="http://localhost:3002" 
              target="_blank" 
              rel="noreferrer" 
              style={{ color: 'var(--teal-light)', fontWeight: 700 }}
              title="Open Seller Portal"
            >
              Seller ↗
            </a>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <nav className="sidebar-nav-list">
        {NAV_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrap">
                <i className={item.icon}></i>
              </div>
              {!isCollapsed && <span>{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className={`nav-badge ${item.id === 'notifications' ? 'danger' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div 
            className="sidebar-agent-pill" 
            onClick={() => onTabChange('profile')} 
            style={{ cursor: 'pointer' }}
            title="View Profile & Verification"
          >
            <img 
              src={currentAgent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128'} 
              alt={currentAgent?.name} 
              className="sidebar-agent-avatar" 
            />
            <div className="sidebar-agent-info">
              <div className="sidebar-agent-name">{currentAgent?.name || 'Agent'}</div>
              <div className="sidebar-agent-role">
                <i className="fa-solid fa-badge-check" style={{ color: currentAgent?.status === 'Approved' ? 'var(--emerald-neon)' : 'var(--gold-accent)' }}></i>
                <span>{currentAgent?.status === 'Approved' ? 'Verified Agent' : 'Under Review'}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="sidebar-nav-item"
          style={{ color: '#F87171', marginTop: '0.25rem' }}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <div className="nav-icon-wrap">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
