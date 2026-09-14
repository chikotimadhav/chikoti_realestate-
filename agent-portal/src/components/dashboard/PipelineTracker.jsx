import React from 'react';

export default function PipelineTracker({ activeStage = 3, onStageClick }) {
  const stages = [
    { num: 1, label: 'Buyer Enquiry', icon: 'fa-solid fa-magnifying-glass' },
    { num: 2, label: 'Assigned Lead', icon: 'fa-solid fa-user-plus' },
    { num: 3, label: 'Contact Client', icon: 'fa-solid fa-phone-volume' },
    { num: 4, label: 'Site Visit', icon: 'fa-solid fa-calendar-check' },
    { num: 5, label: 'Negotiation', icon: 'fa-solid fa-handshake' },
    { num: 6, label: 'Booking Token', icon: 'fa-solid fa-file-signature' },
    { num: 7, label: 'Property Sale', icon: 'fa-solid fa-house-circle-check' },
    { num: 8, label: 'Agent Earnings', icon: 'fa-solid fa-circle-dollar-to-slot' },
  ];

  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.74rem', color: 'var(--teal-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            EstateHub Deal Lifecycle Workflow
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, marginTop: 2 }}>
            From Buyer Discovery to Direct Agent Commission
          </h4>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          High-Velocity Conversion Pipeline
        </span>
      </div>

      <div className="pipeline-flow" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {stages.map((stage) => {
          const isActive = stage.num <= activeStage;
          const isCurrent = stage.num === activeStage;

          return (
            <div 
              key={stage.num} 
              className={`pipeline-step ${isActive ? 'active' : ''}`}
              onClick={() => onStageClick && onStageClick(stage)}
              style={{ cursor: 'pointer', minWidth: 90 }}
            >
              <div 
                className="pipeline-circle"
                style={{
                  background: isCurrent ? 'var(--emerald-neon)' : isActive ? 'rgba(34, 197, 94, 0.2)' : undefined,
                  color: isCurrent ? '#052E16' : isActive ? 'var(--emerald-neon)' : undefined,
                  borderColor: isActive ? 'var(--emerald-neon)' : undefined,
                  transform: isCurrent ? 'scale(1.15)' : 'none'
                }}
              >
                <i className={stage.icon}></i>
              </div>
              <span className="pipeline-label" style={{ color: isCurrent ? 'var(--emerald-neon)' : undefined }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
