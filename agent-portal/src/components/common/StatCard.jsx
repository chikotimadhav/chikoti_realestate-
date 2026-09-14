import React from 'react';

export default function StatCard({ 
  label, 
  value, 
  delta, 
  deltaType = 'up', 
  deltaPeriod = '', 
  icon, 
  iconBg = 'rgba(13,148,136,0.15)',
  iconColor = 'var(--teal-light)',
  onClick
}) {
  return (
    <div 
      className="stat-metric-card" 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <div className="stat-icon-wrap" style={{ background: iconBg, color: iconColor }}>
          <i className={icon}></i>
        </div>
      </div>

      <div className="stat-val">{value}</div>

      <div className="stat-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className={`stat-delta ${deltaType}`}>
          {deltaType === 'up' && <i className="fa-solid fa-arrow-trend-up"></i>}
          {deltaType === 'down' && <i className="fa-solid fa-arrow-trend-down"></i>}
          {deltaType === 'neutral' && <i className="fa-solid fa-clock"></i>}
          <span>{delta}</span>
        </div>
        {deltaPeriod && (
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{deltaPeriod}</span>
        )}
      </div>
    </div>
  );
}
