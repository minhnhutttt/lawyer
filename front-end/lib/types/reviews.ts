import {Lawyer} from './lawyers';
import { User } from './users';

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
  lawyer: Lawyer;
  user: User;
  approved_status?: string;
  hidden_reason?: string;
  is_hidden?: boolean;
  is_pin?: boolean;
}

export interface ReviewCreateRequest {
  lawyer_id: number;
  rating: number;
  comment?: string;
  appointment_id?: number;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment?: string;
}

export interface ReviewSearchParams {
  lawyer_id?: number;
  min_rating?: number;
  max_rating?: number;
  page?: number;
  limit?: number;
} 