ALTER TABLE lawyers
    ADD COLUMN affiliation VARCHAR(255),
  ADD COLUMN lawyer_registration_number VARCHAR(255),
  ADD COLUMN certification_document_path VARCHAR(255),
  ADD COLUMN phone_number VARCHAR(50),
  ADD COLUMN fax_number VARCHAR(50),
  ADD COLUMN profile_text TEXT,
  ADD COLUMN areas_of_expertise TEXT,
  ADD COLUMN notes TEXT;
