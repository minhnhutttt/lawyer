import { get, put, del, post, patch } from '../api'
import { Lawyer, PublicLawyer, LawyerSearchParams, LawyerProfileRequest, PublicLawyerSearchParams, PublicReview } from '../types/lawyers'
import { ApiResponse } from '../types/api'

// Get a list of lawyers (potentially filtered/paginated)
export const getLawyers = async (params?: LawyerSearchParams): Promise<ApiResponse<Lawyer[]>> => {
  return get('/lawyers', params);
}

// Get lawyer details by ID
export async function getLawyerById(id: number): Promise<ApiResponse<Lawyer>> {
  return get(`/lawyers/${id}`)
}

// Get current lawyer profile (for authenticated lawyer users)
export async function getMyLawyerProfile(): Promise<ApiResponse<Lawyer>> {
  return get('/lawyers/profile')
}

// Update lawyer profile
export async function updateLawyer(id: number, data: LawyerProfileRequest): Promise<ApiResponse<Lawyer>> {
  return put(`/lawyers/${id}`, data)
}

// Delete a lawyer by ID
export async function deleteLawyer(id: number): Promise<ApiResponse<void>> {
  return del(`/lawyers/${id}`)
}

// Get public lawyers
export async function getPublicLawyers(params?: PublicLawyerSearchParams): Promise<ApiResponse<PublicLawyer[]>> {
  return get('/public/lawyers', { params })
}

// Get public lawyer by ID
export async function getPublicLawyerById(id: number): Promise<ApiResponse<PublicLawyer>> {
  return get(`/public/lawyers/${id}`)
}

// Get public lawyer reviews
export async function getPublicLawyerReviews(id: number): Promise<ApiResponse<PublicReview[]>> {
  return get(`/public/reviews/lawyer/${id}`)
}

// Upload lawyer certification document
export async function uploadLawyerCertification(id: number, formData: FormData): Promise<ApiResponse<Lawyer>> {
  formData.append('lawyer_id', id.toString());
  return post(`/lawyers/upload-certification`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Update lawyer verification status
export async function verifyLawyer(id: number, isVerified: boolean): Promise<ApiResponse<any>> {
  return patch(`/lawyers/${id}/verify`, { is_verified: isVerified })
}

export default {
  getLawyers,
  getLawyerById,
  getMyLawyerProfile,
  updateLawyer,
  deleteLawyer,
  getPublicLawyers,
  getPublicLawyerById,
  getPublicLawyerReviews,
  uploadLawyerCertification,
  verifyLawyer
}