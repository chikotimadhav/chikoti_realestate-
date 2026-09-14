import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { useAgentData } from '../../context/AgentDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ScheduleVisitModal({ isOpen, onClose, initialProperty, initialLead }) {
  const { scheduleVisit, properties, clients } = useAgentData();
  const { currentAgent } = useAuth();

  const [formData, setFormData] = useState({
    clientName: initialLead ? initialLead.customerName : (clients[0]?.name || ''),
    clientPhone: initialLead ? initialLead.phone : (clients[0]?.phone || ''),
    propertyId: initialProperty ? initialProperty.id : (properties[0]?.id || ''),
    date: new Date().toISOString().split('T')[0],
    time: '03:00 PM',
    notes: 'Client requested arrival pass and layout brochure.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.date || !formData.time) {
      alert('Client name, date, and time are required.');
      return;
    }

    const selectedProp = properties.find(p => p.id === formData.propertyId);

    scheduleVisit({
      ...formData,
      propertyTitle: selectedProp ? selectedProp.title : 'Selected Property',
      location: selectedProp ? selectedProp.location : 'Hyderabad',
      agentName: currentAgent?.name || 'Rajesh Sharma'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Property Site Visit"
      maxWidth="620px"
      footer={
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
            <i className="fa-solid fa-calendar-check"></i> Confirm Visit
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Select Property to Visit</label>
          <select
            className="form-select"
            value={formData.propertyId}
            onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
          >
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.location})</option>
            ))}
          </select>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Client Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Vikramaditya Varma"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Client Phone *</label>
            <input
              type="tel"
              required
              className="form-input"
              placeholder="+91 98490 XXXXX"
              value={formData.clientPhone}
              onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Visit Date</label>
            <input
              type="date"
              required
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visit Time Slot</label>
            <select
              className="form-select"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            >
              <option value="10:00 AM">10:00 AM (Morning)</option>
              <option value="11:30 AM">11:30 AM (Pre-Noon)</option>
              <option value="02:00 PM">02:00 PM (Afternoon)</option>
              <option value="03:30 PM">03:30 PM (Mid-day)</option>
              <option value="05:00 PM">05:00 PM (Sunset / Golden Hour)</option>
              <option value="06:30 PM">06:30 PM (Evening)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Special Notes / Access Instructions</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Security gate pass, clubhouse entry, parking slot reservation..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          ></textarea>
        </div>
      </form>
    </Modal>
  );
}
