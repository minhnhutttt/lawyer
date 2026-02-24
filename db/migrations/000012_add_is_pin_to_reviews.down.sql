-- Revert Migration ID 12: Remove is_pin column from reviews table
ALTER TABLE reviews
DROP COLUMN IF EXISTS is_pin;
