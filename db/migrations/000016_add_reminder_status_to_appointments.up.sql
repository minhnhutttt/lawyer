-- Add day_reminder_sent and hour_reminder_sent fields to the appointments table
ALTER TABLE appointments ADD COLUMN day_reminder_sent BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE appointments ADD COLUMN hour_reminder_sent BOOLEAN NOT NULL DEFAULT false;
