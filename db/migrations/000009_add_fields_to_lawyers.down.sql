ALTER TABLE lawyers
DROP COLUMN IF EXISTS affiliation,
  DROP COLUMN IF EXISTS lawyer_registration_number,
  DROP COLUMN IF EXISTS certification_document_path,
  DROP COLUMN IF EXISTS phone_number,
  DROP COLUMN IF EXISTS fax_number,
  DROP COLUMN IF EXISTS profile_text,
  DROP COLUMN IF EXISTS areas_of_expertise,
  DROP COLUMN IF EXISTS notes;
