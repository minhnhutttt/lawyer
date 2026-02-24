import { get, post, put, del } from '../api'
import {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AppointmentSearchParams,
  TimeSlot
} from '@/lib/types'
import { ApiResponse } from '@/lib/types'

// Get a list of appointments with optional filtering
export async function getAppointments(params?: AppointmentSearchParams): Promise<ApiResponse<Appointment[]>> {
  return get('/appointments', { params })
}

// Get appointment by ID
export async function getAppointmentById(id: number): Promise<ApiResponse<Appointment>> {
  return get(`/appointments/${id}`)
}

// Create a new appointment
export async function createAppointment(data: AppointmentCreateRequest): Promise<ApiResponse<Appointment>> {
  return post('/appointments', data)
}

// Update an existing appointment
export async function updateAppointment(id: number, data: AppointmentUpdateRequest): Promise<ApiResponse<Appointment>> {
  return put(`/appointments/${id}`, data)
}

// Delete an appointment
export async function deleteAppointment(id: number): Promise<ApiResponse<{ message: string }>> {
  return del(`/appointments/${id}`)
}

// Cancel an appointment
export async function cancelAppointment(id: number, reason: string): Promise<ApiResponse<Appointment>> {
  return put(`/appointments/${id}`, { status: 'cancelled', cancel_reason: reason })
}

// Get lawyer appointments
export async function getLawyerAppointments(): Promise<ApiResponse<Appointment[]>> {
  return get('/appointments/lawyer')
}

// Check lawyer availability
export async function checkLawyerAvailability(lawyer_id: number, date: string): Promise<ApiResponse<{ available_slots: string[] }>> {
  return get(`/appointments/availability/${lawyer_id}`, { params: { date } })
}

export async function getAvailableTimeSlots(lawyerId: number, date: string): Promise<ApiResponse<TimeSlot[]>> {
  return get(`/appointments/available-times`, {
    lawyer_id: lawyerId.toString(),
    date,
  })
}

export async function rejectAppointment(id: number, reason: string): Promise<ApiResponse<Appointment>> {
  return put(`/appointments/reject/${id}`, { reason });
}

export default {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  getLawyerAppointments,
  checkLawyerAvailability,
  getAvailableTimeSlots,
  rejectAppointment,
}