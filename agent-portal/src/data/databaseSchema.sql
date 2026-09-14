-- ============================================================
-- ESTATEHUB AGENT PORTAL — SUPABASE POSTGRESQL SCHEMA
-- Ready for direct execution in Supabase / Postgres
-- ============================================================

-- 1. AGENTS TABLE
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  city TEXT NOT NULL,
  agency_name TEXT,
  rera_number TEXT UNIQUE NOT NULL,
  experience_years INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('Pending', 'Under Review', 'Approved', 'Rejected', 'Suspended')) DEFAULT 'Pending',
  avatar_url TEXT,
  areas_served JSONB DEFAULT '[]'::JSONB,
  property_types JSONB DEFAULT '[]'::JSONB,
  rating NUMERIC(3,2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  bank_details JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. AGENT DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS agent_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  doc_type TEXT CHECK (doc_type IN ('RERA_CERT', 'PAN', 'AADHAAR', 'AGREEMENT', 'AGENCY_LICENSE')) NOT NULL,
  document_url TEXT NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')) DEFAULT 'Pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  budget TEXT,
  preferred_location TEXT,
  property_type TEXT,
  requirements TEXT,
  assigned_properties JSONB DEFAULT '[]'::JSONB,
  notes TEXT,
  status TEXT DEFAULT 'Active',
  last_contact TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LEADS TABLE (Extending inquiries for agent workflow)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  budget TEXT,
  location TEXT,
  source TEXT DEFAULT 'Direct',
  status TEXT CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'SITE VISIT', 'NEGOTIATION', 'BOOKED', 'CLOSED', 'LOST')) DEFAULT 'NEW',
  last_contact TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. SITE VISITS TABLE
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  status TEXT CHECK (status IN ('Scheduled', 'Confirmed', 'Completed', 'Rescheduled', 'Cancelled')) DEFAULT 'Scheduled',
  feedback_notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  property_value NUMERIC NOT NULL,
  token_amount NUMERIC NOT NULL,
  agent_commission NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Confirmed', 'Cancelled', 'Completed')) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  property_title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  property_value NUMERIC NOT NULL,
  commission_percentage NUMERIC(4,2) NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('Pending', 'Approved', 'Processing', 'Paid')) DEFAULT 'Pending',
  approved_by UUID REFERENCES users(id),
  payment_date DATE,
  transaction_ref TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. AGENT NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS agent_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  badge TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')) DEFAULT 'Medium',
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')) DEFAULT 'Open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. AGENT PERFORMANCE VIEW / AGGREGATION
CREATE OR REPLACE VIEW agent_performance_overview AS
SELECT 
  a.id AS agent_id,
  a.full_name,
  COUNT(DISTINCT l.id) AS total_leads,
  COUNT(DISTINCT CASE WHEN l.status IN ('QUALIFIED', 'SITE VISIT', 'NEGOTIATION', 'BOOKED', 'CLOSED') THEN l.id END) AS qualified_leads,
  COUNT(DISTINCT v.id) AS total_visits,
  COUNT(DISTINCT b.id) AS total_bookings,
  COALESCE(SUM(CASE WHEN c.status = 'Paid' THEN c.commission_amount ELSE 0 END), 0) AS total_earned_commission,
  COALESCE(SUM(CASE WHEN c.status IN ('Pending', 'Approved', 'Processing') THEN c.commission_amount ELSE 0 END), 0) AS pending_commission
FROM agents a
LEFT JOIN leads l ON l.agent_id = a.id
LEFT JOIN site_visits v ON v.agent_id = a.id
LEFT JOIN bookings b ON b.agent_id = a.id
LEFT JOIN commissions c ON c.agent_id = a.id
GROUP BY a.id, a.full_name;
