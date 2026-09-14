import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function PropertyDetailModal({ 
  property, 
  isOpen, 
  onClose, 
  onShare, 
  onScheduleVisit, 
  onAddLeadForProperty 
}) {
  const { addToast } = useAgentData();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!property) return null;

  const gallery = property.gallery && property.gallery.length > 0 
    ? property.gallery 
    : [property.image];

  const handleCopyLink = () => {
    const url = `https://estateshub.vercel.app/properties/${property.slug || property.id}?agentRef=RAJESH8841`;
    navigator.clipboard.writeText(url);
    addToast('Agent branded property link copied to clipboard!', 'success');
  };

  const handleContactSeller = () => {
    alert(`Connecting to seller ${property.seller?.name || 'Owner'} (${property.seller?.phone || '+91 98490 XXXXX'}). Developer SLA requires verified inquiry.`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={property.title}
      maxWidth="820px"
      footer={
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={handleCopyLink}>
              <i className="fa-solid fa-copy"></i> Copy Branded Link
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => onShare(property)}>
              <i className="fa-solid fa-share-nodes"></i> Share with Client
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-neon btn-sm" onClick={() => { onClose(); onAddLeadForProperty(property); }}>
              <i className="fa-solid fa-user-plus"></i> + Add Lead
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => { onClose(); onScheduleVisit(property); }}>
              <i className="fa-solid fa-calendar-plus"></i> Schedule Visit
            </button>
          </div>
        </div>
      }
    >
      {/* Main High-Res Image Preview */}
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '1rem',
        background: '#0B101C'
      }}>
        <img
          src={gallery[activeImgIndex]}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          bottom: 12,
          right: 12,
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(8px)',
          padding: '0.35rem 0.85rem',
          borderRadius: 999,
          color: 'var(--emerald-neon)',
          fontSize: '0.82rem',
          fontWeight: 800
        }}>
          Commission: {property.commissionFormatted} ({property.commissionPct}%)
        </div>
      </div>

      {/* Thumbnail Bar if multiple images */}
      {gallery.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
          {gallery.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt=""
              onClick={() => setActiveImgIndex(idx)}
              style={{
                width: 72,
                height: 50,
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                border: activeImgIndex === idx ? '2px solid var(--emerald-neon)' : '1px solid var(--border-color)',
                opacity: activeImgIndex === idx ? 1 : 0.6,
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>
      )}

      {/* Primary Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Price</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', marginTop: 2 }}>{property.priceFormatted}</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Built-up / Land Area</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 2 }}>{property.area}</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Property Type</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--teal-light)', marginTop: 2 }}>{property.type}</div>
        </div>

        <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Availability</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--emerald-neon)', marginTop: 2 }}>{property.status}</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.4rem' }}>Property Overview</h4>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {property.description}
        </p>
      </div>

      {/* Amenities & Badges */}
      {property.amenities && property.amenities.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem' }}>Key Amenities & Specifications</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {property.amenities.map((am, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.7rem',
                  borderRadius: 999,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <i className="fa-solid fa-check" style={{ color: 'var(--emerald-neon)', fontSize: '0.65rem' }}></i>
                {am}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Seller & Verification Section */}
      <div style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Seller / Developer</div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#FFF' }}>{property.seller?.name || 'Authorized Seller'}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--teal-light)' }}>
            RERA Reg: {property.reraReg || 'Verified Project'}
          </div>
        </div>

        <button 
          onClick={handleContactSeller}
          className="btn btn-outline btn-sm"
        >
          <i className="fa-solid fa-headset"></i> Contact Seller Desk
        </button>
      </div>
    </Modal>
  );
}
