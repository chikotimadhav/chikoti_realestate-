import React, { useState } from 'react';
import { API_URL } from '../config';

function formatPrice(n) {
  if (!n) return '—';
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_00_000 / 100) return `₹${(n / 1_00_000).toFixed(1)} L`;
  return '₹' + Number(n).toLocaleString('en-IN');
}

export default function PropertyDetailModal({ property: p, onClose, user, t = {} }) {
  const [form, setForm] = useState({
    buyer_name: user?.name || '',
    buyer_email: user?.email || '',
    buyer_phone: user?.phone || '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [imgIdx, setImgIdx] = useState(0);

  const imgs = p.images?.length ? p.images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600'];

  async function sendInquiry(e) {
    e.preventDefault();
    setErr('');
    if (!form.buyer_name || !form.buyer_email || !form.buyer_phone) {
      setErr(t.fill_required || 'Please fill all required fields');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_id: p.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (e) {
      setErr(e.message);
    }
  }

  const categoryLabel = (p.land_type && t[p.land_type.toLowerCase()]) ? t[p.land_type.toLowerCase()] : p.land_type;
  const listingLabel = p.listing_type === 'Sale' ? (t.for_sale || 'For Sale') :
                       p.listing_type === 'Rent' ? (t.for_rent || 'For Rent') :
                       p.listing_type === 'Lease' ? (t.for_lease || 'For Lease') : `For ${p.listing_type}`;

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15,41,77,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{
        maxWidth: 720, width: '100%', padding: 0, background: '#FFFFFF',
        borderRadius: 20, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto',
        position: 'relative', boxShadow: '0 20px 60px rgba(29,79,145,0.3)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            background: 'rgba(0,0,0,0.6)', color: 'white',
            borderRadius: '50%', width: 34, height: 34, fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: 'none',
          }}
        >
          ✕
        </button>

        {/* Image carousel / slider */}
        <div style={{ position: 'relative', height: 300, background: '#1D4F91' }}>
          <img
            src={imgs[imgIdx]}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {imgs.length > 1 && (
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: i === imgIdx ? 22 : 8, height: 8, borderRadius: 999,
                    background: i === imgIdx ? '#F0C040' : 'rgba(255,255,255,0.6)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '1.75rem' }}>
          {/* Title, location, and price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{
                  padding: '0.2rem 0.65rem', borderRadius: 999,
                  background: '#1D4F91', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 800,
                  textTransform: 'uppercase',
                }}>
                  {categoryLabel}
                </span>
                <span style={{
                  padding: '0.2rem 0.65rem', borderRadius: 999,
                  background: '#059669', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: 700,
                }}>
                  {listingLabel}
                </span>
              </div>
              <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.45rem', color: '#0F294D', marginBottom: '0.35rem', lineHeight: 1.25 }}>
                {p.title}
              </h2>
              <p style={{ color: '#6B7280', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#C9A84C' }}>📍</span>
                {p.location}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, display: 'block' }}>
                {t.price || 'Investment / Price'}
              </span>
              <div className="price-tag" style={{ fontSize: '1.6rem', color: '#1D4F91' }}>
                {formatPrice(p.price)}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '0.2rem 0.6rem', borderRadius: 6,
                background: '#D1FAE5', color: '#065F46', fontSize: '0.75rem', fontWeight: 700, marginTop: 4,
              }}>
                ✓ {t.verified_title || 'Verified Title'}
              </span>
            </div>
          </div>

          {/* Specifications Grid */}
          <h3 style={{ fontSize: '1.1rem', color: '#1D4F91', marginBottom: '0.65rem' }}>
            {t.property_specs || 'Property Specifications'}
          </h3>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem', background: '#F2F4F7', borderRadius: 14,
            padding: '1.1rem', marginBottom: '1.5rem',
          }}>
            {p.land_type === 'Agriculture' && (
              <>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🌾 {t.acres || 'Acres'}</span><strong>{p.acres ? `${p.acres} Acres` : '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>💧 {t.water_source || 'Water Source'}</span><strong>{p.water_source || '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🌱 {t.soil_type || 'Soil Type'}</span><strong>{p.soil_type || '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🌽 {t.current_crop || 'Current Crop'}</span><strong>{p.current_crop || '—'}</strong></div>
              </>
            )}
            {p.land_type === 'Commercial' && (
              <>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>📐 {t.built_area || 'Built Area'}</span><strong>{p.built_area ? `${p.built_area} sq.ft` : '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🏢 {t.usage_type || 'Usage Type'}</span><strong>{p.business_type || '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🅿️ {t.parking || 'Parking'}</span><strong>{p.parking || '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>👥 {t.footfall || 'Footfall'}</span><strong>{p.footfall || '—'}</strong></div>
              </>
            )}
            {p.land_type === 'Residential' && (
              <>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>📐 {t.built_area || 'Area'}</span><strong>{p.area_sqft ? `${p.area_sqft} sq.ft` : '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🛏️ {t.bedrooms || 'Bedrooms'}</span><strong>{p.bedrooms ? `${p.bedrooms} BHK` : '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🛁 {t.bathrooms || 'Bathrooms'}</span><strong>{p.bathrooms ? `${p.bathrooms} Baths` : '—'}</strong></div>
                <div><span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>🪑 {t.furnishing || 'Furnishing'}</span><strong>{p.furnishing || '—'}</strong></div>
              </>
            )}
          </div>

          {/* Description */}
          {p.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#1D4F91', marginBottom: '0.4rem' }}>
                {t.about_property || 'About This Property'}
              </h4>
              <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>
                {p.description}
              </p>
            </div>
          )}

          {/* Contact buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <a
              href={`tel:${p.contact_number || '+919876543210'}`}
              className="btn-gold"
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem', textDecoration: 'none' }}
            >
              📞 {p.contact_number || '+91 98765 43210'}
            </a>
            {p.whatsapp_number && (
              <a
                href={`https://wa.me/91${p.whatsapp_number}?text=${encodeURIComponent(`Hi! I am interested in ${p.title} on EstateHub.`)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1, justifyContent: 'center', padding: '0.75rem',
                  background: '#25D366', color: 'white', borderRadius: 12,
                  display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                💬 WhatsApp
              </a>
            )}
          </div>

          {/* Inquiry Form */}
          {sent ? (
            <div style={{
              background: '#D1FAE5', borderRadius: 12, padding: '1.25rem',
              textAlign: 'center', color: '#065F46', fontWeight: 600,
            }}>
              ✅ {t.inquiry_sent || 'Inquiry sent! The seller will contact you shortly.'}
            </div>
          ) : (
            <div style={{ background: '#F2F4F7', borderRadius: 14, padding: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem', color: '#1D4F91' }}>
                📩 {t.send_inquiry || 'Send an Inquiry'}
              </h4>
              <form onSubmit={sendInquiry} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    className="form-input"
                    placeholder={t.your_name || 'Full Name'}
                    required
                    value={form.buyer_name}
                    onChange={e => setForm({ ...form, buyer_name: e.target.value })}
                  />
                  <input
                    className="form-input"
                    type="tel"
                    placeholder={t.your_phone || 'Phone Number'}
                    required
                    value={form.buyer_phone}
                    onChange={e => setForm({ ...form, buyer_phone: e.target.value })}
                  />
                </div>
                <input
                  className="form-input"
                  type="email"
                  placeholder={t.your_email || 'Email Address'}
                  required
                  value={form.buyer_email}
                  onChange={e => setForm({ ...form, buyer_email: e.target.value })}
                />
                <textarea
                  className="form-input"
                  placeholder={t.your_message || 'Your message or visit request…'}
                  rows={3}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
                {err && <p style={{ color: '#DC2626', fontSize: '0.85rem', margin: 0 }}>{err}</p>}
                <button type="submit" className="btn-gold" style={{ justifyContent: 'center', padding: '0.75rem' }}>
                  {t.send_inquiry || 'Send Inquiry'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
