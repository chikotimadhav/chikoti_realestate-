import React, { useState, useMemo } from 'react';
import { useAgentData } from '../context/AgentDataContext.jsx';
import PropertyCard from '../components/properties/PropertyCard.jsx';
import PropertyDetailModal from '../components/properties/PropertyDetailModal.jsx';
import SharePropertyModal from '../components/properties/SharePropertyModal.jsx';

export default function PropertiesPage({ onSelectProperty, onShareProperty, onScheduleVisit, onAddLeadForProperty }) {
  const { properties } = useAgentData();

  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDetailProp, setViewDetailProp] = useState(null);
  const [shareProp, setShareProp] = useState(null);

  const PROPERTY_TYPES = ['ALL', 'Villas', 'Apartments', 'Commercial', 'Plots', 'Farm Lands'];
  const CATEGORIES = ['ALL', 'Residential', 'Commercial', 'Land'];

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || p.type === selectedType;
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });
  }, [properties, searchQuery, selectedType, selectedCategory, selectedStatus]);

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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Property Inventory</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Verified EstateHub properties available for you to pitch and earn direct broker commissions.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            padding: '0.4rem 0.85rem',
            borderRadius: 999,
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: 'var(--emerald-neon)'
          }}>
            <i className="fa-solid fa-badge-check" style={{ marginRight: 6 }}></i>
            Verified Broker Inventory
          </span>
        </div>
      </div>

      {/* Type Pill Filter Strip */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1rem'
      }}>
        {PROPERTY_TYPES.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: 999,
              fontSize: '0.82rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              background: selectedType === type ? 'var(--emerald-neon)' : 'var(--bg-surface-elevated)',
              color: selectedType === type ? '#052E16' : 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              transition: 'all 0.15s'
            }}
          >
            {type === 'ALL' ? 'All Property Types' : type}
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
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
            placeholder="Search by title, location (e.g. Jubilee Hills, Kokapet), or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 36 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Categories</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land / Farms</option>
          </select>

          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="ALL">All Availability</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
          </select>
        </div>
      </div>

      {/* Grid of Property Cards */}
      {filteredProperties.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-house-chimney-crack" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}></i>
          <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>No properties found</p>
          <span style={{ fontSize: '0.86rem' }}>Try clearing or changing your filters.</span>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProperties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={(p) => setViewDetailProp(p)}
              onShare={(p) => setShareProp(p)}
              onScheduleVisit={(p) => onScheduleVisit(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {viewDetailProp && (
        <PropertyDetailModal
          property={viewDetailProp}
          isOpen={!!viewDetailProp}
          onClose={() => setViewDetailProp(null)}
          onShare={(p) => { setViewDetailProp(null); setShareProp(p); }}
          onScheduleVisit={onScheduleVisit}
          onAddLeadForProperty={onAddLeadForProperty}
        />
      )}

      {shareProp && (
        <SharePropertyModal
          property={shareProp}
          isOpen={!!shareProp}
          onClose={() => setShareProp(null)}
        />
      )}
    </div>
  );
}
