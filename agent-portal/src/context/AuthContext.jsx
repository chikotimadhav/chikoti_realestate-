import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_AGENTS } from '../data/mockData.js';
import { loginAgentToDatabase } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [agents, setAgents] = useState(() => {
    try {
      const saved = localStorage.getItem('eh_all_agents');
      return saved ? JSON.parse(saved) : INITIAL_AGENTS;
    } catch {
      return INITIAL_AGENTS;
    }
  });

  const [currentAgent, setCurrentAgent] = useState(() => {
    try {
      const saved = localStorage.getItem('eh_current_agent');
      if (saved) return JSON.parse(saved);
      // Default to approved super-agent Rajesh Sharma for immediate rich demonstration
      return INITIAL_AGENTS[0];
    } catch {
      return INITIAL_AGENTS[0];
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('eh_agent_token') || 'demo_token_rajesh');

  useEffect(() => {
    try {
      localStorage.setItem('eh_all_agents', JSON.stringify(agents));
    } catch (e) {
      console.error('Failed to save agents to localStorage', e);
    }
  }, [agents]);

  useEffect(() => {
    try {
      if (currentAgent) {
        localStorage.setItem('eh_current_agent', JSON.stringify(currentAgent));
      } else {
        localStorage.removeItem('eh_current_agent');
      }
    } catch (e) {
      console.error('Failed to save current agent', e);
    }
  }, [currentAgent]);

  // Login handler
  const login = async (identifier, password) => {
    // 1. Attempt database authentication first
    try {
      const dbAuth = await loginAgentToDatabase(identifier.trim(), password);
      if (dbAuth.ok && dbAuth.data?.user) {
        const u = dbAuth.data.user;
        const dbAgent = {
          id: u.id || u._id || `agt_${Date.now()}`,
          name: u.name,
          email: u.email,
          phone: u.phone || '+91 98490 XXXXX',
          city: u.city || 'Hyderabad',
          agencyName: u.agency_name || 'EstateHub Real Estate',
          reraNumber: u.rera_number || 'TS-RERA-A51800034921',
          experienceYears: 5,
          status: 'Approved',
          avatar: u.avatar_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256',
          areasServed: ['Jubilee Hills', 'Kokapet', 'Financial District'],
          propertyTypes: ['Villas', 'Apartments', 'Commercial'],
          rating: 4.9,
          reviewsCount: 38,
          propertiesHandled: 24,
          successfulSales: 18,
          verification: { identity: true, rera: true, phone: true, email: true },
          bankDetails: { accountHolder: u.name, bankName: 'HDFC Bank', accountNumber: '•••• 8841', ifsc: 'HDFC0000240' }
        };
        setCurrentAgent(dbAgent);
        setToken(dbAuth.data.token);
        localStorage.setItem('eh_agent_token', dbAuth.data.token);
        return { success: true, agent: dbAgent };
      }
    } catch (err) {
      console.warn('Database auth fallback to demo accounts:', err);
    }

    // 2. Find matching agent by email or phone in local accounts
    const cleanId = identifier.trim().toLowerCase();
    const found = agents.find(a => 
      a.email.toLowerCase() === cleanId || 
      a.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (found) {
      setCurrentAgent(found);
      const fakeToken = `agt_token_${found.id}_${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem('eh_agent_token', fakeToken);
      return { success: true, agent: found };
    }

    // Default fallback demo login if credentials don't match exactly
    const defaultAgent = agents[0];
    setCurrentAgent(defaultAgent);
    setToken(`agt_token_${defaultAgent.id}_${Date.now()}`);
    return { success: true, agent: defaultAgent };
  };

  // Switch demo account instantly for quick evaluation
  const switchDemoAgent = (agentId) => {
    const target = agents.find(a => a.id === agentId);
    if (target) {
      setCurrentAgent(target);
      const fakeToken = `agt_token_${target.id}_${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem('eh_agent_token', fakeToken);
    }
  };

  // Agent application registration
  const registerAgentApplication = (formData) => {
    const newAgent = {
      id: `agt_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city || 'Hyderabad',
      agencyName: formData.agencyName || 'Independent Agent',
      reraNumber: formData.reraNumber || `TS-RERA-A${Math.floor(10000000 + Math.random() * 90000000)}`,
      experienceYears: parseInt(formData.experienceYears || '1', 10),
      status: 'Under Review', // Default review state for new applicants
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      areasServed: formData.areasServed ? formData.areasServed.split(',').map(s => s.trim()) : ['Hyderabad Central'],
      propertyTypes: formData.propertyTypes || ['Apartments', 'Villas'],
      rating: 5.0,
      reviewsCount: 0,
      propertiesHandled: 0,
      successfulSales: 0,
      verification: {
        identity: true,
        rera: false,
        phone: true,
        email: true,
        documentUrl: 'uploaded_verification_docket.pdf'
      }
    };

    setAgents(prev => [newAgent, ...prev]);
    setCurrentAgent(newAgent);
    setToken(`agt_token_${newAgent.id}_${Date.now()}`);
    return newAgent;
  };

  // Update profile
  const updateProfile = (updatedFields) => {
    if (!currentAgent) return;
    const updated = { ...currentAgent, ...updatedFields };
    setCurrentAgent(updated);
    setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const logout = () => {
    setCurrentAgent(null);
    setToken(null);
    localStorage.removeItem('eh_current_agent');
    localStorage.removeItem('eh_agent_token');
  };

  return (
    <AuthContext.Provider value={{
      currentAgent,
      token,
      agents,
      login,
      switchDemoAgent,
      registerAgentApplication,
      updateProfile,
      logout,
      isAuthenticated: !!currentAgent
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
