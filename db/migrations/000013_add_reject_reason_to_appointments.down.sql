-- Migration: 000013_add_reject_reason_to_appointments.down.sql

ALTER TABLE appointments
DROP COLUMN IF EXISTS reject_reason;
