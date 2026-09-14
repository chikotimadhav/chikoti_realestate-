import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function VisitList({ visits, onSelectVisit }) {
  const { updateVisitStatus, addToast } = useAgentData();

  if (!visits || visits.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-calendar-xmark" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
        <p style={{ fontWeight: 700, fontSize: '1rem' }}>No site visits found</p>
      </div>
    );
  }

  const handleSendReminder = (visit) => {
    const cleanPhone = visit.clientPhone ? visit.clientPhone.replace(/\D/g, '') : '919849055112';
    const msg = encodeURIComponent(
      `Reminder from EstateHub: Your site visit for ${visit.propertyTitle} is scheduled for ${visit.date} at ${visit.time}. Looking forward to hosting you!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    addToast(`Visit reminder dispatched to ${visit.clientName}`, 'success');
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Property</th>
            <th>Date & Slot</th>
            <th>Location</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Quick Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map(v => (
            <tr key={v.id}>
              <td>
                <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{v.clientName}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{v.clientPhone || '—'}</div>
              </td>

              <td>
                <div style={{ fontWeight: 700, color: 'var(--teal-light)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.propertyTitle}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Agent: {v.agentName}</div>
              </td>

              <td>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{v.date}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-regular fa-clock" style={{ marginRight: 4 }}></i>
                  {v.time}
                </div>
              </td>

              <td>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{v.location}</span>
              </td>

              <td>
                <StatusBadge status={v.status} type="visit" />
              </td>

              <td style={{ maxWidth: 220 }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {v.notes || 'No specific notes'}
                </span>
              </td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {v.status === 'Scheduled' && (
                    <button
                      onClick={() => updateVisitStatus(v.id, 'Confirmed')}
                      className="btn btn-neon btn-sm"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      title="Confirm Visit"
                    >
                      <i className="fa-solid fa-check"></i> Confirm
                    </button>
                  )}

                  {v.status === 'Confirmed' && (
                    <button
                      onClick={() => updateVisitStatus(v.id, 'Completed')}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      title="Mark Completed"
                    >
                      <i className="fa-solid fa-flag-checkered"></i> Done
                    </button>
                  )}

                  <button
                    onClick={() => handleSendReminder(v)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(34,197,94,0.15)',
                      color: 'var(--emerald-neon)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}
                    title="Send WhatsApp Reminder"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                  </button>

                  <select
                    value={v.status}
                    onChange={(e) => updateVisitStatus(v.id, e.target.value)}
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.25rem 0.4rem',
                      fontSize: '0.72rem'
                    }}
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
