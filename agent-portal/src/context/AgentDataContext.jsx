import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  INITIAL_VISITS,
  INITIAL_BOOKINGS,
  INITIAL_COMMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKETS
} from '../data/mockData.js';

const AgentDataContext = createContext();

export function AgentDataProvider({ children }) {
  // Theme state: dark mode as default (matching the reference monitor photo!)
  const [theme, setTheme] = useState(() => localStorage.getItem('eh_agent_theme') || 'dark');

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    localStorage.setItem('eh_agent_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // ── Reactive Data Stores ──────────────────────────────────
  const [properties, setProperties] = useState(() => {
    try {
      const s = localStorage.getItem('eh_properties');
      return s ? JSON.parse(s) : INITIAL_PROPERTIES;
    } catch { return INITIAL_PROPERTIES; }
  });

  const [leads, setLeads] = useState(() => {
    try {
      const s = localStorage.getItem('eh_leads');
      return s ? JSON.parse(s) : INITIAL_LEADS;
    } catch { return INITIAL_LEADS; }
  });

  const [clients, setClients] = useState(() => {
    try {
      const s = localStorage.getItem('eh_clients');
      return s ? JSON.parse(s) : INITIAL_CLIENTS;
    } catch { return INITIAL_CLIENTS; }
  });

  const [visits, setVisits] = useState(() => {
    try {
      const s = localStorage.getItem('eh_visits');
      return s ? JSON.parse(s) : INITIAL_VISITS;
    } catch { return INITIAL_VISITS; }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      const s = localStorage.getItem('eh_bookings');
      return s ? JSON.parse(s) : INITIAL_BOOKINGS;
    } catch { return INITIAL_BOOKINGS; }
  });

  const [commissions, setCommissions] = useState(() => {
    try {
      const s = localStorage.getItem('eh_commissions');
      return s ? JSON.parse(s) : INITIAL_COMMISSIONS;
    } catch { return INITIAL_COMMISSIONS; }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const s = localStorage.getItem('eh_notifications');
      return s ? JSON.parse(s) : INITIAL_NOTIFICATIONS;
    } catch { return INITIAL_NOTIFICATIONS; }
  });

  const [tickets, setTickets] = useState(() => {
    try {
      const s = localStorage.getItem('eh_tickets');
      return s ? JSON.parse(s) : INITIAL_TICKETS;
    } catch { return INITIAL_TICKETS; }
  });

  // Global search modal trigger
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Keyboard shortcut for global search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eh_properties', JSON.stringify(properties));
      localStorage.setItem('eh_leads', JSON.stringify(leads));
      localStorage.setItem('eh_clients', JSON.stringify(clients));
      localStorage.setItem('eh_visits', JSON.stringify(visits));
      localStorage.setItem('eh_bookings', JSON.stringify(bookings));
      localStorage.setItem('eh_commissions', JSON.stringify(commissions));
      localStorage.setItem('eh_notifications', JSON.stringify(notifications));
      localStorage.setItem('eh_tickets', JSON.stringify(tickets));
    } catch (e) {
      console.error('LocalStorage sync error', e);
    }
  }, [properties, leads, clients, visits, bookings, commissions, notifications, tickets]);

  // ── Lead Operations ───────────────────────────────────────
  const addLead = (newLeadData) => {
    const lead = {
      id: `LEAD-${Math.floor(800 + Math.random() * 900)}`,
      customerName: newLeadData.customerName,
      phone: newLeadData.phone,
      email: newLeadData.email || '',
      interestedPropertyId: newLeadData.interestedPropertyId || '',
      interestedPropertyTitle: newLeadData.interestedPropertyTitle || 'General Enquiry',
      budget: newLeadData.budget || 'Open',
      location: newLeadData.location || 'Hyderabad',
      source: newLeadData.source || 'Agent Added',
      status: 'NEW',
      lastContact: 'Just now',
      nextFollowUp: newLeadData.nextFollowUp || 'Tomorrow, 11:00 AM',
      assignedAgent: newLeadData.assignedAgent || 'Rajesh Sharma',
      notes: newLeadData.notes || 'Lead created via Agent Portal.',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads(prev => [lead, ...prev]);
    addToast(`Lead for ${lead.customerName} added successfully!`, 'success');

    // Also auto-add notification
    const notif = {
      id: `NOTIF-${Date.now()}`,
      type: 'lead',
      title: 'New Lead Created',
      message: `${lead.customerName} added to leads queue (${lead.interestedPropertyTitle}).`,
      timestamp: 'Just now',
      read: false,
      badge: 'NEW LEAD'
    };
    setNotifications(prev => [notif, ...prev]);
    return lead;
  };

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, lastContact: 'Just now' } : l));
    addToast(`Lead status updated to ${newStatus}`, 'info');
  };

  const updateLead = (leadId, updatedData) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updatedData } : l));
    addToast('Lead details updated', 'success');
  };

  const deleteLead = (leadId) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addToast('Lead removed', 'info');
  };

  const addLeadNote = (leadId, noteText) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedNotes = `${l.notes}\n[${timeStr}]: ${noteText}`;
        return { ...l, notes: updatedNotes, lastContact: 'Just now' };
      }
      return l;
    }));
    addToast('Follow-up note logged', 'success');
  };

  // ── Client Operations ─────────────────────────────────────
  const addClient = (clientData) => {
    const newClient = {
      id: `CLI-${Math.floor(500 + Math.random() * 500)}`,
      name: clientData.name,
      phone: clientData.phone,
      email: clientData.email || '',
      budget: clientData.budget || '',
      preferredLocation: clientData.preferredLocation || '',
      propertyType: clientData.propertyType || '',
      requirements: clientData.requirements || '',
      assignedProperties: clientData.assignedProperties || [],
      notes: clientData.notes || '',
      lastContact: 'Just now',
      nextFollowUp: clientData.nextFollowUp || 'In 2 days',
      status: 'Active'
    };
    setClients(prev => [newClient, ...prev]);
    addToast(`Client ${newClient.name} added to CRM`, 'success');
    return newClient;
  };

  const updateClient = (clientId, updatedData) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, ...updatedData } : c));
    addToast('Client details updated', 'success');
  };

  const deleteClient = (clientId) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    addToast('Client record deleted', 'info');
  };

  // ── Site Visit Operations ─────────────────────────────────
  const scheduleVisit = (visitData) => {
    const newVisit = {
      id: `VIS-${Math.floor(900 + Math.random() * 500)}`,
      clientId: visitData.clientId || '',
      clientName: visitData.clientName,
      clientPhone: visitData.clientPhone || '',
      propertyId: visitData.propertyId || '',
      propertyTitle: visitData.propertyTitle,
      location: visitData.location || '',
      date: visitData.date,
      time: visitData.time,
      agentName: visitData.agentName || 'Rajesh Sharma',
      status: 'Scheduled',
      notes: visitData.notes || 'Site visit appointment scheduled.'
    };
    setVisits(prev => [newVisit, ...prev]);
    addToast(`Site visit scheduled with ${newVisit.clientName}`, 'success');

    // Add notification
    const notif = {
      id: `NOTIF-${Date.now()}`,
      type: 'visit',
      title: 'Site Visit Confirmed',
      message: `Visit for ${newVisit.propertyTitle} with ${newVisit.clientName} on ${newVisit.date} at ${newVisit.time}.`,
      timestamp: 'Just now',
      read: false,
      badge: 'VISIT'
    };
    setNotifications(prev => [notif, ...prev]);
    return newVisit;
  };

  const updateVisitStatus = (visitId, newStatus, feedbackNotes = '') => {
    setVisits(prev => prev.map(v => {
      if (v.id === visitId) {
        return {
          ...v,
          status: newStatus,
          notes: feedbackNotes ? `${v.notes} | ${feedbackNotes}` : v.notes
        };
      }
      return v;
    }));
    addToast(`Visit marked as ${newStatus}`, 'info');
  };

  // ── Commission Operations ─────────────────────────────────
  const requestCommissionPayout = (commissionId) => {
    setCommissions(prev => prev.map(c => {
      if (c.id === commissionId) {
        return { ...c, status: 'Processing', referenceId: `TXN-PRC-${Math.floor(10000 + Math.random() * 90000)}` };
      }
      return c;
    }));
    addToast('Commission payout request submitted to Admin', 'success');
  };

  // ── Notification Operations ───────────────────────────────
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('Notifications cleared', 'info');
  };

  // ── Ticket Operations ─────────────────────────────────────
  const createTicket = (ticketData) => {
    const newTicket = {
      id: `TCK-${Math.floor(880 + Math.random() * 200)}`,
      subject: ticketData.subject,
      category: ticketData.category || 'General',
      priority: ticketData.priority || 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0],
      description: ticketData.description
    };
    setTickets(prev => [newTicket, ...prev]);
    addToast('Support ticket raised. Team will respond within 4 business hours.', 'success');
    return newTicket;
  };

  return (
    <AgentDataContext.Provider value={{
      theme,
      toggleTheme,
      properties,
      leads,
      clients,
      visits,
      bookings,
      commissions,
      notifications,
      tickets,
      toasts,
      addToast,
      isSearchOpen,
      setIsSearchOpen,
      // CRUD helpers
      addLead,
      updateLeadStatus,
      updateLead,
      deleteLead,
      addLeadNote,
      addClient,
      updateClient,
      deleteClient,
      scheduleVisit,
      updateVisitStatus,
      requestCommissionPayout,
      markNotificationRead,
      markAllNotificationsRead,
      clearNotifications,
      createTicket
    }}>
      {children}
    </AgentDataContext.Provider>
  );
}

export function useAgentData() {
  const context = useContext(AgentDataContext);
  if (!context) throw new Error('useAgentData must be used within an AgentDataProvider');
  return context;
}
