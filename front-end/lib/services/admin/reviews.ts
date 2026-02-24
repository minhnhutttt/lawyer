import { get, patch, post, put } from '@/lib/api'
import { ApiResponse } from '@/lib/types/api'
import { Review } from '@/lib/types/reviews'

export interface AdminReviewsParams {
  page?: number
  limit?: number
  status?: string
  lawyer_id?: number
}

// Get all reviews with pagination and filtering for admin
export async function getAllReviews(params?: AdminReviewsParams): Promise<ApiResponse<Review[]>> {
  return get('/reviews', { params })
}

// Get a specific review by ID
export async function getReviewById(id: number): Promise<ApiResponse<Review>> {
  return get(`/reviews/${id}`)
}

// Update review approval status
export async function updateReviewStatus(
  id: number, 
  status: 'approved' | 'rejected',
  hiddenReason?: string
): Promise<ApiResponse<Review>> {
  return patch(`/reviews/${id}/status`, { 
    approved_status: status,
    hidden_reason: hiddenReason
  })
}

export default {
  getAllReviews,
  getReviewById,
  updateReviewStatus
} 