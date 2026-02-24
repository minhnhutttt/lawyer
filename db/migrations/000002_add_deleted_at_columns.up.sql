-- Migration to add deleted_at columns for GORM soft delete functionality

-- Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- Lawyers Table
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_lawyers_deleted_at ON lawyers(deleted_at);

-- Reviews Table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_reviews_deleted_at ON reviews(deleted_at);

-- Articles Table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at);

-- Questions Table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_questions_deleted_at ON questions(deleted_at);

-- Answers Table
ALTER TABLE answers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_answers_deleted_at ON answers(deleted_at);

-- Chat Messages Table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_at ON chat_messages(deleted_at);

-- Attachments Table
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_attachments_deleted_at ON attachments(deleted_at);

-- Notifications Table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at ON notifications(deleted_at);

-- Appointments Table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_appointments_deleted_at ON appointments(deleted_at);

-- Question Notifications Table
ALTER TABLE question_notifications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_question_notifications_deleted_at ON question_notifications(deleted_at); 