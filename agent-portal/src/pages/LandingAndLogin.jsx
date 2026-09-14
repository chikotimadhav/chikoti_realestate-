import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Modal from '../components/common/Modal.jsx';

export default function LandingAndLogin() {
  const { login, agents, switchDemoAgent, registerAgentApplication } = useAuth();

  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'login'
  const [emailOrPhone, setEmailOrPhone] = useState('rajesh.agent@estatehub.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application form state
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Hyderabad',
    experienceYears: '4',
    agencyName: '',
    reraNumber: '',
    areasServed: 'Jubilee Hills, Kokapet, Financial District',
    propertyTypes: ['Villas', 'Apartments', 'Commercial']
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(emailOrPhone, password);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.phone || !applyForm.email || !applyForm.reraNumber) {
      alert('Please fill in your Name, Phone, Email, and RERA Registration Number.');
      return;
    }
    registerAgentApplication(applyForm);
    setIsApplyModalOpen(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #111B2C 0%, #080C14 100%)',
      color: '#FFF',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <header style={{
        height: 76,
        padding: '0 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--teal-primary), #10B981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 900,
            fontFamily: 'var(--font-serif)',
            color: '#FFF',
            boxShadow: '0 4px 14px rgba(13,148,136,0.4)'
          }}>E</div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.1 }}>EstateHub</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--teal-light)', fontWeight: 700, letterSpacing: '0.08em' }}>
              AGENT PORTAL
            </span>
          </div>
        </div>

        {/* Ecosystem navigation links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.85rem' }}>
          <a 
            href="http://localhost:3001" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Buyer Portal ↗
          </a>
          <a 
            href="http://localhost:3002" 
            target="_blank" 
            rel="noreferrer"
            style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#FFF'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            Seller Portal ↗
          </a>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setIsApplyModalOpen(true)}
          >
            Apply as Agent
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '3rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {activeView === 'landing' ? (
          /* Landing Hero */
          <div style={{ textAlign: 'center', maxWidth: 860 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 999,
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: 'var(--emerald-neon)',
              fontSize: '0.82rem',
              fontWeight: 800,
              marginBottom: '1.5rem'
            }}>
              <i className="fa-solid fa-sparkles"></i>
              <span>Your Properties. Your Leads. Your Growth.</span>
            </div>

            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem'
            }}>
              Welcome to <span className="text-gradient-teal">EstateHub</span> Agent Portal
            </h1>

            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: 680,
              margin: '0 auto 2.5rem',
              lineHeight: 1.6
            }}>
              Manage your verified properties, client enquiries, site visits, and high-yield commissions — all in one unified, high-performance command center.
            </p>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button
                className="btn btn-neon btn-lg"
                onClick={() => setActiveView('login')}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                <span>Agent Login</span>
              </button>

              <button
                className="btn btn-outline btn-lg"
                onClick={() => setIsApplyModalOpen(true)}
              >
                <i className="fa-solid fa-id-card"></i>
                <span>Become an Agent</span>
              </button>
            </div>

            {/* 1-Click Instant Demo Login Strip */}
            <div style={{
              background: 'rgba(18, 26, 43, 0.85)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '1rem' }}>
                Instant One-Click Demo Access
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {agents.map(a => (
                  <div
                    key={a.id}
                    onClick={() => switchDemoAgent(a.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--emerald-neon)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img 
                      src={a.avatar} 
                      alt={a.name} 
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--teal-primary)' }} 
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF' }}>{a.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{a.agencyName}</div>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: a.status === 'Approved' ? 'var(--emerald-neon)' : 'var(--gold-accent)',
                        marginTop: 2
                      }}>
                        ● {a.status} (RERA: {a.reraNumber.split('-')[2] || a.reraNumber})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Login Box */
          <div style={{
            width: '100%',
            maxWidth: 440,
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <button
              onClick={() => setActiveView('landing')}
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: '1.5rem'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Back to overview</span>
            </button>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Agent Login</h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              Access your real estate pipeline, client leads, and commissions.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Mobile Number / Registered Email</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="rajesh.agent@estatehub.in"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset OTP sent to registered mobile number.'); }} style={{ fontSize: '0.74rem', color: 'var(--teal-light)' }}>
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="remMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--teal-primary)' }}
                />
                <label htmlFor="remMe" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember me on this browser
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                <i className="fa-solid fa-lock"></i>
                <span>Sign In to Agent Portal</span>
              </button>
            </form>

            <div style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center',
              fontSize: '0.84rem',
              color: 'var(--text-secondary)'
            }}>
              Don't have an agent account?{' '}
              <button 
                onClick={() => setIsApplyModalOpen(true)}
                style={{ color: 'var(--emerald-neon)', fontWeight: 800 }}
              >
                Apply to become an Agent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* "Apply to become an Agent" Registration Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for EstateHub Agent Accreditation"
        maxWidth="680px"
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-neon btn-sm" onClick={handleApplySubmit}>
              <i className="fa-solid fa-file-signature"></i> Submit Application
            </button>
          </>
        }
      >
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(13,148,136,0.1)',
          border: '1px solid rgba(13,148,136,0.25)',
          marginBottom: '1.25rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <strong style={{ color: 'var(--teal-light)' }}>RERA Accreditation Requirement:</strong> In compliance with Real Estate Regulatory Authority mandates, all EstateHub partners must hold a registered broker license.
        </div>

        <form onSubmit={handleApplySubmit}>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Suresh Varma"
                value={applyForm.name}
                onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input
                type="tel"
                required
                className="form-input"
                placeholder="+91 98490 XXXXX"
                value={applyForm.phone}
                onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="agent@realty.com"
                value={applyForm.email}
                onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operating City</label>
              <input
                type="text"
                className="form-input"
                value={applyForm.city}
                onChange={(e) => setApplyForm({ ...applyForm, city: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Agency / Brokerage Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Prime Spaces LLP"
                value={applyForm.agencyName}
                onChange={(e) => setApplyForm({ ...applyForm, agencyName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">RERA Registration Number *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="TS-RERA-A518000XXXXX"
                value={applyForm.reraNumber}
                onChange={(e) => setApplyForm({ ...applyForm, reraNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Years of Real Estate Experience</label>
              <select
                className="form-select"
                value={applyForm.experienceYears}
                onChange={(e) => setApplyForm({ ...applyForm, experienceYears: e.target.value })}
              >
                <option value="1">1 Year</option>
                <option value="3">2 - 4 Years</option>
                <option value="6">5 - 8 Years</option>
                <option value="10">10+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Areas Served in City</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jubilee Hills, Kokapet, Gachibowli"
                value={applyForm.areasServed}
                onChange={(e) => setApplyForm({ ...applyForm, areasServed: e.target.value })}
              />
            </div>
          </div>

          {/* Document Upload Simulation */}
          <div className="form-group">
            <label className="form-label">Upload Government ID / RERA Certificate (PDF/JPG)</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
              background: 'var(--bg-input)',
              cursor: 'pointer'
            }} onClick={() => alert('Document attached: rera_certificate_application.pdf')}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.5rem', color: 'var(--teal-light)', marginBottom: 6, display: 'block' }}></i>
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>Click to attach RERA Certificate or ID Proof</span>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>Supports PDF, PNG, JPG up to 10MB</div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
