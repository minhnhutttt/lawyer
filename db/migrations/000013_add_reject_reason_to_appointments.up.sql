-- Migration: 000013_add_reject_reason_to_appointments.up.sql

ALTER TABLE appointments
    ADD COLUMN reject_reason TEXT;
