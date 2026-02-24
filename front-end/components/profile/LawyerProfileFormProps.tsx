import React from "react";

export type LawyerProfileFormProps = {
  lawyerFormData: {
    email: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    gender?: string | null;
    registration_number: string;
    affiliation: string;
    office_name: string;
    office_address: string;
    phone: string;
    fax_number: string;
    specialties: string[];
    profile_text: string;
    areas_of_expertise: string;
    notes: string;
    certification_document?: File | null;
    experience_years?: number;
  };
  setLawyerFormData: React.Dispatch<React.SetStateAction<any>>;
  handleLawyerSubmit: (e: React.FormEvent) => void;
  submittingLawyer: boolean;
  t: (key: string, opts?: any) => string;
  certificationDocUrl?: string;
  onCertificationDocUpload?: (file: File) => void;
};