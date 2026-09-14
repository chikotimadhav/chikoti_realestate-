import React from 'react';

export default function Footer({ navigate, t = {} }) {
  return (
    <footer style={{ background: '#0F294D', color: '#94A3B8', padding: '3.5rem 1.5rem 1.75rem', borderTop: '1px solid rgba(201,168,76,0.3)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg,#C9A84C,#F0C040)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 19, color: '#1D4F91',
              }}>
                E
              </div>
              <div>
                <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, color: '#FFFFFF', fontSize: '1.2rem', display: 'block', lineHeight: 1 }}>
                  {t.app_name || 'EstateHub'}
                </span>
                <span style={{ color: '#F0C040', fontSize: '0.72rem', fontWeight: 600 }}>
                  📍 {t.telangana || 'Telangana'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.65, color: '#CBD5E1' }}>
              Telangana's premier verified land and property portal with 100% legal title verification.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#F0C040', fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.95rem' }}>
              Quick Links
            </h4>
            <div style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => navigate('home')}
                style={{
                  background: 'none', color: '#CBD5E1', fontSize: '0.9rem', cursor: 'pointer',
                  border: 'none', padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#F0C040'}
                onMouseLeave={e => e.target.style.color = '#CBD5E1'}
              >
                {t.home || 'Home'}
              </button>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <button
                onClick={() => navigate('properties')}
                style={{
                  background: 'none', color: '#CBD5E1', fontSize: '0.9rem', cursor: 'pointer',
                  border: 'none', padding: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#F0C040'}
                onMouseLeave={e => e.target.style.color = '#CBD5E1'}
              >
                {t.properties || 'Properties'}
              </button>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <a
                href="https://estateshub-seller-portal.vercel.app/"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#CBD5E1', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#F0C040'}
                onMouseLeave={e => e.target.style.color = '#CBD5E1'}
              >
                {t.list_property || 'List Property (Seller Portal)'} ↗
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F0C040', fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.95rem' }}>
              Government Portals
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem' }}>
              <a href="https://bhubharati.telangana.gov.in/knowLandStatus" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                🗺️ Bhubharati (Telangana)
              </a>
              <a href="https://bhuvan-app1.nrsc.gov.in/bhuvan2d/bhuvan/bhuvan2d.php" target="_blank" rel="noreferrer" style={{ color: '#CBD5E1', textDecoration: 'none' }}>
                🛰️ Bhuvan ISRO Satellite
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#F0C040', fontWeight: 700, marginBottom: '0.85rem', fontSize: '0.95rem' }}>
              Contact & Advisory
            </h4>
            <p style={{ fontSize: '0.88rem', marginBottom: '0.5rem', color: '#CBD5E1' }}>📞 +91 98765 43210</p>
            <p style={{ fontSize: '0.88rem', marginBottom: '0.5rem', color: '#CBD5E1' }}>📧 info@estateshub.in</p>
            <p style={{ fontSize: '0.88rem', color: '#CBD5E1' }}>📍 Hyderabad, Telangana</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: '#94A3B8' }}>
          © {new Date().getFullYear()} EstateHub. All rights reserved. | Telangana RERA Compliant
        </div>
      </div>
    </footer>
  );
}
