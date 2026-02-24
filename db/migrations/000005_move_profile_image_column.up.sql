-- Step 1: Add the profile_image column to the users table
ALTER TABLE users
ADD COLUMN profile_image VARCHAR(255);

-- Step 2: Copy existing profile_image values from lawyers to users
UPDATE users
SET profile_image = lawyers.profile_image
FROM lawyers
WHERE users.id = lawyers.user_id;

-- Step 3: Drop the profile_image column from the lawyers table
ALTER TABLE lawyers
DROP COLUMN profile_image;
