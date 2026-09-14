import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

export default function Header({
  page,
  navigate,
  user,
  onLogin,
  onLogout,
  currentLang,
  onChangeLang,
  t,
  onOpenAlerts,
  onOpenProfile,
}) {
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'buyer' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  // Poll alert count periodically for real-time notifications
  useEffect(() => {
    fetchAlertCount();
    const timer = setInterval(fetchAlertCount, 15000);
    return () => clearInterval(timer);
  }, []);

  async function fetchAlertCount() {
    try {
      const res = await fetch(`${API_URL}/api/updates`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAlertCount(data.data.length);
      }
    } catch {
      // ignore network errors
    }
  }

  async function handleAuth(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const endpoint = tab === 'login'
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/register`;
      const body = tab === 'login'
        ? { email: form.email, password: form.password }
        : form;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onLogin(data.data.user, data.data.token);
      setShowLogin(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: 'rgba(29, 79, 145, 0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        padding: '0 1.5rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
          {/* Brand Logo + Telangana location */}
          <div onClick={() => navigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(135deg,#C9A84C,#F0C040)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 22, color: '#1D4F91',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              E
            </div>
            <div>
              <span style={{ fontFamily: 'Playfair Display', fontWeight: 700, fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.5px', display: 'block', lineHeight: 1.1 }}>
                {t.app_name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#F0C040', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                📍 {t.telangana}
              </span>
            </div>
          </div>

          {/* Desktop Nav Actions */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => navigate('home')}
              style={{
                background: 'none', color: page === 'home' ? '#F0C040' : '#E2E8F0',
                fontWeight: page === 'home' ? 700 : 500, fontSize: '0.95rem',
                borderBottom: page === 'home' ? '2px solid #F0C040' : '2px solid transparent',
                paddingBottom: '2px', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {t.home}
            </button>

            <button
              onClick={() => navigate('properties')}
              style={{
                background: 'none', color: page === 'properties' ? '#F0C040' : '#E2E8F0',
                fontWeight: page === 'properties' ? 700 : 500, fontSize: '0.95rem',
                borderBottom: page === 'properties' ? '2px solid #F0C040' : '2px solid transparent',
                paddingBottom: '2px', cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              {t.properties}
            </button>

            <a
              href="https://estateshub-seller-portal.vercel.app/"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#CBD5E1', fontSize: '0.9rem', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#F0C040'}
              onMouseLeave={e => e.target.style.color = '#CBD5E1'}
            >
              {t.list_property} ↗
            </a>

            {/* Language Switcher Selector */}
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)',
              borderRadius: 20, padding: '2px 6px', border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <span style={{ fontSize: '0.8rem', marginRight: 4 }}>🌐</span>
              {[
                { code: 'en', label: 'EN' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'hi', label: 'हिन्दी' },
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onChangeLang(lang.code)}
                  style={{
                    background: currentLang === lang.code ? '#F0C040' : 'none',
                    color: currentLang === lang.code ? '#1D4F91' : '#FFFFFF',
                    fontWeight: currentLang === lang.code ? 800 : 500,
                    fontSize: '0.78rem', padding: '3px 8px', borderRadius: 14,
                    cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Updates & Alerts Notification Bell Button */}
            <button
              onClick={onOpenAlerts}
              title={t.updates_alerts}
              style={{
                position: 'relative', background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(201,168,76,0.3)', width: 38, height: 38,
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#F0C040', fontSize: '1.1rem',
              }}
            >
              🔔
              {alertCount > 0 && (
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  background: '#DC2626', color: 'white',
                  borderRadius: '50%', minWidth: 18, height: 18,
                  fontSize: '0.7rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 2px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                }}>
                  {alertCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Action */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={onOpenProfile}
                  title={t.edit_profile}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'rgba(255,255,255,0.1)', padding: '0.35rem 0.8rem',
                    borderRadius: 20, border: '1px solid rgba(201,168,76,0.4)',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={user.avatar_url || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="User Avatar"
                    style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ color: '#F0C040', fontWeight: 700, fontSize: '0.88rem' }}>
                    {user.name ? user.name.split(' ')[0] : 'Profile'}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="btn-outline"
                  style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem', borderColor: 'rgba(255,255,255,0.4)', color: '#FFFFFF' }}
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="btn-gold"
                style={{ padding: '0.5rem 1.3rem', fontSize: '0.9rem' }}
              >
                {t.login}
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Login / Register Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1100,
          background: 'rgba(15, 41, 77, 0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        }}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{
            background: '#FFFFFF', borderRadius: 20, padding: '2rem',
            maxWidth: 440, width: '100%', position: 'relative',
            boxShadow: '0 20px 60px rgba(29,79,145,0.3)',
          }}>
            <button
              onClick={() => setShowLogin(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: '#F2F4F7', border: 'none', width: 32, height: 32, borderRadius: '50%',
                fontSize: 16, color: '#6B7280', cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.6rem', color: '#1D4F91', marginBottom: '0.25rem' }}>
              {tab === 'login' ? 'Welcome back' : 'Create Account'}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              {tab === 'login' ? 'Sign in to access your saved properties across app and web' : 'Unified access across EstateHub Web & Mobile'}
            </p>

            {/* Tab switch */}
            <div style={{ display: 'flex', borderBottom: '2px solid #F2F4F7', marginBottom: '1.5rem' }}>
              {['login', 'register'].map(m => (
                <button
                  key={m}
                  onClick={() => setTab(m)}
                  style={{
                    flex: 1, padding: '0.6rem', background: 'none',
                    color: tab === m ? '#1D4F91' : '#6B7280',
                    borderBottom: tab === m ? '3px solid #1D4F91' : '3px solid transparent',
                    fontWeight: tab === m ? 700 : 500, fontSize: '0.9rem', marginBottom: -2,
                    cursor: 'pointer', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  }}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tab === 'register' && (
                <>
                  <input
                    className="form-input"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="form-input"
                    placeholder="Phone Number (e.g. +91 98765 43210)"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </>
              )}
              <input
                className="form-input"
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="form-input"
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              {err && <p style={{ color: '#DC2626', fontSize: '0.85rem', margin: 0 }}>{err}</p>}
              <button
                type="submit"
                className="btn-gold"
                style={{ justifyContent: 'center', padding: '0.8rem' }}
                disabled={loading}
              >
                {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
