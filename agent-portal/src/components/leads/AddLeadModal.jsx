import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AddLeadModal({ isOpen, onClose }) {
  const { addLead, properties } = useAgentData();
  const { currentAgent } = useAuth();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    interestedPropertyId: properties[0]?.id || '',
    budget: '₹2 Cr - ₹5 Cr',
    location: 'Hyderabad',
    source: 'Direct Client Call',
    nextFollowUp: 'Tomorrow, 11:00 AM',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone) {
      alert('Please enter customer name and phone number');
      return;
    }

    const matchedProp = properties.find(p => p.id === formData.interestedPropertyId);

    addLead({
      ...formData,
      interestedPropertyTitle: matchedProp ? matchedProp.title : 'General Enquiry',
      assignedAgent: currentAgent?.name || 'Rajesh Sharma'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead to Pipeline"
      maxWidth="620px"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <i className="fa-solid fa-plus"></i> Create Lead
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Customer Full Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Ramesh Chandra"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <input
              type="tel"
              required
              className="form-input"
              placeholder="+91 98490 XXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="client@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Budget</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ₹3 Cr - ₹4 Cr"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Interested Property</label>
            <select
              className="form-select"
              value={formData.interestedPropertyId}
              onChange={(e) => setFormData({ ...formData, interestedPropertyId: e.target.value })}
            >
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.priceFormatted})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Lead Source</label>
            <select
              className="form-select"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              <option value="Direct Referral">Direct Referral</option>
              <option value="Website Enquiry">Website Enquiry</option>
              <option value="MagicBricks">MagicBricks</option>
              <option value="Housing.com">Housing.com</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="Cold Call">Cold Call</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Next Follow-up Date & Time</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Tomorrow, 04:00 PM"
            value={formData.nextFollowUp}
            onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Initial Discussion / Requirements Note</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Describe client specific criteria, family size, timeline to purchase..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
