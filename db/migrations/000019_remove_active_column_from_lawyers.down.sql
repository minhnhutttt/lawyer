-- Add active column back to lawyers table
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
