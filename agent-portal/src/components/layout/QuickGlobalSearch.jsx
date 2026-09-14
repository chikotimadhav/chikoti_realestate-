import React, { useState, useMemo } from 'react';
import { useAgentData } from '../../context/AgentDataContext.jsx';
import Modal from '../common/Modal.jsx';

export default function QuickGlobalSearch({ onSelectResult }) {
  const { isSearchOpen, setIsSearchOpen, properties, leads, clients, visits, bookings } = useAgentData();
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedLeads = leads
      .filter(l => l.customerName.toLowerCase().includes(q) || l.phone.includes(q) || l.interestedPropertyTitle.toLowerCase().includes(q))
      .slice(0, 4)
      .map(l => ({ type: 'lead', title: l.customerName, sub: `${l.status} • ${l.interestedPropertyTitle}`, item: l, tab: 'leads' }));

    const matchedProps = properties
      .filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))
      .slice(0, 4)
      .map(p => ({ type: 'property', title: p.title, sub: `${p.priceFormatted} • ${p.location}`, item: p, tab: 'properties' }));

    const matchedClients = clients
      .filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.preferredLocation.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: 'client', title: c.name, sub: `${c.budget} • ${c.propertyType}`, item: c, tab: 'clients' }));

    const matchedVisits = visits
      .filter(v => v.clientName.toLowerCase().includes(q) || v.propertyTitle.toLowerCase().includes(q))
      .slice(0, 3)
      .map(v => ({ type: 'visit', title: `Visit: ${v.clientName}`, sub: `${v.date} ${v.time} • ${v.status}`, item: v, tab: 'visits' }));

    const matchedBookings = bookings
      .filter(b => b.clientName.toLowerCase().includes(q) || b.propertyTitle.toLowerCase().includes(q))
      .slice(0, 2)
      .map(b => ({ type: 'booking', title: `Booking #${b.id}`, sub: `${b.clientName} • ${b.propertyValueFormatted}`, item: b, tab: 'bookings' }));

    return [...matchedLeads, ...matchedProps, ...matchedClients, ...matchedVisits, ...matchedBookings];
  }, [query, leads, properties, clients, visits, bookings]);

  const handleSelect = (result) => {
    setIsSearchOpen(false);
    setQuery('');
    if (onSelectResult) onSelectResult(result.tab, result.item);
  };

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => { setIsSearchOpen(false); setQuery(''); }}
      title="EstateHub Instant Global Search"
      maxWidth="600px"
    >
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <i className="fa-solid fa-magnifying-glass" style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)'
        }}></i>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by customer name, phone, property title, booking ID..."
          autoFocus
          className="form-input"
          style={{ paddingLeft: 42, fontSize: '1rem', height: 48 }}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          >
            <i className="fa-solid fa-circle-xmark"></i>
          </button>
        )}
      </div>

      <div style={{ minHeight: 180, maxHeight: 380, overflowY: 'auto' }}>
        {!query.trim() ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-bolt" style={{ fontSize: '2rem', color: 'var(--teal-light)', marginBottom: '0.75rem', display: 'block' }}></i>
            <p style={{ fontWeight: 600 }}>Quick suggestions across all modules</p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Try searching: "Jubilee Hills", "Vikram", "Penthouse", "Kokapet", "98490"
            </span>
          </div>
        ) : filteredResults.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No records found matching "{query}"
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {filteredResults.map((res, i) => {
              let icon = 'fa-user';
              let badgeColor = 'var(--teal-light)';
              if (res.type === 'property') { icon = 'fa-building'; badgeColor = 'var(--emerald-neon)'; }
              if (res.type === 'client') { icon = 'fa-address-book'; badgeColor = 'var(--gold-accent)'; }
              if (res.type === 'visit') { icon = 'fa-calendar-check'; badgeColor = '#60A5FA'; }
              if (res.type === 'booking') { icon = 'fa-handshake'; badgeColor = '#C084FC'; }

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(res)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--teal-light)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: badgeColor
                    }}>
                      <i className={`fa-solid ${icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{res.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{res.sub}</div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: badgeColor,
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: 999
                  }}>
                    {res.type}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
