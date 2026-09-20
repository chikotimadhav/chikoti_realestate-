import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard.jsx';
import { API_URL } from '../config';

const PORTALS = [
  { label: 'Bhubharati', sub: 'Telangana Land Records', href: 'https://bhubharati.telangana.gov.in/knowLandStatus', icon: '🗺️' },
  { label: 'Bhuvan ISRO', sub: 'Satellite Imagery', href: 'https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php', icon: '🛰️' },
  { label: 'Google Maps', sub: 'Telangana Corridors', href: 'https://maps.google.com', icon: '📍' },
];

export default function HomePage({ navigate, openDetail, t = {} }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroStats, setHeroStats] = useState({
    properties_transacted: '525+',
    happy_buyers: '1,280+',
    cities_covered: '28',
    years_experience: '15 yrs',
  });

  useEffect(() => {
    fetch(`${API_URL}/api/properties/featured`)
      .then(r => r.json())
      .then(d => setFeatured(d.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));

    fetch(`${API_URL}/api/settings/hero-stats`)
      .then(r => r.json())
      .then(d => {
        if (d && d.data) setHeroStats(d.data);
      })
      .catch(() => {
        // Backup alias route
        fetch(`${API_URL}/api/properties/hero-stats`)
          .then(r => r.json())
          .then(d => { if (d && d.data) setHeroStats(d.data); })
          .catch(() => {});
      });
  }, []);

  const STATS = [
    { icon: '🏠', value: heroStats.properties_transacted || '525+', label: t.stat_properties || 'Properties Transacted' },
    { icon: '👥', value: heroStats.happy_buyers || '1,280+', label: t.stat_buyers || 'Happy Buyers' },
    { icon: '🏙️', value: heroStats.cities_covered || '28', label: t.stat_cities || t.stat_corridors || 'Cities Covered' },
    { icon: '⭐', value: heroStats.years_experience || '15 yrs', label: t.stat_excellence || 'Of Excellence' },
  ];

  const TYPES = [
    { icon: '🏡', label: t.residential || 'Residential', desc: t.residential_sub || 'Apartments, Villas & Plots', color: '#1D4F91', key: 'Residential' },
    { icon: '🌾', label: t.agriculture || 'Agriculture', desc: t.agriculture_sub || 'Farm Lands & Open Plots', color: '#059669', key: 'Agriculture' },
    { icon: '🏢', label: t.commercial || 'Commercial', desc: t.commercial_sub || 'Offices, Shops & Showrooms', color: '#D97706', key: 'Commercial' },
  ];

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section style={{
        minHeight: '88vh',
        background: 'linear-gradient(160deg, #1D4F91 0%, #153E73 45%, #0F294D 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '4.5rem 1.5rem',
      }}>
        {/* Subtle geometric pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-100px',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,192,64,0.18) 0%, transparent 70%)',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="section-tag" style={{ background: 'rgba(240,192,64,0.18)', color: '#F0C040', border: '1px solid rgba(240,192,64,0.35)' }}>
            {t.hero_tag || 'Telangana Verified Real Estate'}
          </span>
          <h1 style={{
            fontFamily: 'Playfair Display', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 900, color: '#FFFFFF', lineHeight: 1.18, margin: '1rem auto 1.25rem',
            maxWidth: 820,
          }}>
            {t.hero_title || 'Find Your Perfect Property in Telangana'}
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '1.1rem', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            {t.hero_sub || 'Premium verified plots, residential lands, and commercial corridors across Telangana.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('properties')} className="btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
              🔍 {t.explore_listings || 'Explore Listings'}
            </button>
            <a
              href="https://estateshub-seller-portal.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
              style={{
                fontSize: '1rem', padding: '0.9rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                borderColor: '#F0C040', color: '#F0C040', textDecoration: 'none',
              }}
            >
              🏛️ {t.list_your_property || 'List Your Property'}
            </a>
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1px', marginTop: '3.5rem',
            background: 'rgba(201,168,76,0.2)',
            borderRadius: 16, overflow: 'hidden',
            border: '1px solid rgba(201,168,76,0.3)',
          }}>
            {STATS.map(s => (
              <div key={s.label} style={{
                background: 'rgba(15,41,77,0.85)',
                padding: '1.25rem 1rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>{s.icon}</div>
                <div style={{ fontFamily: 'Playfair Display', fontSize: '1.65rem', fontWeight: 900, color: '#F0C040' }}>{s.value}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Official Telangana Portals ────────────────────── */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: '2rem 1.5rem' }}>
        <div className="container">
          <p style={{
            textAlign: 'center', color: '#1D4F91', fontWeight: 800,
            fontSize: '0.78rem', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: '1.25rem',
          }}>
            🏛️ {t.official_portals || 'Official Telangana Land Verification Portals'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {PORTALS.map(p => (
              <a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: '#F2F4F7', borderRadius: 12, padding: '1rem 1.25rem',
                  border: '1px solid #E5E7EB', textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#1D4F91'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <span style={{ fontSize: '1.75rem' }}>{p.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F294D' }}>{p.label}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.78rem' }}>{p.sub}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#1D4F91', fontWeight: 700 }}>↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Property Types Section ────────────────────────── */}
      <section style={{ padding: '4.5rem 1.5rem', background: '#F2F4F7' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag">{t.browse_by_type || 'Browse By Type'}</span>
          <h2 className="section-title" style={{ color: '#1D4F91', marginBottom: '0.75rem' }}>
            {t.property_types || 'Property Types'}
          </h2>
          <p className="section-sub" style={{ marginBottom: '2.5rem' }}>
            {t.curated_inventory || 'Choose from our curated inventory of verified properties'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {TYPES.map(cat => (
              <div
                key={cat.label}
                onClick={() => navigate('properties')}
                className="card"
                style={{
                  padding: '2.25rem 2rem', cursor: 'pointer', textAlign: 'center',
                  background: '#FFFFFF', border: '1px solid #E5E7EB',
                }}
              >
                <div style={{
                  width: 70, height: 70, borderRadius: '50%',
                  background: `${cat.color}15`, margin: '0 auto 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem',
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0F294D' }}>
                  {cat.label}
                </h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
                  {cat.desc}
                </p>
                <div style={{
                  marginTop: '1.25rem', display: 'inline-flex', alignItems: 'center',
                  gap: '0.4rem', color: cat.color, fontWeight: 700, fontSize: '0.9rem',
                }}>
                  {t.explore_listings || 'Explore'} →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ───────────────────────────── */}
      <section style={{ padding: '4.5rem 1.5rem', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="section-tag">{t.featured_tag || 'Featured'}</span>
            <h2 className="section-title" style={{ color: '#1D4F91' }}>
              {t.featured_listings || 'Premium Listings'}
            </h2>
          </div>
          {loading ? (
            <div className="grid-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 380, borderRadius: 16 }} />)}
            </div>
          ) : featured.length ? (
            <div className="grid-3">
              {featured.map(p => (
                <PropertyCard key={p.id} property={p} onClick={() => openDetail(p)} t={t} />
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#9CA3AF', padding: '2rem 0' }}>
              {t.no_properties_found || 'No featured properties at the moment.'}
            </p>
          )}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => navigate('properties')} className="btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}>
              {t.view_all_properties || 'View All Properties →'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
