import React from 'react';

export default function Footer({ navigate }) {
  return (
    <footer style={{ background:'#0A1628', color:'#94A3B8', padding:'3rem 1.5rem 1.5rem' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'2rem', marginBottom:'2rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem' }}>
              <div style={{
                width:36, height:36, borderRadius:'50%',
                background:'linear-gradient(135deg,#C9A84C,#F0C040)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'Playfair Display', fontWeight:900, fontSize:18, color:'#0A1628',
              }}>C</div>
              <span style={{ fontFamily:'Playfair Display', fontWeight:700, color:'#F5F0E8', fontSize:'1.1rem' }}>
                Chikoti Real Estate
              </span>
            </div>
            <p style={{ fontSize:'0.88rem', lineHeight:1.65 }}>
              Trusted partner in property investments since 2010.
            </p>
          </div>
          <div>
            <h4 style={{ color:'#C9A84C', fontWeight:700, marginBottom:'0.75rem' }}>Quick Links</h4>
            {['Home','Properties'].map(l => (
              <div key={l} style={{ marginBottom:'0.4rem' }}>
                <button onClick={() => navigate(l.toLowerCase())} style={{
                  background:'none', color:'#94A3B8', fontSize:'0.9rem', transition:'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color='#C9A84C'}
                onMouseLeave={e => e.target.style.color='#94A3B8'}>{l}</button>
              </div>
            ))}
            <div style={{ marginTop:'0.4rem' }}>
              <a href="https://seller.chikotirealestate.com" target="_blank" rel="noreferrer"
                style={{ color:'#94A3B8', fontSize:'0.9rem' }}>Seller Portal</a>
            </div>
            <div style={{ marginTop:'0.4rem' }}>
              <a href="https://admin.chikotirealestate.com" target="_blank" rel="noreferrer"
                style={{ color:'#94A3B8', fontSize:'0.9rem' }}>Admin Portal</a>
            </div>
          </div>
          <div>
            <h4 style={{ color:'#C9A84C', fontWeight:700, marginBottom:'0.75rem' }}>Contact</h4>
            <p style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>📞 +91 98765 43210</p>
            <p style={{ fontSize:'0.9rem', marginBottom:'0.5rem' }}>📧 info@chikotirealestate.com</p>
            <p style={{ fontSize:'0.9rem' }}>📍 Hyderabad, Telangana</p>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'1.25rem', textAlign:'center', fontSize:'0.82rem' }}>
          © {new Date().getFullYear()} Chikoti Real Estate. All rights reserved. | RERA Certified
        </div>
      </div>
    </footer>
  );
}
