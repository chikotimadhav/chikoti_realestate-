import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function CommissionTable({ commissions }) {
  const { requestCommissionPayout, addToast } = useAgentData();

  const handleDownloadInvoice = (item) => {
    addToast(`Commission Voucher #${item.referenceId || item.id} downloaded`, 'info');
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Property Title</th>
            <th>Client</th>
            <th>Sale Date</th>
            <th>Property Value</th>
            <th>Comm %</th>
            <th>Commission Amount</th>
            <th>Status</th>
            <th>Payment Date / Ref</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map(c => (
            <tr key={c.id}>
              <td>
                <div style={{ fontWeight: 800, color: 'var(--text-main)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.propertyTitle}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {c.id}</div>
              </td>

              <td>
                <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{c.clientName}</div>
              </td>

              <td>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.saleDate}</span>
              </td>

              <td>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#FFF' }}>{c.propertyValue}</span>
              </td>

              <td>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.06)'
                }}>
                  {c.commissionPct}%
                </span>
              </td>

              <td>
                <span style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: c.status === 'Paid' ? 'var(--emerald-neon)' : 'var(--gold-accent)',
                  fontFamily: 'var(--font-display)'
                }}>
                  {c.commissionFormatted}
                </span>
              </td>

              <td>
                <StatusBadge status={c.status} type="commission" />
              </td>

              <td>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.paymentDate}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{c.referenceId}</div>
              </td>

              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {c.status === 'Pending' && (
                    <button
                      onClick={() => requestCommissionPayout(c.id)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                      title="Request Admin Clearance"
                    >
                      <i className="fa-solid fa-paper-plane"></i> Request
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadInvoice(c)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}
                    title="Download Statement"
                  >
                    <i className="fa-solid fa-file-invoice"></i> Voucher
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
