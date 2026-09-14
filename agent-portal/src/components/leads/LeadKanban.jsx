import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function LeadKanban({ leads, onSelectLead, onAdvanceStage }) {
  const STAGES = [
    { key: 'NEW', title: 'New Leads', icon: 'fa-sparkles', color: '#60A5FA' },
    { key: 'CONTACTED', title: 'Contacted', icon: 'fa-phone', color: '#FBBF24' },
    { key: 'QUALIFIED', title: 'Qualified', icon: 'fa-circle-check', color: '#C084FC' },
    { key: 'SITE VISIT', title: 'Site Visit', icon: 'fa-calendar-check', color: '#2DD4BF' },
    { key: 'NEGOTIATION', title: 'Negotiation', icon: 'fa-handshake', color: '#FB923C' },
    { key: 'BOOKED', title: 'Booked Token', icon: 'fa-file-signature', color: '#4ADE80' },
    { key: 'CLOSED', title: 'Closed Won', icon: 'fa-trophy', color: '#34D399' },
    { key: 'LOST', title: 'Lost', icon: 'fa-circle-xmark', color: '#F87171' }
  ];

  return (
    <div className="kanban-board">
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage.key);

        return (
          <div key={stage.key} className="kanban-col">
            <div className="kanban-col-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }}></span>
                <span style={{ fontWeight: 800, fontSize: '0.84rem' }}>{stage.title}</span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'rgba(255,255,255,0.06)',
                padding: '0.1rem 0.45rem',
                borderRadius: 999,
                color: 'var(--text-secondary)'
              }}>
                {stageLeads.length}
              </span>
            </div>

            <div className="kanban-col-cards">
              {stageLeads.length === 0 ? (
                <div style={{
                  padding: '1.5rem 0.5rem',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--border-subtle)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  No leads in {stage.title}
                </div>
              ) : (
                stageLeads.map(lead => (
                  <div 
                    key={lead.id} 
                    className="kanban-card"
                    onClick={() => onSelectLead(lead)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                        {lead.customerName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{lead.id}</span>
                    </div>

                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                      <i className="fa-solid fa-house" style={{ color: 'var(--teal-light)', marginRight: 4 }}></i>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lead.interestedPropertyTitle}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: 6,
                      fontSize: '0.74rem'
                    }}>
                      <span style={{ color: 'var(--emerald-neon)', fontWeight: 700 }}>{lead.budget}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{lead.source}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
