-- Migration to remove deleted_at columns

-- Users Table
DROP INDEX IF EXISTS idx_users_deleted_at;
ALTER TABLE users DROP COLUMN IF EXISTS deleted_at;

-- Lawyers Table
DROP INDEX IF EXISTS idx_lawyers_deleted_at;
ALTER TABLE lawyers DROP COLUMN IF EXISTS deleted_at;

-- Reviews Table
DROP INDEX IF EXISTS idx_reviews_deleted_at;
ALTER TABLE reviews DROP COLUMN IF EXISTS deleted_at;

-- Articles Table
DROP INDEX IF EXISTS idx_articles_deleted_at;
ALTER TABLE articles DROP COLUMN IF EXISTS deleted_at;

-- Questions Table
DROP INDEX IF EXISTS idx_questions_deleted_at;
ALTER TABLE questions DROP COLUMN IF EXISTS deleted_at;

-- Answers Table
DROP INDEX IF EXISTS idx_answers_deleted_at;
ALTER TABLE answers DROP COLUMN IF EXISTS deleted_at;

-- Chat Messages Table
DROP INDEX IF EXISTS idx_chat_messages_deleted_at;
ALTER TABLE chat_messages DROP COLUMN IF EXISTS deleted_at;

-- Attachments Table
DROP INDEX IF EXISTS idx_attachments_deleted_at;
ALTER TABLE attachments DROP COLUMN IF EXISTS deleted_at;

-- Notifications Table
DROP INDEX IF EXISTS idx_notifications_deleted_at;
ALTER TABLE notifications DROP COLUMN IF EXISTS deleted_at;

-- Appointments Table
DROP INDEX IF EXISTS idx_appointments_deleted_at;
ALTER TABLE appointments DROP COLUMN IF EXISTS deleted_at;

-- Question Notifications Table
DROP INDEX IF EXISTS idx_question_notifications_deleted_at;
ALTER TABLE question_notifications DROP COLUMN IF EXISTS deleted_at; 