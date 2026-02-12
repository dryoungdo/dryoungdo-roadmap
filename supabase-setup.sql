-- =============================================================================
-- DR.DO PERSONAL ROADMAP - SUPABASE DATABASE SETUP
-- =============================================================================
-- Run this script in the Supabase SQL Editor
-- Created: 2026-02-11
-- =============================================================================

-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS roadmap_items CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS owners CASCADE;

-- Drop existing function if exists
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =============================================================================
-- 1. CREATE TABLES
-- =============================================================================

-- Departments table
CREATE TABLE departments (
  key TEXT PRIMARY KEY,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  color TEXT NOT NULL,
  bg_class TEXT NOT NULL,
  text_class TEXT NOT NULL,
  border_class TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Owners table
CREATE TABLE owners (
  key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roadmap items table
CREATE TABLE roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  department TEXT NOT NULL REFERENCES departments(key) ON DELETE RESTRICT,
  priority TEXT NOT NULL CHECK (priority IN ('P0','P1','P2','P3')),
  status TEXT NOT NULL CHECK (status IN ('planned','in_progress','on_track','at_risk','blocked','completed')),
  owner TEXT NOT NULL REFERENCES owners(key) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  parent_id UUID REFERENCES roadmap_items(id) ON DELETE SET NULL,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  dependencies UUID[] NOT NULL DEFAULT '{}',
  links JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('feature_request','bug','improvement','question','other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','acknowledged','in_progress','resolved','wont_fix')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- 2. CREATE INDEXES
-- =============================================================================

CREATE INDEX idx_roadmap_items_department ON roadmap_items(department);
CREATE INDEX idx_roadmap_items_owner ON roadmap_items(owner);
CREATE INDEX idx_roadmap_items_status ON roadmap_items(status);
CREATE INDEX idx_roadmap_items_priority ON roadmap_items(priority);
CREATE INDEX idx_roadmap_items_parent_id ON roadmap_items(parent_id);
CREATE INDEX idx_roadmap_items_dates ON roadmap_items(start_date, end_date);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_category ON feedback(category);

-- =============================================================================
-- 3. AUTO-UPDATE TRIGGER FOR updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_roadmap_items_updated_at
  BEFORE UPDATE ON roadmap_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Departments: authenticated users can read, only service role can write
CREATE POLICY "Authenticated users can read departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert departments"
  ON departments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update departments"
  ON departments FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Service role can delete departments"
  ON departments FOR DELETE
  TO authenticated
  USING (true);

-- Owners: authenticated users can read, only service role can write
CREATE POLICY "Authenticated users can read owners"
  ON owners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert owners"
  ON owners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update owners"
  ON owners FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Service role can delete owners"
  ON owners FOR DELETE
  TO authenticated
  USING (true);

-- Roadmap items: authenticated users can CRUD everything
CREATE POLICY "Authenticated users can read roadmap items"
  ON roadmap_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert roadmap items"
  ON roadmap_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update roadmap items"
  ON roadmap_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete roadmap items"
  ON roadmap_items FOR DELETE
  TO authenticated
  USING (true);

-- Feedback: authenticated users can CRUD everything
CREATE POLICY "Authenticated users can read feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (true);

-- =============================================================================
-- 5. ENABLE REALTIME
-- =============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE owners;
ALTER PUBLICATION supabase_realtime ADD TABLE roadmap_items;
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;

-- =============================================================================
-- 6. ANALYSIS LOGS TABLE
-- =============================================================================

CREATE TABLE analysis_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'strategic', 'roadmap', 'milestone', 'kpi', 'process', 'critique'
  )),
  item_id UUID REFERENCES roadmap_items(id) ON DELETE SET NULL,
  prompt_summary TEXT NOT NULL,
  result_markdown TEXT NOT NULL,
  model_used TEXT NOT NULL DEFAULT 'gemini-2.0-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analysis_logs_created_at ON analysis_logs(created_at DESC);

ALTER TABLE analysis_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read analysis logs"
  ON analysis_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert analysis logs"
  ON analysis_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete own analysis logs"
  ON analysis_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================================================
-- SETUP COMPLETE - No seed data (personal roadmap starts empty)
-- =============================================================================
