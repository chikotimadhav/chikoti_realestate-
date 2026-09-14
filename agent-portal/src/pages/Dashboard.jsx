import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useAgentData } from '../context/AgentDataContext.jsx';
import StatCard from '../components/common/StatCard.jsx';
import ProjectedProfitBar from '../components/dashboard/ProjectedProfitBar.jsx';
import LeadSourceWidget from '../components/dashboard/LeadSourceWidget.jsx';
import PropertySpotlight from '../components/dashboard/PropertySpotlight.jsx';
import PipelineTracker from '../components/dashboard/PipelineTracker.jsx';
import TodayVisitsWidget from '../components/dashboard/TodayVisitsWidget.jsx';

export default function Dashboard({ 
  onNavigateTab, 
  onSelectProperty, 
  onShareProperty, 
  onOpenScheduleVisit,
  onOpenAddLead 
}) {
  const { currentAgent } = useAuth();
  const { properties, leads, visits } = useAgentData();

  const isUnderReview = currentAgent?.status === 'Under Review';

  return (
    <div className="page-body">
      {/* Under Review Notice Banner if Agent is still pending accreditation */}
      {isUnderReview && (
        <div style={{
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.35)',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <i className="fa-solid fa-hourglass-half" style={{ fontSize: '1.5rem', color: 'var(--gold-accent)' }}></i>
            <div>
              <strong style={{ color: '#FFF', fontSize: '0.95rem' }}>Agent Accreditation Under Review</strong>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Your RERA document ({currentAgent.reraNumber}) and agency credentials are being verified by EstateHub Compliance Desk. Limited preview access is enabled.
              </p>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('profile')}
            className="btn btn-gold btn-sm"
          >
            Check Verification Status ↗
          </button>
        </div>
      )}

      {/* Main Welcome Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--teal-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              EstateHub Command Center
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Good Morning, {currentAgent?.name?.split(' ')[0] || 'Partner'}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Here's what's happening with your properties and leads today.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={onOpenAddLead}
            className="btn btn-primary"
          >
            <i className="fa-solid fa-user-plus"></i>
            <span>+ Add Lead</span>
          </button>

          <button 
            onClick={onOpenScheduleVisit}
            className="btn btn-outline"
          >
            <i className="fa-solid fa-calendar-plus"></i>
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* 6 Core Stat Cards (Requirement 3) */}
      <div className="stat-card-grid">
        <StatCard
          label="Active Properties"
          value="24"
          delta="+12%"
          deltaType="up"
          deltaPeriod="this month"
          icon="fa-solid fa-building"
          iconBg="rgba(13,148,136,0.18)"
          iconColor="var(--teal-light)"
          onClick={() => onNavigateTab('properties')}
        />

        <StatCard
          label="New Leads"
          value="18"
          delta="+8%"
          deltaType="up"
          deltaPeriod="this week"
          icon="fa-solid fa-users"
          iconBg="rgba(59,130,246,0.18)"
          iconColor="#60A5FA"
          onClick={() => onNavigateTab('leads')}
        />

        <StatCard
          label="Scheduled Visits"
          value="9"
          delta="3 Today"
          deltaType="neutral"
          deltaPeriod="this week"
          icon="fa-solid fa-calendar-check"
          iconBg="rgba(168,85,247,0.18)"
          iconColor="#C084FC"
          onClick={() => onNavigateTab('visits')}
        />

        <StatCard
          label="Properties Sold"
          value="5"
          delta="+2 deals"
          deltaType="up"
          deltaPeriod="this month"
          icon="fa-solid fa-house-circle-check"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
          onClick={() => onNavigateTab('bookings')}
        />

        <StatCard
          label="Commission Earned"
          value="₹2,45,000"
          delta="+18% MoM"
          deltaType="up"
          deltaPeriod="August payout"
          icon="fa-solid fa-wallet"
          iconBg="rgba(34,197,94,0.18)"
          iconColor="var(--emerald-neon)"
          onClick={() => onNavigateTab('earnings')}
        />

        <StatCard
          label="Pending Commission"
          value="₹85,000"
          delta="In Approval"
          deltaType="neutral"
          deltaPeriod="3 milestones"
          icon="fa-solid fa-clock-rotate-left"
          iconBg="rgba(245,158,11,0.18)"
          iconColor="var(--gold-accent)"
          onClick={() => onNavigateTab('earnings')}
        />
      </div>

      {/* Projected Profit & Segmented Commission Bar (Inspired directly by user reference monitor!) */}
      <ProjectedProfitBar onActionClick={() => onNavigateTab('earnings')} />

      {/* Deal Lifecycle Workflow Pipeline */}
      <PipelineTracker 
        activeStage={5} 
        onStageClick={(stage) => {
          if (stage.num <= 2) onNavigateTab('leads');
          else if (stage.num <= 4) onNavigateTab('visits');
          else if (stage.num <= 6) onNavigateTab('bookings');
          else onNavigateTab('earnings');
        }} 
      />

      {/* Multi-Column Grid: Property Spotlight, Lead Source Widget, Today's Visits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Spotlight Property Preview */}
        <div style={{ gridColumn: 'span 1' }}>
          <PropertySpotlight
            properties={properties}
            onSelectProperty={onSelectProperty}
            onShareProperty={onShareProperty}
          />
        </div>

        {/* Lead Source Breakdown Widget */}
        <div style={{ gridColumn: 'span 1' }}>
          <LeadSourceWidget onNavigateLeads={() => onNavigateTab('leads')} />
        </div>

        {/* Today's Site Visits Widget */}
        <div style={{ gridColumn: 'span 1' }}>
          <TodayVisitsWidget
            visits={visits}
            onNavigateVisits={() => onNavigateTab('visits')}
            onOpenScheduleVisit={onOpenScheduleVisit}
          />
        </div>
      </div>
    </div>
  );
}
