-- Remove is_verified column from lawyers table
ALTER TABLE lawyers DROP COLUMN IF EXISTS is_verified;
