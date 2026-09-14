import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LeadDetailModal({ lead, isOpen, onClose, onScheduleVisitForLead }) {
  const { updateLeadStatus, addLeadNote, deleteLead } = useAgentData();
  const { currentAgent } = useAuth();
  const [newNote, setNewNote] = useState('');

  if (!lead) return null;

  const LEAD_STATUSES = [
    'NEW',
    'CONTACTED',
    'QUALIFIED',
    'SITE VISIT',
    'NEGOTIATION',
    'BOOKED',
    'CLOSED',
    'LOST'
  ];

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote);
    setNewNote('');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${lead.customerName},\n\nThis is ${currentAgent?.name || 'your EstateHub Agent'} from EstateHub. I am reaching out regarding your inquiry for *${lead.interestedPropertyTitle}*.\n\nI would be happy to share the complete brochure, floor plans, and arrange a private site visit at your convenience. When would be a good time to connect?\n\nWarm regards,\n${currentAgent?.name || 'EstateHub Agent'}\n${currentAgent?.agencyName || 'EstateHub Real Estate'}`
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lead Details: ${lead.customerName}`}
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: '#F87171', borderColor: 'rgba(239,68,68,0.3)' }}
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove lead for ${lead.customerName}?`)) {
                deleteLead(lead.id);
                onClose();
              }
            }}
          >
            <i className="fa-solid fa-trash"></i> Delete Lead
          </button>

          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      }
    >
      {/* Top Header Card */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{lead.customerName}</h3>
              <StatusBadge status={lead.status} type="lead" />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              Lead ID: <strong>{lead.id}</strong> • Source: <strong>{lead.source}</strong>
            </div>
          </div>

          {/* Quick Action Channels */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-neon btn-sm"
              title="Open WhatsApp Chat"
            >
              <i className="fa-brands fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${lead.phone}`}
              className="btn btn-primary btn-sm"
              title="Direct Phone Call"
            >
              <i className="fa-solid fa-phone"></i>
              <span>Call</span>
            </a>

            {lead.email && (
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`EstateHub: Information regarding ${lead.interestedPropertyTitle}`)}`}
                className="btn btn-outline btn-sm"
                title="Send Email"
              >
                <i className="fa-solid fa-envelope"></i>
              </a>
            )}

            <button
              onClick={() => {
                onClose();
                if (onScheduleVisitForLead) onScheduleVisitForLead(lead);
              }}
              className="btn btn-gold btn-sm"
              title="Schedule Site Visit"
            >
              <i className="fa-solid fa-calendar-plus"></i>
              <span>Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Lead Attributes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>{lead.phone}</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Email</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {lead.email || 'Not Provided'}
          </div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Target Budget</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--emerald-neon)', marginTop: 2 }}>{lead.budget}</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: 2 }}>{lead.location}</div>
        </div>
      </div>

      {/* Property & Pipeline Status Controls */}
      <div className="form-row-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Interested Property</label>
          <div style={{
            padding: '0.65rem 0.9rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.88rem'
          }}>
            <i className="fa-solid fa-house-chimney" style={{ color: 'var(--teal-light)', marginRight: 6 }}></i>
            {lead.interestedPropertyTitle}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Change Pipeline Status</label>
          <select
            className="form-select"
            value={lead.status}
            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
          >
            {LEAD_STATUSES.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Follow-up Tracking */}
      <div style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        fontSize: '0.84rem'
      }}>
        <div>
          <i className="fa-solid fa-bell" style={{ color: 'var(--gold-accent)', marginRight: 6 }}></i>
          <span>Next Follow-up: <strong>{lead.nextFollowUp}</strong></span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          Last Contact: {lead.lastContact}
        </span>
      </div>

      {/* Notes & Activity Log */}
      <div className="form-group">
        <label className="form-label">Lead Activity Notes & History</label>
        <div style={{
          maxHeight: 140,
          overflowY: 'auto',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1rem',
          fontSize: '0.84rem',
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          marginBottom: '0.75rem'
        }}>
          {lead.notes || 'No notes logged yet.'}
        </div>

        <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type a new follow-up note (e.g. Call completed, requested 10% discount)..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <i className="fa-solid fa-comment-plus"></i> Add
          </button>
        </form>
      </div>
    </Modal>
  );
}
