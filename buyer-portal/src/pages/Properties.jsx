import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';
import { API_URL } from '../config';

export default function PropertiesPage({ openDetail, t = {} }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [listing, setListing] = useState('');
  const [sort, setSort] = useState('');

  function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (listing) params.set('listing', listing);
    if (sort) params.set('sort', sort);
    fetch(`${API_URL}/api/properties?${params}`)
      .then(r => r.json())
      .then(d => setProperties(d.data || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [search, type, listing, sort]);

  const CATEGORY_OPTIONS = [
    { value: '', label: t.all_types || 'All Types' },
    { value: 'Residential', label: t.residential || 'Residential' },
    { value: 'Agriculture', label: t.agriculture || 'Agriculture' },
    { value: 'Commercial', label: t.commercial || 'Commercial' },
  ];

  const LISTING_OPTIONS = [
    { value: '', label: t.sale_rent_lease || 'Sale / Rent / Lease' },
    { value: 'Sale', label: t.for_sale || 'For Sale' },
    { value: 'Rent', label: t.for_rent || 'For Rent' },
    { value: 'Lease', label: t.for_lease || 'For Lease' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F7', paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="section-tag" style={{ background: '#E0EBF7', color: '#1D4F91' }}>
            {t.explore_listings || 'Browse Properties'}
          </span>
          <h1 className="section-title" style={{ color: '#1D4F91', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
            {t.latest_inventory || 'Latest Verified Inventory'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            {loading ? 'Loading…' : `${properties.length} ${t.properties_found || 'properties found'}`}
          </p>
        </div>

        {/* Filters Box */}
        <div style={{
          background: '#FFFFFF', borderRadius: 16, padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '2.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center',
          border: '1px solid #E5E7EB',
        }}>
          <input
            className="form-input"
            style={{ flex: '1 1 240px', margin: 0 }}
            placeholder={t.search_placeholder || 'Search by location, villa or farmland…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select
            className="form-input"
            style={{ flex: '0 0 auto', width: 'auto', margin: 0 }}
            value={type}
            onChange={e => setType(e.target.value)}
          >
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            className="form-input"
            style={{ flex: '0 0 auto', width: 'auto', margin: 0 }}
            value={listing}
            onChange={e => setListing(e.target.value)}
          >
            {LISTING_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            className="form-input"
            style={{ flex: '0 0 auto', width: 'auto', margin: 0 }}
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="">{t.sort_by || 'Sort By'}</option>
            <option value="price_asc">{t.price_low_high || 'Price: Low → High'}</option>
            <option value="price_desc">{t.price_high_low || 'Price: High → Low'}</option>
            <option value="newest">{t.newest_first || 'Newest First'}</option>
          </select>

          <button
            className="btn-outline"
            style={{ padding: '0.65rem 1.25rem', borderColor: '#1D4F91', color: '#1D4F91' }}
            onClick={() => { setSearch(''); setType(''); setListing(''); setSort(''); }}
          >
            {t.reset_filters || 'Reset'}
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ height: 400, borderRadius: 16 }} />)}
          </div>
        ) : properties.length ? (
          <div className="grid-3">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} onClick={() => openDetail(p)} t={t} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: '#9CA3AF', background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏚️</div>
            <p style={{ fontSize: '1.1rem', color: '#6B7280' }}>
              {t.no_properties_found || 'No properties match your active search and filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
