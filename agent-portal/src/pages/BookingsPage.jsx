import React, { useState } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import Modal from '../components/common/Modal.jsx';

export default function BookingsPage() {
  const { bookings, addToast } = useAgentData();
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleDownloadReceipt = (booking) => {
    addToast(`Official Token Receipt #${booking.id} downloaded (PDF)`, 'success');
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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Deal Bookings</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Track sales milestones, token advances, and commission allocations from executed deals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.4rem 1rem',
            borderRadius: 999,
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: 'var(--emerald-neon)',
            fontSize: '0.82rem',
            fontWeight: 800
          }}>
            <i className="fa-solid fa-lock" style={{ marginRight: 6 }}></i>
            Escrow Protected
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Client Details</th>
              <th>Property</th>
              <th>Booking Date</th>
              <th>Property Value</th>
              <th>Token Amount</th>
              <th>Agent Commission</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--teal-light)' }}>
                    #{b.id}
                  </span>
                </td>

                <td>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{b.clientName}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{b.clientPhone}</div>
                </td>

                <td>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.propertyTitle}
                  </div>
                </td>

                <td>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{b.bookingDate}</span>
                </td>

                <td>
                  <span style={{ fontWeight: 700, color: '#FFF' }}>{b.propertyValueFormatted}</span>
                </td>

                <td>
                  <span style={{ color: 'var(--emerald-neon)', fontWeight: 800 }}>{b.bookingTokenFormatted}</span>
                </td>

                <td>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: 'var(--emerald-neon)'
                  }}>
                    {b.agentCommissionFormatted}
                  </span>
                </td>

                <td>
                  <StatusBadge status={b.status} type="commission" />
                </td>

                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleDownloadReceipt(b)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.74rem' }}
                      title="Download Booking Token Receipt"
                    >
                      <i className="fa-solid fa-receipt"></i> Receipt
                    </button>
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.74rem' }}
                      title="View Details"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Dossier #${selectedBooking.id}`}
          maxWidth="600px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => handleDownloadReceipt(selectedBooking)}>
                <i className="fa-solid fa-file-pdf"></i> Download Agreement & Receipt
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</span>
                <StatusBadge status={selectedBooking.status} type="commission" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{selectedBooking.propertyTitle}</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Client: {selectedBooking.clientName} ({selectedBooking.clientPhone})
              </p>
            </div>

            <div className="form-row-2">
              <div style={{ padding: '0.85rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Property Agreed Value</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>{selectedBooking.propertyValueFormatted}</div>
              </div>
              <div style={{ padding: '0.85rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Token Advance Paid</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald-neon)' }}>{selectedBooking.bookingTokenFormatted}</div>
              </div>
            </div>

            <div style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Your Allocated Commission</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--emerald-neon)' }}>
                  {selectedBooking.agentCommissionFormatted}
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Disbursement: 7 days post sale deed
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
