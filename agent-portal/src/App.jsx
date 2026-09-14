import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { AgentDataProvider, useAgentData } from './context/AgentDataContext.jsx';
import './styles/agent.css';

// Layout & Common
import AgentSidebar from './components/layout/AgentSidebar.jsx';
import AgentHeader from './components/layout/AgentHeader.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import QuickGlobalSearch from './components/layout/QuickGlobalSearch.jsx';
import Toast from './components/common/Toast.jsx';

// Pages
import LandingAndLogin from './pages/LandingAndLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import PropertiesPage from './pages/PropertiesPage.jsx';
import ClientsPage from './pages/ClientsPage.jsx';
import SiteVisitsPage from './pages/SiteVisitsPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import EarningsPage from './pages/EarningsPage.jsx';
import PerformancePage from './pages/PerformancePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import SupportPage from './pages/SupportPage.jsx';

// Global Modals
import AddLeadModal from './components/leads/AddLeadModal.jsx';
import ScheduleVisitModal from './components/visits/ScheduleVisitModal.jsx';
import PropertyDetailModal from './components/properties/PropertyDetailModal.jsx';
import SharePropertyModal from './components/properties/SharePropertyModal.jsx';

function MainPortal() {
  const { currentAgent } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Global modal triggers
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);
  const [selectedPropertyModal, setSelectedPropertyModal] = useState(null);
  const [sharePropertyModal, setSharePropertyModal] = useState(null);
  const [initialLeadForVisit, setInitialLeadForVisit] = useState(null);
  const [initialPropForVisit, setInitialPropForVisit] = useState(null);

  if (!currentAgent) {
    return <LandingAndLogin />;
  }

  const handleGlobalSearchResult = (tab, item) => {
    setActiveTab(tab);
    if (tab === 'properties') setSelectedPropertyModal(item);
  };

  const handleScheduleVisitForLead = (lead) => {
    setInitialLeadForVisit(lead);
    setIsScheduleVisitOpen(true);
  };

  const handleScheduleVisitForProperty = (prop) => {
    setInitialPropForVisit(prop);
    setIsScheduleVisitOpen(true);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigateTab={setActiveTab}
            onSelectProperty={(p) => setSelectedPropertyModal(p)}
            onShareProperty={(p) => setSharePropertyModal(p)}
            onOpenScheduleVisit={() => setIsScheduleVisitOpen(true)}
            onOpenAddLead={() => setIsAddLeadOpen(true)}
          />
        );
      case 'leads':
        return <LeadsPage onScheduleVisitForLead={handleScheduleVisitForLead} />;
      case 'properties':
        return (
          <PropertiesPage
            onSelectProperty={(p) => setSelectedPropertyModal(p)}
            onShareProperty={(p) => setSharePropertyModal(p)}
            onScheduleVisit={handleScheduleVisitForProperty}
            onAddLeadForProperty={() => setIsAddLeadOpen(true)}
          />
        );
      case 'clients':
        return <ClientsPage />;
      case 'visits':
        return <SiteVisitsPage />;
      case 'bookings':
        return <BookingsPage />;
      case 'earnings':
        return <EarningsPage />;
      case 'performance':
        return <PerformancePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'support':
        return <SupportPage />;
      default:
        return (
          <Dashboard
            onNavigateTab={setActiveTab}
            onSelectProperty={(p) => setSelectedPropertyModal(p)}
            onShareProperty={(p) => setSharePropertyModal(p)}
            onOpenScheduleVisit={() => setIsScheduleVisitOpen(true)}
            onOpenAddLead={() => setIsAddLeadOpen(true)}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Responsive Sidebar */}
      <AgentSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace Wrapper */}
      <div className={`main-content-wrapper ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <AgentHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddLead={() => setIsAddLeadOpen(true)}
          onOpenScheduleVisit={() => setIsScheduleVisitOpen(true)}
        />

        <main style={{ minHeight: 'calc(100vh - 72px)' }}>
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Global Quick Search (Ctrl+K) */}
      <QuickGlobalSearch onSelectResult={handleGlobalSearchResult} />

      {/* Toast Alert System */}
      <Toast />

      {/* Global Modals */}
      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
      />

      <ScheduleVisitModal
        isOpen={isScheduleVisitOpen}
        onClose={() => {
          setIsScheduleVisitOpen(false);
          setInitialLeadForVisit(null);
          setInitialPropForVisit(null);
        }}
        initialProperty={initialPropForVisit}
        initialLead={initialLeadForVisit}
      />

      {selectedPropertyModal && (
        <PropertyDetailModal
          property={selectedPropertyModal}
          isOpen={!!selectedPropertyModal}
          onClose={() => setSelectedPropertyModal(null)}
          onShare={(p) => { setSelectedPropertyModal(null); setSharePropertyModal(p); }}
          onScheduleVisit={(p) => { setSelectedPropertyModal(null); handleScheduleVisitForProperty(p); }}
          onAddLeadForProperty={() => { setSelectedPropertyModal(null); setIsAddLeadOpen(true); }}
        />
      )}

      {sharePropertyModal && (
        <SharePropertyModal
          property={sharePropertyModal}
          isOpen={!!sharePropertyModal}
          onClose={() => setSharePropertyModal(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AgentDataProvider>
        <MainPortal />
      </AgentDataProvider>
    </AuthProvider>
  );
}
