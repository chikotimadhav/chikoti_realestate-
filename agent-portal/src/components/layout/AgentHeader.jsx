import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function AgentHeader({ activeTab, onTabChange, onOpenAddLead, onOpenScheduleVisit }) {
  const { currentAgent, agents, switchDemoAgent, logout } = useAuth();
  const { 
    theme, 
    toggleTheme, 
    notifications, 
    markNotificationRead, 
    setIsSearchOpen,
    dbStatus,
    dbInfo
  } = useAgentData();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAgentMenu, setShowAgentMenu] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="agent-header">
      {/* Left: Dynamic Island Capsule (Inspired directly by user reference monitor!) */}
      <div className="dynamic-island-capsule" style={{ display: 'flex' }}>
        <div 
          className="capsule-badge-zoom" 
          style={{ 
            background: dbStatus === 'connected' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            borderColor: dbStatus === 'connected' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(245, 158, 11, 0.35)',
            color: dbStatus === 'connected' ? 'var(--emerald-neon)' : 'var(--gold-accent)'
          }}
          title={`Connected to shared database (${dbInfo?.db || 'MongoDB'}) at ${dbInfo?.host || 'chikoti-realestate.onrender.com'}`}
        >
          <span 
            className="pulse-dot" 
            style={{ 
              background: dbStatus === 'connected' ? 'var(--emerald-neon)' : 'var(--gold-accent)',
              boxShadow: `0 0 8px ${dbStatus === 'connected' ? 'var(--emerald-neon)' : 'var(--gold-accent)'}`
            }}
          ></span>
          <i className="fa-solid fa-database" style={{ fontSize: '0.7rem' }}></i>
          <span>{dbStatus === 'connected' ? 'Database: Live' : 'Database: Connecting...'}</span>
        </div>

        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.1)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-shield-check" style={{ color: 'var(--emerald-neon)' }}></i>
          <span>RERA: Active</span>
        </div>

        <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.1)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--gold-accent)' }}>
          <i className="fa-solid fa-coins"></i>
          <span>Commission: <strong>₹2,45,000</strong></span>
        </div>
      </div>

      {/* Global Search Button */}
      <button 
        className="header-search-btn"
        onClick={() => setIsSearchOpen(true)}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Search leads, clients, properties...</span>
        <span className="search-kbd">Ctrl K</span>
      </button>

      {/* Right Action Controls */}
      <div className="header-actions">
        {/* Quick Add Button */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowQuickAdd(prev => !prev)}
          >
            <i className="fa-solid fa-plus"></i>
            <span style={{ display: 'none', '@media (min-width: 600px)': { display: 'inline' } }}>Quick Action</span>
          </button>

          {showQuickAdd && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 220,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 200,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  transition: 'background 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--table-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowQuickAdd(false); onOpenAddLead(); }}
              >
                <i className="fa-solid fa-user-plus" style={{ color: 'var(--teal-light)' }}></i>
                <span>+ Add New Lead</span>
              </button>

              <button
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  transition: 'background 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--table-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowQuickAdd(false); onOpenScheduleVisit(); }}
              >
                <i className="fa-solid fa-calendar-plus" style={{ color: 'var(--emerald-neon)' }}></i>
                <span>+ Schedule Site Visit</span>
              </button>

              <button
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  transition: 'background 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--table-hover)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => { setShowQuickAdd(false); onTabChange('properties'); }}
              >
                <i className="fa-solid fa-share-nodes" style={{ color: 'var(--gold-accent)' }}></i>
                <span>Share Property Link</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button 
          className="header-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <i className="fa-solid fa-sun" style={{ color: 'var(--gold-accent)' }}></i>
          ) : (
            <i className="fa-solid fa-moon" style={{ color: 'var(--teal-primary)' }}></i>
          )}
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="header-icon-btn"
            onClick={() => setShowNotifMenu(prev => !prev)}
            title="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
            {unreadCount > 0 && <span className="header-icon-badge">{unreadCount}</span>}
          </button>

          {showNotifMenu && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 340,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 200,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800 }}>Notifications</h4>
                <button 
                  onClick={() => { setShowNotifMenu(false); onTabChange('notifications'); }}
                  style={{ fontSize: '0.75rem', color: 'var(--teal-light)', fontWeight: 700 }}
                >
                  View All ↗
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 260, overflowY: 'auto' }}>
                {notifications.slice(0, 4).map(n => (
                  <div 
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    style={{
                      padding: '0.5rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      background: n.read ? 'transparent' : 'rgba(13,148,136,0.08)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: n.read ? 'var(--text-secondary)' : '#FFF' }}>{n.title}</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Agent Profile & Demo Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAgentMenu(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              transition: 'border-color 0.15s'
            }}
          >
            <img 
              src={currentAgent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128'} 
              alt={currentAgent?.name} 
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} 
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentAgent?.name?.split(' ')[0] || 'Agent'}
            </span>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}></i>
          </button>

          {showAgentMenu && (
            <div style={{
              position: 'absolute',
              top: '120%',
              right: 0,
              width: 280,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: '1rem',
              zIndex: 200,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{currentAgent?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentAgent?.email}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--emerald-neon)', fontWeight: 700, marginTop: 4 }}>
                  {currentAgent?.agencyName} • {currentAgent?.reraNumber}
                </div>
              </div>

              {/* Demo Account Switcher */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Switch Demo Agent
                </div>
                {agents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { switchDemoAgent(a.id); setShowAgentMenu(false); }}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-sm)',
                      background: a.id === currentAgent?.id ? 'rgba(13,148,136,0.15)' : 'transparent',
                      color: a.id === currentAgent?.id ? 'var(--teal-light)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      marginBottom: 2
                    }}
                  >
                    <span>{a.name} ({a.status})</span>
                    {a.id === currentAgent?.id && <i className="fa-solid fa-check" style={{ fontSize: '0.7rem' }}></i>}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => { setShowAgentMenu(false); onTabChange('profile'); }}
                  style={{
                    padding: '0.4rem 0.6rem',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <i className="fa-solid fa-user-gear" style={{ marginRight: 8, color: 'var(--teal-light)' }}></i>
                  Agent Profile & Verification
                </button>

                <button
                  onClick={logout}
                  style={{
                    padding: '0.4rem 0.6rem',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: '#F87171',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <i className="fa-solid fa-arrow-right-from-bracket" style={{ marginRight: 8 }}></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
