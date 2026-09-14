import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAgentData } from '../context/AgentDataContext.jsx';

export default function ProfilePage() {
  const { currentAgent, updateProfile } = useAuth();
  const { addToast } = useAgentData();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentAgent?.name || '',
    phone: currentAgent?.phone || '',
    email: currentAgent?.email || '',
    city: currentAgent?.city || '',
    agencyName: currentAgent?.agencyName || '',
    reraNumber: currentAgent?.reraNumber || '',
    experienceYears: currentAgent?.experienceYears || 0,
    areasServed: currentAgent?.areasServed ? currentAgent.areasServed.join(', ') : '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      areasServed: formData.areasServed.split(',').map(s => s.trim())
    });
    setIsEditing(false);
    addToast('Agent profile updated successfully', 'success');
  };

  const handleUploadDoc = () => {
    alert('Document upload dialog: Attached updated RERA compliance certificate (PDF). Admin notified.');
    addToast('Document submitted for compliance verification', 'success');
  };

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
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Agent Profile & Accreditation</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            Maintain your official regulatory credentials, RERA license, and banking payout records.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'btn btn-outline' : 'btn btn-primary'}
        >
          <i className={isEditing ? 'fa-solid fa-xmark' : 'fa-solid fa-user-pen'}></i>
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Main Profile Showcase Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentAgent?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256'}
              alt={currentAgent?.name}
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--teal-primary)',
                boxShadow: '0 0 20px rgba(13,148,136,0.3)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: currentAgent?.status === 'Approved' ? 'var(--emerald-neon)' : 'var(--gold-accent)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem'
            }}>
              <i className={currentAgent?.status === 'Approved' ? 'fa-solid fa-check' : 'fa-solid fa-clock'}></i>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{currentAgent?.name}</h2>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                background: currentAgent?.status === 'Approved' ? 'rgba(34,197,94,0.18)' : 'rgba(245,158,11,0.18)',
                color: currentAgent?.status === 'Approved' ? 'var(--emerald-neon)' : 'var(--gold-accent)',
                border: `1px solid ${currentAgent?.status === 'Approved' ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)'}`
              }}>
                ● {currentAgent?.status} Agent
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--teal-light)', fontWeight: 700, marginTop: 4 }}>
              {currentAgent?.agencyName} • Agent ID: <span style={{ fontFamily: 'monospace' }}>{currentAgent?.id}</span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.86rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Rating: </span>
                <strong style={{ color: 'var(--gold-accent)' }}>★ {currentAgent?.rating || 4.9}</strong> ({currentAgent?.reviewsCount || 86} client reviews)
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Deals Handled: </span>
                <strong style={{ color: '#FFF' }}>{currentAgent?.propertiesHandled || 36}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Successful Sales: </span>
                <strong style={{ color: 'var(--emerald-neon)' }}>{currentAgent?.successfulSales || 28}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RERA & Regulatory Verification Status (Requirement 13) */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.75rem' }}>
        <div className="card-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="card-title">Regulatory & Document Verification</span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.15)',
              color: 'var(--emerald-neon)'
            }}>
              RERA Compliant
            </span>
          </div>
          <button onClick={handleUploadDoc} className="btn btn-outline btn-sm">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Document
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Identity Verification</span>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-neon)' }}></i>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Aadhaar / Passport KYC Cleared</span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>RERA Registration</span>
              {currentAgent?.verification?.rera ? (
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-neon)' }}></i>
              ) : (
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-accent)', fontWeight: 800 }}>Under Review</span>
              )}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentAgent?.reraNumber}</span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Phone Verification</span>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-neon)' }}></i>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>OTP 2FA Active ({currentAgent?.phone})</span>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Email Verification</span>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--emerald-neon)' }}></i>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Domain verified ({currentAgent?.email})</span>
          </div>
        </div>
      </div>

      {/* Profile Details or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Edit Agent Credentials</h3>
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Full Legal Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">RERA Number</label>
              <input
                type="text"
                className="form-input"
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Agency Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.agencyName}
                onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operating City</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Areas Served (comma separated)</label>
            <input
              type="text"
              className="form-input"
              value={formData.areasServed}
              onChange={(e) => setFormData({ ...formData, areasServed: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Agent Details & Specializations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Areas Served</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>
                {currentAgent?.areasServed ? currentAgent.areasServed.join(', ') : 'Hyderabad Central'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Property Types Handled</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>
                {currentAgent?.propertyTypes ? currentAgent.propertyTypes.join(', ') : 'Villas, Apartments, Commercial'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Industry Experience</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>
                {currentAgent?.experienceYears || 5} Years Active
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Disbursal Bank</span>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)', marginTop: 4 }}>
                {currentAgent?.bankDetails?.bankName || 'HDFC Bank'} ({currentAgent?.bankDetails?.accountNumber || '•••• 8841'})
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
