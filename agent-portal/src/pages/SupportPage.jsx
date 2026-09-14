import React, { useState } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import { FAQS } from '../data/mockData.js';
import Modal from '../components/common/Modal.jsx';

export default function SupportPage() {
  const { tickets, createTicket } = useAgentData();

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Commission & Payments',
    priority: 'Medium',
    description: ''
  });

  const [faqSearch, setFaqSearch] = useState('');

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.description) {
      alert('Please complete subject and description');
      return;
    }
    createTicket(ticketForm);
    setIsTicketModalOpen(false);
    setTicketForm({
      subject: '',
      category: 'Commission & Payments',
      priority: 'Medium',
      description: ''
    });
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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Agent Support Desk</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Get prompt assistance with escrow clearances, RERA updates, or listing approvals.
          </p>
        </div>

        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-ticket"></i>
          <span>+ Raise Support Ticket</span>
        </button>
      </div>

      {/* Emergency Help Contact Banner */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(15,23,42,0.8))',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Need Urgent Assistance with a Closing?</h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Dedicated Agent Relationship Desk is live 9:00 AM – 8:00 PM IST Monday through Saturday.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a
            href="https://wa.me/919876543210?text=Hello%20EstateHub%20Support,%20I%20am%20an%20agent%20needing%20assistance."
            target="_blank"
            rel="noreferrer"
            className="btn btn-neon btn-sm"
          >
            <i className="fa-brands fa-whatsapp"></i> Chat Support
          </a>

          <a
            href="tel:+919876543210"
            className="btn btn-outline btn-sm"
          >
            <i className="fa-solid fa-phone"></i> +91 98765 43210
          </a>
        </div>
      </div>

      {/* Existing Tickets */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>My Support Tickets</h3>
        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No support tickets raised yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tickets.map(t => (
              <div
                key={t.id}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.95rem' }}>{t.subject}</span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      background: t.status === 'Resolved' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                      color: t.status === 'Resolved' ? 'var(--emerald-neon)' : '#60A5FA'
                    }}>
                      {t.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    #{t.id} • Category: {t.category} • Priority: {t.priority} • Filed on {t.createdAt}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: 6 }}>{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div className="card-title-row">
          <span className="card-title">Agent Knowledgebase & FAQs</span>
          <div style={{ position: 'relative', width: 260 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search FAQs..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--teal-light)' }}>
                {faq.q}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Raise Agent Support Ticket"
        maxWidth="600px"
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsTicketModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSubmitTicket}>
              <i className="fa-solid fa-paper-plane"></i> Submit Ticket
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitTicket}>
          <div className="form-group">
            <label className="form-label">Ticket Subject *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Commission disbursal delay for Deal #401"
              value={ticketForm.subject}
              onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
              >
                <option value="Commission & Payments">Commission & Payments</option>
                <option value="Property Information">Property Information</option>
                <option value="RERA & Legal Compliance">RERA & Legal Compliance</option>
                <option value="Lead Assignment">Lead Assignment</option>
                <option value="Technical Issue">Technical Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent (Deal At Risk)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              required
              rows="4"
              className="form-textarea"
              placeholder="Provide all relevant deal numbers, client names, and specific context..."
              value={ticketForm.description}
              onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
            ></textarea>
          </div>
        </form>
      </Modal>
    </div>
  );
}
