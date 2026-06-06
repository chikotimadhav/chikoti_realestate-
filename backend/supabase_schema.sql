-- ============================================================
-- CHIKOTI REAL ESTATE — SUPABASE SQL SCHEMA (POSTGRESQL)
-- Copy and paste this into the Supabase SQL Editor and click Run.
-- ============================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'seller', 'buyer')) DEFAULT 'buyer',
  avatar_url TEXT DEFAULT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROPERTIES TABLE
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  land_type TEXT CHECK (land_type IN ('Agriculture', 'Commercial', 'Residential')) NOT NULL,
  listing_type TEXT CHECK (listing_type IN ('Sale', 'Rent', 'Lease')) DEFAULT 'Sale',
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  description TEXT DEFAULT '',
  contact_number TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '',
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  is_featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  
  -- Agriculture fields
  acres NUMERIC,
  soil_type TEXT,
  water_source TEXT,
  current_crop TEXT,
  crop_yield NUMERIC,
  electricity TEXT,
  fencing TEXT,
  agri_facilities JSONB DEFAULT '[]'::JSONB,
  
  -- Commercial fields
  built_area NUMERIC,
  floor TEXT,
  frontage NUMERIC,
  business_type TEXT,
  parking TEXT,
  footfall TEXT CHECK (footfall IN ('Low', 'Medium', 'High', NULL)),
  landmarks TEXT,
  comm_amenities JSONB DEFAULT '[]'::JSONB,
  
  -- Residential fields
  area_sqft NUMERIC,
  bedrooms INTEGER,
  bathrooms INTEGER,
  furnishing TEXT CHECK (furnishing IN ('Unfurnished', 'Semi-furnished', 'Fully Furnished', NULL)),
  res_floor TEXT,
  res_amenities JSONB DEFAULT '[]'::JSONB,
  
  -- Images
  images JSONB DEFAULT '[]'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INQUIRIES TABLE
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. FAVORITES TABLE
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, property_id)
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_land_type ON properties(land_type);
CREATE INDEX idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- Trigger to auto-update updated_at modtimes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_modtime
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Seed default admin account (password is bcrypt hashed 'admin123')
INSERT INTO users (id, name, email, password, role, is_verified, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Chikoti Admin',
  'admin@chikotirealestate.com',
  '$2a$10$AgchqV150h4s1NbZ6nfLh.xtW5/wunkH4cjVYKMbqW5zoeeHt4xcq',
  'admin',
  TRUE,
  TRUE
) ON CONFLICT (email) DO NOTHING;
