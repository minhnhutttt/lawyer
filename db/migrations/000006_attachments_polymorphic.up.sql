BEGIN;

-- 1) Drop the old FK constraints and columns
ALTER TABLE attachments
DROP CONSTRAINT IF EXISTS attachments_appointment_id_fkey,
  DROP CONSTRAINT IF EXISTS attachments_chat_message_id_fkey,
  DROP CONSTRAINT IF EXISTS attachments_question_id_fkey,
  DROP CONSTRAINT IF EXISTS attachments_answer_id_fkey;

ALTER TABLE attachments
DROP COLUMN IF EXISTS appointment_id,
  DROP COLUMN IF EXISTS chat_message_id,
  DROP COLUMN IF EXISTS question_id,
  DROP COLUMN IF EXISTS answer_id;

-- 2) Add the polymorphic fields
ALTER TABLE attachments
    ADD COLUMN attachmentable_type VARCHAR(50) NOT NULL,
  ADD COLUMN attachmentable_id   INTEGER      NOT NULL;

-- 3) Speed up lookups on the new polymorphic combo
CREATE INDEX IF NOT EXISTS idx_attachments_attachmentable
    ON attachments (attachmentable_type, attachmentable_id);

COMMIT;
