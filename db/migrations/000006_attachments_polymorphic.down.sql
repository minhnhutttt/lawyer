BEGIN;

-- 1) Drop the polymorphic index
DROP INDEX IF EXISTS idx_attachments_attachmentable;

-- 2) Remove the polymorphic columns
ALTER TABLE attachments
DROP COLUMN IF EXISTS attachmentable_type,
  DROP COLUMN IF EXISTS attachmentable_id;

-- 3) Re-add the old FK columns
ALTER TABLE attachments
    ADD COLUMN appointment_id     INTEGER,
  ADD COLUMN chat_message_id    INTEGER,
  ADD COLUMN question_id        INTEGER,
  ADD COLUMN answer_id          INTEGER;

-- 4) Restore the FK constraints
ALTER TABLE attachments
    ADD CONSTRAINT attachments_appointment_id_fkey
        FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  ADD CONSTRAINT attachments_chat_message_id_fkey
    FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  ADD CONSTRAINT attachments_question_id_fkey
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  ADD CONSTRAINT attachments_answer_id_fkey
    FOREIGN KEY (answer_id) REFERENCES answers(id) ON DELETE CASCADE;

COMMIT;
