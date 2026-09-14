import React from 'react';

export default function ClientTable({ clients, onSelectClient, onDeleteClient }) {
  if (!clients || clients.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-address-book" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
        <p style={{ fontWeight: 700, fontSize: '1rem' }}>No clients found</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Contact Details</th>
            <th>Budget & Type</th>
            <th>Preferred Locations</th>
            <th>Status</th>
            <th>Next Follow-up</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => {
            const cleanPhone = c.phone.replace(/\D/g, '');
            const waMsg = encodeURIComponent(`Hello ${c.name}, hope you are doing well. This is your EstateHub representative.`);

            return (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.id}</div>
                </td>

                <td>
                  <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{c.phone}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{c.email || '—'}</div>
                </td>

                <td>
                  <div style={{ color: 'var(--emerald-neon)', fontWeight: 800 }}>{c.budget}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{c.propertyType}</div>
                </td>

                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{c.preferredLocation}</span>
                </td>

                <td>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: 'rgba(13,148,136,0.15)',
                    color: 'var(--teal-light)'
                  }}>
                    {c.status || 'Active'}
                  </span>
                </td>

                <td>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.nextFollowUp || 'In 3 days'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last: {c.lastContact}</div>
                </td>

                <td>
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
                      title="WhatsApp"
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                    </a>

                    <a
                      href={`tel:${c.phone}`}
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
                      title="Call"
                    >
                      <i className="fa-solid fa-phone"></i>
                    </a>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete client record for ${c.name}?`)) {
                          onDeleteClient(c.id);
                        }
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#F87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem'
                      }}
                      title="Delete Client"
                    >
                      <i className="fa-solid fa-trash-can"></i>
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
