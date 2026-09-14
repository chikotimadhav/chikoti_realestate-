import React from 'react';

export default function StatusBadge({ status, type = 'lead' }) {
  if (!status) return null;

  const getStyleClass = () => {
    const s = String(status).toUpperCase();
    switch (s) {
      // Lead statuses
      case 'NEW':
        return 'badge-new';
      case 'CONTACTED':
        return 'badge-contacted';
      case 'QUALIFIED':
        return 'badge-qualified';
      case 'SITE VISIT':
      case 'SITE_VISIT':
        return 'badge-site-visit';
      case 'NEGOTIATION':
        return 'badge-negotiation';
      case 'BOOKED':
        return 'badge-booked';
      case 'CLOSED':
        return 'badge-closed';
      case 'LOST':
        return 'badge-lost';

      // Visit statuses
      case 'SCHEDULED':
        return 'badge-scheduled';
      case 'CONFIRMED':
        return 'badge-confirmed';
      case 'COMPLETED':
        return 'badge-completed';
      case 'RESCHEDULED':
        return 'badge-rescheduled';
      case 'CANCELLED':
        return 'badge-cancelled';

      // Commission / Booking statuses
      case 'PENDING':
        return 'badge-pending';
      case 'APPROVED':
        return 'badge-approved';
      case 'PROCESSING':
        return 'badge-processing';
      case 'PAID':
        return 'badge-paid';

      // Agent verification
      case 'UNDER REVIEW':
        return 'badge-contacted';
      case 'REJECTED':
        return 'badge-lost';

      default:
        return 'badge-new';
    }
  };

  const getIcon = () => {
    const s = String(status).toUpperCase();
    if (s === 'CLOSED' || s === 'COMPLETED' || s === 'PAID' || s === 'APPROVED') {
      return <i className="fa-solid fa-check-circle" style={{ fontSize: '0.65rem' }}></i>;
    }
    if (s === 'LOST' || s === 'CANCELLED' || s === 'REJECTED') {
      return <i className="fa-solid fa-circle-xmark" style={{ fontSize: '0.65rem' }}></i>;
    }
    if (s === 'SITE VISIT' || s === 'SITE_VISIT') {
      return <i className="fa-solid fa-location-dot" style={{ fontSize: '0.65rem' }}></i>;
    }
    if (s === 'NEGOTIATION') {
      return <i className="fa-solid fa-handshake" style={{ fontSize: '0.65rem' }}></i>;
    }
    if (s === 'NEW') {
      return <i className="fa-solid fa-sparkles" style={{ fontSize: '0.65rem' }}></i>;
    }
    return <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>;
  };

  return (
    <span className={`badge ${getStyleClass()}`}>
      {getIcon()}
      {status}
    </span>
  );
}
