import React, { useState, useMemo } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import ClientTable from '../components/clients/ClientTable.jsx';
import AddClientModal from '../components/clients/AddClientModal.jsx';

export default function ClientsPage() {
  const { clients, deleteClient } = useAgentData();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.preferredLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Client Management (CRM)</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Manage relationships with high-intent property buyers, investors, and HNIs.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-user-plus"></i>
          <span>+ Add New Client</span>
        </button>
      </div>

      {/* Search and Filters */}
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
        <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
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
            placeholder="Search clients by name, mobile, preferred location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredClients.length}</strong> active client relationships
        </div>
      </div>

      {/* Client Table */}
      <ClientTable
        clients={filteredClients}
        onDeleteClient={deleteClient}
      />

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
