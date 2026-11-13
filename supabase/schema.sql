-- =============================================
-- ChartingHero Demo EMR - Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PATIENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  dob DATE NOT NULL,
  age INTEGER,
  phone TEXT,
  address JSONB,
  status TEXT DEFAULT 'active',
  priority BOOLEAN DEFAULT FALSE,
  primary_diagnosis JSONB,
  secondary_diagnoses JSONB DEFAULT '[]',
  medications JSONB DEFAULT '[]',
  care_plan_goals JSONB DEFAULT '[]',
  emergency_contact JSONB,
  scheduled_time TEXT,
  visit_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- VISITS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS visits (
  id TEXT PRIMARY KEY,
  patient_id TEXT REFERENCES patients(id),
  visit_type TEXT,
  visit_date DATE NOT NULL,
  time_in TEXT,
  time_out TEXT,
  nurse_name TEXT,
  vital_signs JSONB DEFAULT '{}',
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  interventions JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  next_visit_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);

-- =============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Enable for production, disable for demo
-- =============================================
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for demo)
-- CREATE POLICY "Allow anonymous read" ON patients FOR SELECT USING (true);
-- CREATE POLICY "Allow anonymous read" ON visits FOR SELECT USING (true);

-- =============================================
-- PERMISSIONS
-- Grant access to anon and authenticated roles
-- =============================================
GRANT SELECT, INSERT, UPDATE ON patients TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON visits TO anon, authenticated;
