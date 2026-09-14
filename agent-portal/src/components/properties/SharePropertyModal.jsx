import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SharePropertyModal({ property, isOpen, onClose }) {
  const { clients, addToast } = useAgentData();
  const { currentAgent } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  if (!property) return null;

  const brandedLink = `https://estateshub.vercel.app/property/${property.slug || property.id}?agent=${encodeURIComponent(currentAgent?.name || 'EstateHubAgent')}&ref=EH-${property.id}`;

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const shareText = `*Exclusive Property Recommendation from EstateHub*\n\n🏡 *${property.title}*\n📍 *Location:* ${property.location}\n💰 *Price:* ${property.priceFormatted} (${property.area})\n✨ *Type:* ${property.type}\n\nKey Highlights: ${property.amenities?.slice(0, 3).join(', ')}\n\n🔗 *View Full Verified Listing & Photos:*\n${brandedLink}\n\nPlease let me know if you would like to schedule a private walkthrough this week!\n\nWarm regards,\n*${currentAgent?.name || 'Agent'}*\n${currentAgent?.agencyName || 'EstateHub Real Estate'}\n📞 ${currentAgent?.phone || '+91 98765 43210'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    addToast('Branded property summary copied to clipboard!', 'success');
  };

  const handleSendToSelectedClient = () => {
    if (!selectedClient) return;
    const cleanPhone = selectedClient.phone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
    addToast(`WhatsApp opened for ${selectedClient.name}`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Property with Client"
      maxWidth="600px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', width: '100%' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-neon btn-sm" onClick={handleSendToSelectedClient}>
            <i className="fa-brands fa-whatsapp"></i> Send via WhatsApp
          </button>
        </div>
      }
    >
      {/* Property Summary Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        background: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <img
          src={property.image}
          alt={property.title}
          style={{ width: 60, height: 46, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal-light)' }}>
            {property.priceFormatted} • {property.location}
          </div>
        </div>
      </div>

      {/* Select Registered Client */}
      <div className="form-group">
        <label className="form-label">Select Registered Client from CRM</label>
        <select
          className="form-select"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.phone}) — Budget: {c.budget}
            </option>
          ))}
        </select>
      </div>

      {/* Message Preview Box */}
      <div className="form-group">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <label className="form-label" style={{ marginBottom: 0 }}>Branded Share Message</label>
          <button 
            type="button" 
            onClick={handleCopy}
            style={{ fontSize: '0.75rem', color: 'var(--teal-light)', fontWeight: 700 }}
          >
            <i className="fa-solid fa-copy"></i> Copy Text
          </button>
        </div>
        <textarea
          readOnly
          className="form-textarea"
          rows="7"
          value={shareText}
          style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'var(--bg-input)' }}
        ></textarea>
      </div>
    </Modal>
  );
}
