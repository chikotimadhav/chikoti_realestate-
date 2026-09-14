import React, { useState } from 'react';
import { API_URL } from '../config';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
];

export default function EditProfileModal({ isOpen, onClose, user, onUpdateUser, t }) {
  if (!isOpen || !user) return null;

  const [name, setName] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');
  const [avatar, setAvatar] = useState(user.avatar_url || user.avatar || AVATAR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setMsg('');
    setErr('');
    setLoading(true);

    try {
      const token = localStorage.getItem('ck_token');
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          avatar_url: avatar,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      const updated = data.data || { ...user, name, address, avatar_url: avatar };
      onUpdateUser(updated);
      setMsg(t.profile_updated || 'Profile updated successfully!');
      setTimeout(() => {
        setMsg('');
        onClose();
      }, 1200);
    } catch (e) {
      setErr(e.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      background: 'rgba(15,41,77,0.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
    }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: 20,
          maxWidth: 540, width: '100%', maxHeight: '90vh',
          overflowY: 'auto', padding: '2rem', position: 'relative',
          boxShadow: '0 20px 60px rgba(29,79,145,0.25)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            background: '#F2F4F7', color: '#6B7280',
            border: 'none', width: 32, height: 32, borderRadius: '50%',
            cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ✕
        </button>

        {/* Title */}
        <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.5rem', color: '#1D4F91', marginBottom: '0.35rem' }}>
          {t.my_profile}
        </h2>
        <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {t.profile_subtitle}
        </p>

        {/* Avatar Section */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          padding: '1rem', background: '#F2F4F7', borderRadius: 16, marginBottom: '1.5rem',
        }}>
          <img
            src={avatar}
            alt="Profile Avatar"
            style={{
              width: 68, height: 68, borderRadius: '50%', objectFit: 'cover',
              border: '3px solid #C9A84C', boxShadow: '0 4px 12px rgba(201,168,76,0.3)',
            }}
          />
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D4F91', display: 'block', marginBottom: '0.4rem' }}>
              {t.choose_avatar}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {AVATAR_OPTIONS.map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`Avatar option ${i + 1}`}
                  onClick={() => setAvatar(imgUrl)}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', cursor: 'pointer',
                    border: avatar === imgUrl ? '2px solid #1D4F91' : '1px solid #D1D5DB',
                    opacity: avatar === imgUrl ? 1 : 0.65,
                    transform: avatar === imgUrl ? 'scale(1.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Editable Fields */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1D4F91', marginBottom: '0.35rem' }}>
              {t.name_label}
            </label>
            <input
              className="form-input"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Madhav Chikoti"
              style={{ width: '100%', margin: 0 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1D4F91', marginBottom: '0.35rem' }}>
              {t.address_label}
            </label>
            <textarea
              className="form-input"
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={t.address_placeholder}
              style={{ width: '100%', margin: 0, resize: 'vertical' }}
            />
          </div>

          {/* Read-Only User Information Section */}
          <div style={{
            background: '#F9FAFB', border: '1px dashed #D1D5DB',
            borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Account Verification Info (Read-Only)
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{t.email_label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F294D' }}>{user.email || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{t.phone_label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F294D' }}>{user.phone || '—'}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{t.role_label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  {user.role || 'buyer'}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>{t.id_label}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#6B7280' }}>
                  {String(user.id || '').substring(0, 12)}…
                </span>
              </div>
            </div>
          </div>

          {err && <p style={{ color: '#DC2626', fontSize: '0.85rem', margin: 0 }}>{err}</p>}
          {msg && <p style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>{msg}</p>}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {loading ? t.saving : t.save_changes}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
