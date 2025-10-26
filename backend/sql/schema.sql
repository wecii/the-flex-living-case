CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_type TEXT NOT NULL,
  property_name TEXT NOT NULL,
  source TEXT NOT NULL,
  external_id TEXT,
  guest_name TEXT,
  rating REAL CHECK (rating >= 0 AND rating <= 10),
  cleanliness REAL CHECK (cleanliness >= 0 AND cleanliness <= 10),
  communication REAL CHECK (communication >= 0 AND communication <= 10),
  respect_house_rules REAL CHECK (respect_house_rules >= 0 AND respect_house_rules <= 10),
  comment TEXT,
  submitted_at DATETIME NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending',
  approved_at DATETIME
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_reviews_source_external ON reviews(source, external_id);
CREATE INDEX IF NOT EXISTS ix_reviews_status ON reviews(review_status);
CREATE INDEX IF NOT EXISTS ix_reviews_submitted ON reviews(submitted_at);