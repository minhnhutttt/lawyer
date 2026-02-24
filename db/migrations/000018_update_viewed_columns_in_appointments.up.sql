-- Rename is_viewed to is_lawyer_viewed
ALTER TABLE appointments RENAME COLUMN is_viewed TO is_lawyer_viewed;

-- Add new is_client_viewed column
ALTER TABLE appointments ADD COLUMN is_client_viewed BOOLEAN NOT NULL DEFAULT false;
