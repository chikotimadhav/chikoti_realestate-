import React, { useState } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import StatCard from '../components/common/StatCard.jsx';
import EarningsChart from '../components/earnings/EarningsChart.jsx';
import CommissionTable from '../components/earnings/CommissionTable.jsx';
import Modal from '../components/common/Modal.jsx';

export default function EarningsPage() {
  const { commissions, addToast } = useAgentData();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const handleRequestPayout = (e) => {
    e.preventDefault();
    addToast('Commission withdrawal request for ₹85,000 submitted to Finance Desk', 'success');
    setIsPayoutModalOpen(false);
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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>My Earnings & Commissions</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Transparent commission statements, TDS reports, and scheduled payout clearances.
          </p>
        </div>

        <button
          onClick={() => setIsPayoutModalOpen(true)}
          className="btn btn-neon"
        >
          <i className="fa-solid fa-money-bill-transfer"></i>
          <span>Request Payout</span>
        </button>
      </div>

      {/* 4 Summary Cards from Requirement 9 */}
      <div className="stat-card-grid">
        <StatCard
          label="Total Earnings"
          value="₹14,85,000"
          delta="Lifetime"
          deltaType="up"
          deltaPeriod="28 closed sales"
          icon="fa-solid fa-vault"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
        />

        <StatCard
          label="This Month (Sep)"
          value="₹2,45,000"
          delta="+22% MoM"
          deltaType="up"
          deltaPeriod="3 active deals"
          icon="fa-solid fa-calendar-star"
          iconBg="rgba(13,148,136,0.18)"
          iconColor="var(--teal-light)"
        />

        <StatCard
          label="Pending Clearance"
          value="₹85,000"
          delta="1 milestone"
          deltaType="neutral"
          deltaPeriod="Under review"
          icon="fa-solid fa-hourglass-half"
          iconBg="rgba(245,158,11,0.18)"
          iconColor="var(--gold-accent)"
        />

        <StatCard
          label="Paid to Bank"
          value="₹12,00,000"
          delta="✓ Verified"
          deltaType="up"
          deltaPeriod="Direct NEFT/RTGS"
          icon="fa-solid fa-circle-check"
          iconBg="rgba(59,130,246,0.18)"
          iconColor="#60A5FA"
        />
      </div>

      {/* Monthly Chart */}
      <EarningsChart />

      {/* Commission History Table Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Commission Ledger & Transaction History</h3>
        <button 
          onClick={() => addToast('Full tax ledger & Form 16A downloaded', 'info')}
          className="btn btn-outline btn-sm"
        >
          <i className="fa-solid fa-file-excel"></i> Export Ledger
        </button>
      </div>

      {/* History Table */}
      <CommissionTable commissions={commissions} />

      {/* Payout Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Commission Payout Clearance"
        maxWidth="540px"
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsPayoutModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-neon btn-sm" onClick={handleRequestPayout}>
              <i className="fa-solid fa-paper-plane"></i> Submit Request
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Eligible Payout Balance</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--emerald-neon)' }}>₹85,000</div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              From Deal: Silver Pines Commercial Unit 4B (Milestone 1 Advance)
            </p>
          </div>

          <div style={{ padding: '0.85rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Registered Disbursal Bank Account</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF', marginTop: 2 }}>
              HDFC Bank • A/C No: •••• •••• 8841 (IFSC: HDFC0000240)
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payout Remarks / Reference</label>
            <input
              type="text"
              className="form-input"
              defaultValue="Standard monthly commission withdrawal"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
