import React from 'react';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function Toast() {
  const { toasts } = useAgentData();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => {
        let icon = 'fa-check-circle';
        let color = 'var(--emerald-neon)';
        if (t.type === 'error') {
          icon = 'fa-triangle-exclamation';
          color = '#F87171';
        } else if (t.type === 'info') {
          icon = 'fa-circle-info';
          color = '#60A5FA';
        }

        return (
          <div key={t.id} className="toast-item">
            <i className={`fa-solid ${icon}`} style={{ color, fontSize: '1.1rem' }}></i>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
