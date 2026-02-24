-- Drop the new is_client_viewed column
ALTER TABLE appointments DROP COLUMN is_client_viewed;

-- Rename is_lawyer_viewed back to is_viewed
ALTER TABLE appointments RENAME COLUMN is_lawyer_viewed TO is_viewed;
