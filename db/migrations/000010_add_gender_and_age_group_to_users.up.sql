CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');

CREATE TYPE age_group_enum AS ENUM (
  '10代',       -- teens (10–19)
  '20代',       -- twenties (20–29)
  '30代',       -- thirties (30–39)
  '40代',       -- forties (40–49)
  '50代以上'    -- 50 and above
);

-- 2) Add columns to users
ALTER TABLE users
    ADD COLUMN gender gender_enum,
  ADD COLUMN age_group age_group_enum;
