import React, { useState, useMemo } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import LeadTable from '../components/leads/LeadTable.jsx';
import LeadKanban from '../components/leads/LeadKanban.jsx';
import LeadDetailModal from '../components/leads/LeadDetailModal.jsx';
import AddLeadModal from '../components/leads/AddLeadModal.jsx';

export default function LeadsPage({ onScheduleVisitForLead }) {
  const { leads } = useAgentData();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.interestedPropertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Lead Management</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Track, nurture, and close customer enquiries across each pipeline stage.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* View Toggle */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: 3
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'kanban' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'kanban' ? 'var(--teal-light)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="fa-solid fa-table-columns"></i>
              <span>Kanban</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'table' ? 'var(--bg-card-hover)' : 'transparent',
                color: viewMode === 'table' ? 'var(--teal-light)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <i className="fa-solid fa-list-check"></i>
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="btn btn-primary"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>+ Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <i className="fa-solid fa-magnifying-glass" style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem'
          }}></i>
          <input
            type="text"
            className="form-input"
            placeholder="Search leads by name, phone, property title, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 140 }}
          >
            <option value="ALL">All Statuses ({leads.length})</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="SITE VISIT">SITE VISIT</option>
            <option value="NEGOTIATION">NEGOTIATION</option>
            <option value="BOOKED">BOOKED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="LOST">LOST</option>
          </select>

          <select
            className="form-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 150 }}
          >
            <option value="ALL">All Sources</option>
            <option value="Website Enquiry">Website Enquiry</option>
            <option value="Direct Referral">Direct Referral</option>
            <option value="MagicBricks">MagicBricks</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Instagram Ads">Instagram Ads</option>
          </select>

          {(searchQuery || statusFilter !== 'ALL' || sourceFilter !== 'ALL') && (
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setSourceFilter('ALL'); }}
              className="btn btn-outline btn-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Leads Content View */}
      {viewMode === 'kanban' ? (
        <LeadKanban
          leads={filteredLeads}
          onSelectLead={(lead) => setSelectedLead(lead)}
        />
      ) : (
        <LeadTable
          leads={filteredLeads}
          onSelectLead={(lead) => setSelectedLead(lead)}
        />
      )}

      {/* Modals */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          onScheduleVisitForLead={onScheduleVisitForLead}
        />
      )}

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
      />
    </div>
  );
}
