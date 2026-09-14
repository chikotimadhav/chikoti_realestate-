import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function UpdatesAlertsModal({ isOpen, onClose, onSelectProperty, t }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUpdates();
    }
  }, [isOpen]);

  async function fetchUpdates() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/updates`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setUpdates(data.data);
      }
    } catch (e) {
      console.error('Error fetching updates:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleClearAll() {
    setClearing(true);
    try {
      await fetch(`${API_URL}/api/updates/clear`, { method: 'DELETE' });
      setUpdates([]);
    } catch (e) {
      console.error('Error clearing updates:', e);
      setUpdates([]);
    } finally {
      setClearing(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(15, 41, 77, 0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', justifyContent: 'flex-end',
    }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440, height: '100%',
          background: '#FFFFFF', display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(29,79,145,0.2)',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem', background: '#1D4F91', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            <div>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '1.15rem', fontWeight: 700, fontFamily: 'Playfair Display' }}>
                {t.updates_alerts}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#CBD5E1' }}>
                {updates.length} {t.updates_alerts.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', color: '#FFFFFF',
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none', fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>

        {/* Action Bar */}
        {updates.length > 0 && (
          <div style={{
            padding: '0.75rem 1.5rem', background: '#F2F4F7',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #E5E7EB',
          }}>
            <span style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 600 }}>
              Live Listing Notifications
            </span>
            <button
              onClick={handleClearAll}
              disabled={clearing}
              style={{
                background: 'none', border: 'none', color: '#DC2626',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
              }}
            >
              {clearing ? 'Clearing…' : t.clear_all}
            </button>
          </div>
        )}

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
              <p>Loading alerts…</p>
            </div>
          ) : updates.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem 1.5rem',
              color: '#6B7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#F2F4F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              }}>
                📭
              </div>
              <h4 style={{ margin: 0, color: '#1D4F91', fontSize: '1.05rem' }}>All Caught Up!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#9CA3AF', maxWidth: 260 }}>
                {t.no_alerts}
              </p>
            </div>
          ) : (
            updates.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#FFFFFF', borderRadius: 12,
                  border: '1px solid #E5E7EB', padding: '1rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex', flexDirection: 'column', gap: '0.35rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                    color: '#1D4F91', background: '#E0EBF7',
                    padding: '0.15rem 0.5rem', borderRadius: 4,
                  }}>
                    {item.type === 'new_listing' ? 'New Property' : 'Alert'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>
                    {new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0F294D', fontWeight: 700 }}>
                  {item.title}
                </h4>

                <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.4 }}>
                  {item.message}
                </p>

                {item.property_id && onSelectProperty && (
                  <button
                    onClick={() => {
                      onSelectProperty(item.property_id);
                      onClose();
                    }}
                    style={{
                      alignSelf: 'flex-start', marginTop: '0.4rem',
                      background: 'none', border: 'none', padding: 0,
                      color: '#C9A84C', fontWeight: 700, fontSize: '0.82rem',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
                    }}
                  >
                    View Property Details →
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
