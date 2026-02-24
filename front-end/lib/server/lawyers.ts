import { ApiResponse } from '../types/api'
import { PublicLawyer, PublicLawyerSearchParams } from '../types/lawyers'
import { get } from './api'

/**
 * Lawyers service for server-side data fetching
 * Uses the base API service for making requests
 */

/**
 * Get lawyers with filtering options
 */
export async function getLawyers(params?: PublicLawyerSearchParams): Promise<ApiResponse<PublicLawyer[]>> {
  return get<PublicLawyer[]>('/public/lawyers', params)
}

/**
 * Get a specific lawyer by ID
 */
export async function getLawyerById(id: number): Promise<ApiResponse<PublicLawyer>> {
  return get<PublicLawyer>(`/public/lawyers/${id}`)
}

/**
 * Get featured lawyers
 */
export async function getFeaturedLawyers(limit: number = 4): Promise<ApiResponse<PublicLawyer[]>> {
  return get<PublicLawyer[]>('/public/lawyers/featured', { limit })
}

/**
 * Export all methods as a default object
 */
export default {
  getLawyers,
  getLawyerById,
  getFeaturedLawyers
}
