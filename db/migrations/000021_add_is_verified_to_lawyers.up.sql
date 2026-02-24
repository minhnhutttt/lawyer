-- Add is_verified column to lawyers table with default value of false
ALTER TABLE lawyers ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false;
