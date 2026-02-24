-- 000010_add_gender_and_age_group_to_users.down.sql

ALTER TABLE users
DROP COLUMN IF EXISTS age_group,
  DROP COLUMN IF EXISTS gender;

DROP TYPE IF EXISTS age_group_enum;
DROP TYPE IF EXISTS gender_enum;
