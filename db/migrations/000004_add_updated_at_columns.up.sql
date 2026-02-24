-- Migration to add updated_at columns for GORM soft delete functionality

-- Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);

-- Lawyers Table
ALTER TABLE lawyers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_lawyers_updated_at ON lawyers(updated_at);

-- Reviews Table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_reviews_updated_at ON reviews(updated_at);

-- Articles Table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_articles_updated_at ON articles(updated_at);

-- Questions Table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_questions_updated_at ON questions(updated_at);

-- Answers Table
ALTER TABLE answers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_answers_updated_at ON answers(updated_at);

-- Chat Messages Table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_chat_messages_updated_at ON chat_messages(updated_at);

-- Attachments Table
ALTER TABLE attachments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_attachments_updated_at ON attachments(updated_at);

-- Notifications Table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_notifications_updated_at ON notifications(updated_at);

-- Appointments Table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_appointments_updated_at ON appointments(updated_at);

-- Question Notifications Table
ALTER TABLE question_notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_question_notifications_updated_at ON question_notifications(updated_at); 