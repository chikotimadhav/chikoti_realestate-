import React, { useState } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import VisitCalendar from '../components/visits/VisitCalendar.jsx';
import VisitList from '../components/visits/VisitList.jsx';
import ScheduleVisitModal from '../components/visits/ScheduleVisitModal.jsx';

export default function SiteVisitsPage() {
  const { visits } = useAgentData();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  const filteredVisits = visits.filter(v => {
    if (statusFilter === 'ALL') return true;
    return v.status === statusFilter;
  });

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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Site Visits</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Coordinate in-person walkthroughs and property inspections with prospective buyers.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 3
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'list' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'list' ? 'var(--teal-light)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="fa-solid fa-list"></i>
              <span>List View</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'calendar' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'calendar' ? 'var(--teal-light)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="fa-solid fa-calendar"></i>
              <span>Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn btn-primary"
          >
            <i className="fa-solid fa-calendar-plus"></i>
            <span>+ Schedule Site Visit</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {['ALL', 'Scheduled', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 999,
                fontSize: '0.78rem',
                fontWeight: 700,
                background: statusFilter === st ? 'rgba(13,148,136,0.2)' : 'transparent',
                color: statusFilter === st ? 'var(--teal-light)' : 'var(--text-secondary)',
                border: statusFilter === st ? '1px solid var(--teal-light)' : '1px solid transparent'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Total <strong>{filteredVisits.length}</strong> visits
        </div>
      </div>

      {/* Main View */}
      {viewMode === 'calendar' ? (
        <VisitCalendar
          visits={filteredVisits}
          onSelectVisit={(v) => setSelectedVisit(v)}
        />
      ) : (
        <VisitList
          visits={filteredVisits}
          onSelectVisit={(v) => setSelectedVisit(v)}
        />
      )}

      {/* Modals */}
      <ScheduleVisitModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
