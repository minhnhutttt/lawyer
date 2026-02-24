-- Remove the day_reminder_sent and hour_reminder_sent fields from the appointments table
ALTER TABLE appointments DROP COLUMN day_reminder_sent;
ALTER TABLE appointments DROP COLUMN hour_reminder_sent;
