import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';

export default function AddClientModal({ isOpen, onClose }) {
  const { addClient } = useAgentData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    budget: '₹3 Cr - ₹5 Cr',
    preferredLocation: 'Jubilee Hills, Kokapet',
    propertyType: 'Villas & Penthouses',
    requirements: '',
    notes: '',
    nextFollowUp: 'In 3 days'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Name and phone are required');
      return;
    }
    addClient(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Client to CRM"
      maxWidth="620px"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <i className="fa-solid fa-user-plus"></i> Save Client
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Anand Mahindra"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
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
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="client@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Budget Range</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. ₹2.5 Cr - ₹4 Cr"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Preferred Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Financial District, Kokapet"
              value={formData.preferredLocation}
              onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Property Preference</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 4 BHK Gated Villa"
              value={formData.propertyType}
              onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Requirements & Specific Preferences</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Vaastu compliant, East facing, high floor, private garden..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Initial Relationship Notes</label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="How was the contact initiated? Decision makers involved?"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
