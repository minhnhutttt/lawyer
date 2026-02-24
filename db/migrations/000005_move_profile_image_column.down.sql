-- Rollback: Move profile_image from users back to lawyers (DOWN)

-- Step 1: Add the profile_image column back to the lawyers table
ALTER TABLE lawyers
    ADD COLUMN profile_image VARCHAR(255);

-- Step 2: Copy profile_image values from users back to lawyers
UPDATE lawyers
SET profile_image = users.profile_image
    FROM users
WHERE lawyers.user_id = users.id;

-- Step 3: Drop the profile_image column from the users table
ALTER TABLE users
DROP COLUMN profile_image;
