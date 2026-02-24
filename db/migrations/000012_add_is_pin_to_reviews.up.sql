-- Migration ID 12: Add is_pin column to reviews table
ALTER TABLE reviews
    ADD COLUMN is_pin BOOLEAN NOT NULL DEFAULT FALSE;
