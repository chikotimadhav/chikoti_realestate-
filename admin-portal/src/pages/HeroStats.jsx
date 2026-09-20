import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

function token() { return localStorage.getItem('ck_admin_token'); }

export default function HeroStatsPage() {
  const [stats, setStats] = useState({
    properties_transacted: '525+',
    happy_buyers: '1,280+',
    cities_covered: '28',
    years_experience: '15 yrs',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings/hero-stats`);
      const data = await res.json();
      if (data && data.data) {
        setStats(prev => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch (err) {
      console.error('Failed to load hero stats:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/hero-stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(stats),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', text: 'Hero stats updated successfully! Synced to Buyer Portal & Mobile App.' });
        if (data.data) setStats(data.data);
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to update hero stats.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Network error saving stats.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  }

  const statFields = [
    {
      key: 'properties_transacted',
      label: 'Properties Transacted',
      icon: '🏠',
      desc: 'Count of completed sales/leases shown in hero bar',
      presets: ['waiting', '1', '2', '25+', '100+', '525+'],
    },
    {
      key: 'happy_buyers',
      label: 'Happy Buyers',
      icon: '👥',
      desc: 'Total verified clients served across the platform',
      presets: ['waiting', '1', '2', '50+', '500+', '1,280+'],
    },
    {
      key: 'cities_covered',
      label: 'Cities Covered',
      icon: '🏙️',
      desc: 'Number of cities, districts & corridors active',
      presets: ['waiting', '1', '2', '12', '28', '33'],
    },
    {
      key: 'years_experience',
      label: 'Of Excellence',
      icon: '⭐',
      desc: 'Years of industry presence & trust',
      presets: ['1 yrs', '2 yrs', '5 yrs', '10 yrs', '15 yrs'],
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Intro Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1D4F91 0%, #0F294D 100%)',
        color: 'white',
        borderRadius: 16,
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 10px 25px -5px rgba(29, 79, 145, 0.3)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#F0C040' }}>Live Ecosystem Stats Manager</span>
          </div>
          <div style={{ color: '#CBD5E1', fontSize: '0.85rem', maxWidth: 620, lineHeight: 1.5 }}>
            Update the statistics displayed on the <strong>Buyer Portal hero banner</strong> and the <strong>Mobile App home screen</strong>. Change any value from <em>"waiting"</em> to live figures like <em>1, 2, 50+</em> in real time.
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="btn btn-primary"
          style={{
            background: 'linear-gradient(135deg, #F0C040, #E5B220)',
            color: '#0F294D',
            fontWeight: 800,
            padding: '0.75rem 1.6rem',
            border: 'none',
            fontSize: '0.92rem',
            boxShadow: '0 4px 12px rgba(240, 192, 64, 0.4)',
          }}
        >
          {saving ? 'Saving Changes…' : '💾 Save & Publish All'}
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: 10,
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: feedback.type === 'success' ? '#065F46' : '#991B1B',
          border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
        }}>
          <span>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Editor Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {statFields.map(field => (
          <div
            key={field.key}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '4px solid #1D4F91',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{field.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{field.label}</span>
              </div>
              <div style={{ color: '#64748B', fontSize: '0.75rem', marginBottom: '1rem', minHeight: '2.2rem' }}>
                {field.desc}
              </div>

              {/* Input */}
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                Display Count / Value
              </label>
              <input
                type="text"
                className="form-input"
                value={stats[field.key] || ''}
                onChange={e => setStats({ ...stats, [field.key]: e.target.value })}
                placeholder="e.g. 1, 2, 50+"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#1D4F91',
                  background: '#F8FAFC',
                }}
              />

              {/* Quick Presets */}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 600, marginBottom: '0.3rem' }}>QUICK PRESETS:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {field.presets.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setStats({ ...stats, [field.key]: p })}
                      style={{
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        borderRadius: 6,
                        border: stats[field.key] === p ? '1px solid #1D4F91' : '1px solid #E2E8F0',
                        background: stats[field.key] === p ? '#EEF2FF' : '#FFFFFF',
                        color: stats[field.key] === p ? '#1D4F91' : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Section */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              👁️ Real-Time Preview
            </div>
            <div style={{ color: '#64748B', fontSize: '0.78rem' }}>
              See how your counts appear to buyers on the web portal and mobile app
            </div>
          </div>
          <span className="badge badge-approved">Synced Live</span>
        </div>

        {/* 1. Buyer Portal Web Preview */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>🌐</span> BUYER PORTAL HERO DISPLAY (estateshub.vercel.app)
          </div>
          <div style={{
            background: 'linear-gradient(160deg, #1D4F91 0%, #153E73 45%, #0F294D 100%)',
            borderRadius: 16,
            padding: '1.5rem',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1px',
              background: 'rgba(201,168,76,0.2)',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(201,168,76,0.3)',
            }}>
              {[
                { icon: '🏠', val: stats.properties_transacted || '—', label: 'Properties Transacted' },
                { icon: '👥', val: stats.happy_buyers || '—', label: 'Happy Buyers' },
                { icon: '🏙️', val: stats.cities_covered || '—', label: 'Cities Covered' },
                { icon: '⭐', val: stats.years_experience || '—', label: 'Of Excellence' },
              ].map(s => (
                <div key={s.label} style={{
                  background: 'rgba(15,41,77,0.88)',
                  padding: '1.25rem 0.8rem',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{s.icon}</div>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#F0C040',
                    lineHeight: 1.2,
                  }}>
                    {s.val}
                  </div>
                  <div style={{ color: '#94A3B8', fontSize: '0.74rem', marginTop: '0.3rem', fontWeight: 500 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Mobile App Preview */}
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📱</span> MOBILE APPLICATION BAR (EstateHub Flutter App)
          </div>
          <div style={{
            maxWidth: 500,
            margin: '0 auto',
            background: '#0F294D',
            borderRadius: 16,
            padding: '1rem 0.6rem',
            border: '1px solid rgba(240, 192, 64, 0.4)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
              {[
                { icon: '🏠', val: stats.properties_transacted || '—', label: 'Properties Transacted' },
                { icon: '👥', val: stats.happy_buyers || '—', label: 'Happy Buyers' },
                { icon: '🏙️', val: stats.cities_covered || '—', label: 'Cities Covered' },
                { icon: '⭐', val: stats.years_experience || '—', label: 'Of Excellence' },
              ].map((s, idx) => (
                <React.Fragment key={s.label}>
                  <div style={{ flex: 1, padding: '0 4px' }}>
                    <div style={{ fontSize: '1.1rem' }}>{s.icon}</div>
                    <div style={{
                      color: '#F0C040',
                      fontWeight: 800,
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      marginTop: 2,
                    }}>
                      {s.val}
                    </div>
                    <div style={{
                      color: '#E2E8F0',
                      fontSize: '0.62rem',
                      fontWeight: 500,
                      marginTop: 2,
                      lineHeight: 1.1,
                    }}>
                      {s.label}
                    </div>
                  </div>
                  {idx < 3 && (
                    <div style={{ width: 1, height: 32, background: 'rgba(240,192,64,0.3)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
