// Lawyer and lawyer profile interfaces
import {User} from "@/lib/types/users";

export interface Lawyer {
  id: number;
  full_name: string;
  office_name: string;
  specialties: string[];
  availability: any;
  languages: string[];
  bar_number: string;
  bio: string;
  email: string;
  affiliation: string;
  lawyer_registration_number: string;
  certification_document_path: string;
  certification_document_url?: string;
  phone: string;
  phone_number: string;
  fax_number: string;
  profile_text: string;
  areas_of_expertise: string;
  experience_years: number;
  notes: string;
  address: string;
  profile_image: string;
  rating: number;
  average_rating?: number;
  review_count: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface LawyerBrief {
  id: number;
  full_name: string;
  areas_of_expertise: string;
  affiliation: string;
  rating: number;
  office_name: string;
  user_id: number;
  profile_image: string;
  profile_text: string;
  user_active: boolean;
  user: User;
}

export interface LawyerResponse {
  id: number;
  full_name: string;
  user_id: number;
  profile_image: string;
  office_name?: string;
}

export interface PublicLawyer {
  id: number;
  profile_image?: string;
  birth_date?: string;
  gender?: string;
  full_name: string;
  email: string;
  profile_text?: string;
  notes?: string;
  affiliation?: string;
  office_name: string;
  address: string;
  phone_number?: string;
  fax_number?: string;
  lawyer_registration_number?: string;
  specialties: string[];
  areas_of_expertise?: string;
  experience_years?: number;
  languages: string[];
  bio?: string;
  rating?: number;
  average_rating?: number;
  review_count?: number;
  is_verified?: boolean;
  user_active?: boolean;
}


export interface LawyerProfileRequest {
  availability?: any;
  full_name?: string;
  office_name?: string;
  specialties?: string[];
  languages?: string[];
  bar_number?: string;
  bio?: string;
  email?: string;
  address?: string;
  notes?: string;
  lawyer_registration_number?: string;
  affiliation?: string;
  phone?: string;
  fax_number?: string;
  profile_text?: string;
  areas_of_expertise?: string;
  certification_document?: File | null;
  experience_years?: number;
}

export interface LawyerSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PublicLawyerSearchParams {
  name?: string;
  address?: string;
  specialty?: string;
  language?: string;
  experience?: number;
  prefecture?: string;
  min_rating?: number;
  page?: number;
  page_size?: number;
}
// Public interfaces for lawyer reviews
export interface PublicReview {
  id: number
  rating: number
  comment: string
  user_name: string
  created_at: string
}

// ... existing code ...