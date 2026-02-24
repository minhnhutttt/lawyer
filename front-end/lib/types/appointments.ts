import { LawyerBrief, PublicLawyer } from './lawyers';
import {User} from "@/lib/types/users";
import {AppointmentStatus} from "@/lib/enums/appointment-status.enum";

export interface Appointment {
  id: number;
  user_id: number;
  description: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string;
  chat_enabled: boolean;
  is_lawyer_viewed: boolean;
  is_client_viewed: boolean;
  created_at: string;
  updated_at: string;
  lawyer: LawyerBrief;
  client: User;
  reject_reason?: string;
  cancel_reason?: string;
  admin_reason?: string;
}

export interface AppointmentCreateRequest {
  lawyer_id: number;
  description: string;
  notes: string;
  start_time: string;
  end_time: string;
}

export interface AppointmentUpdateRequest {
  description?: string;
  notes?: string;
  status?: AppointmentStatus;
  start_time?: string;
  end_time?: string;
  chat_enabled?: boolean;
  admin_reason?: string;
}

export interface AppointmentSearchParams {
  status?: string;
  start_date?: string;
  end_date?: string;
  client_id?: number;
  lawyer_id?: number;
  client_search?: string;
  lawyer_search?: string;
  page?: number;
  limit?: number;
}

// Time slot interface for appointment booking
export interface TimeSlot {
  time: string;      // ISO string or time value for API
  available: boolean; // Whether the slot is available
  selected?: boolean; // Whether the slot is currently selected
}

// Form state for the booking flow
export interface BookingFormState {
  lawyerId: number | null;
  lawyer: PublicLawyer | null;
  date: string | null;
  time: string | null;
  description: string;
}

// Booking step enum
export enum BookingStep {
  FindLawyer = 1,
  SelectDateTime = 2,
  CompleteBooking = 3
} 