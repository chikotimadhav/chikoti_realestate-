// ============================================================
// ESTATEHUB AGENT PORTAL — Configuration & Database API Endpoint
// ============================================================

export const API_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://chikoti-realestate.onrender.com');

export const APP_CONFIG = {
  appName: 'EstateHub Agent Portal',
  tagline: 'Your Properties. Your Leads. Your Growth.',
  portalUrl: 'https://agent-portal-henna.vercel.app',
  buyerPortalUrl: 'https://estateshub.vercel.app',
  sellerPortalUrl: 'https://estateshub-seller-portal.vercel.app',
  apiTimeout: 10000,
};
