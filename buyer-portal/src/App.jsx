import React, { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/Home.jsx';
import PropertiesPage from './pages/Properties.jsx';
import PropertyDetailModal from './components/PropertyDetailModal.jsx';
import UpdatesAlertsModal from './components/UpdatesAlertsModal.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import { translations } from './i18n/translations.js';
import { API_URL } from './config.js';

export default function App() {
  const [page, setPage] = useState('home');
  const [detail, setDetail] = useState(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('ck_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ck_user'));
    } catch {
      return null;
    }
  });

  const t = translations[lang] || translations.en;

  const onChangeLang = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('ck_lang', newLang);
    } catch {
      // ignore storage error
    }
  };

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  const openDetail = (property) => setDetail(property);
  const closeDetail = () => setDetail(null);

  const onLogin = (userData, token) => {
    try {
      localStorage.setItem('ck_user', JSON.stringify(userData));
      if (token) localStorage.setItem('ck_token', token);
    } catch {
      // ignore storage error
    }
    setUser(userData);
  };

  const onLogout = () => {
    try {
      localStorage.removeItem('ck_user');
      localStorage.removeItem('ck_token');
    } catch {
      // ignore storage error
    }
    setUser(null);
    setShowProfile(false);
    navigate('home');
  };

  const onUpdateUser = (updatedUser) => {
    try {
      localStorage.setItem('ck_user', JSON.stringify(updatedUser));
    } catch {
      // ignore storage error
    }
    setUser(updatedUser);
  };

  // Open property directly from an alert click
  const onSelectPropertyFromAlert = async (propertyId) => {
    try {
      const res = await fetch(`${API_URL}/api/properties/${propertyId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setDetail(data.data);
      }
    } catch (e) {
      console.error('Failed to load alert property:', e);
    }
  };

  const pages = {
    home: <HomePage navigate={navigate} openDetail={openDetail} t={t} />,
    properties: <PropertiesPage navigate={navigate} openDetail={openDetail} user={user} t={t} />,
  };

  return (
    <>
      <Header
        page={page}
        navigate={navigate}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        currentLang={lang}
        onChangeLang={onChangeLang}
        t={t}
        onOpenAlerts={() => setShowAlerts(true)}
        onOpenProfile={() => setShowProfile(true)}
      />

      <main style={{ minHeight: '80vh' }}>
        {pages[page] || pages.home}
      </main>

      <Footer navigate={navigate} t={t} />

      {/* Property Detail Modal */}
      {detail && (
        <PropertyDetailModal
          property={detail}
          onClose={closeDetail}
          user={user}
          t={t}
        />
      )}

      {/* Updates & Alerts Slide-Over Modal */}
      <UpdatesAlertsModal
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
        onSelectProperty={onSelectPropertyFromAlert}
        t={t}
      />

      {/* Profile & Edit Profile Modal (Name & Address only editable) */}
      <EditProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onUpdateUser={onUpdateUser}
        t={t}
      />
    </>
  );
}
