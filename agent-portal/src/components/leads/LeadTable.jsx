import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function LeadTable({ leads, onSelectLead }) {
  if (!leads || leads.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-users-slash" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
        <p style={{ fontWeight: 700, fontSize: '1rem' }}>No leads found</p>
        <span style={{ fontSize: '0.84rem' }}>Try adjusting your search query or filters.</span>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Interested Property</th>
            <th>Budget & Loc</th>
            <th>Source</th>
            <th>Status</th>
            <th>Follow-up</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => {
            const cleanPhone = lead.phone.replace(/\D/g, '');
            const waMsg = encodeURIComponent(`Hello ${lead.customerName}, following up regarding ${lead.interestedPropertyTitle}.`);

            return (
              <tr key={lead.id} onClick={() => onSelectLead(lead)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{lead.customerName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lead.id}</div>
                </td>

                <td>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{lead.phone}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{lead.email || '—'}</div>
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--teal-light)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.interestedPropertyTitle}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Agent: {lead.assignedAgent}</div>
                </td>

                <td>
                  <div style={{ color: 'var(--emerald-neon)', fontWeight: 800 }}>{lead.budget}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{lead.location}</div>
                </td>

                <td>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{lead.source}</span>
                </td>

                <td>
                  <StatusBadge status={lead.status} type="lead" />
                </td>

                <td>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{lead.nextFollowUp}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Last: {lead.lastContact}</div>
                </td>

                <td onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${waMsg}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(34, 197, 94, 0.15)',
                        color: 'var(--emerald-neon)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                      title="WhatsApp Chat"
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>

                    <a
                      href={`tel:${lead.phone}`}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(13, 148, 136, 0.15)',
                        color: 'var(--teal-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                      title="Call Phone"
                    >
                      <i className="fa-solid fa-phone"></i>
                    </a>

                    <button
                      onClick={() => onSelectLead(lead)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                      title="View Details"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
