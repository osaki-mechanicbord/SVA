-- Installation requests table for B2B manufacturer/trading company requests
CREATE TABLE IF NOT EXISTS installation_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Company info
  company_name TEXT NOT NULL,
  department TEXT DEFAULT '',
  contact_person TEXT NOT NULL,
  company_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  -- Disclosure
  disclosure TEXT DEFAULT 'open' CHECK(disclosure IN ('open', 'closed')),
  meeting_date TEXT DEFAULT '',
  -- Products, vehicles, sites as JSON
  products_json TEXT DEFAULT '[]',
  vehicles_json TEXT DEFAULT '[]',
  sites_json TEXT DEFAULT '[]',
  -- Budget and notes
  budget_estimate TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK(status IN ('new', 'reviewed', 'partner_assigned', 'date_set', 'in_progress', 'completed', 'cancelled')),
  assigned_partner_id INTEGER DEFAULT NULL,
  -- Metadata
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installation_requests_status ON installation_requests(status);
CREATE INDEX IF NOT EXISTS idx_installation_requests_email ON installation_requests(email);
CREATE INDEX IF NOT EXISTS idx_installation_requests_created ON installation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_installation_requests_company ON installation_requests(company_name);
