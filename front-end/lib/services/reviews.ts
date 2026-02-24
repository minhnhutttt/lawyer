import { get, post, put, del, patch } from '../api'
import { Review, ReviewCreateRequest, ReviewUpdateRequest, ReviewSearchParams } from '../types/reviews'
import { ApiResponse } from '../types/api'

// Get reviews for a specific lawyer
export async function getLawyerReviews(lawyerId: number, params?: ReviewSearchParams): Promise<ApiResponse<Review[]>> {
  return get(`/reviews/lawyer/${lawyerId}`, { params })
}

// Get reviews written by the current user
export async function getMyReviews(): Promise<ApiResponse<Review[]>> {
  return get('/user/reviews')
}

export async function getPinnedReviews(): Promise<ApiResponse<Review[]>> {
  return get('/public/reviews/pinned')
}

// Create a new review
export async function createReview(data: ReviewCreateRequest): Promise<ApiResponse<Review>> {
  return post('/reviews', data)
}

// Update an existing review
export async function updateReview(id: number, data: ReviewUpdateRequest): Promise<ApiResponse<Review>> {
  return put(`/reviews/${id}`, data)
}

// Delete a review
export async function deleteReview(id: number): Promise<ApiResponse<{ message: string }>> {
  return del(`/reviews/${id}`)
}

// Admin functionality

export interface AdminReviewsParams {
  page?: number
  limit?: number
  status?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

// Get all reviews with pagination and filtering (admin)
export async function getAllReviews(params?: AdminReviewsParams): Promise<ApiResponse<Review[]>> {
  return get('/reviews', params)
}

// Get a specific review by ID
export async function getReviewById(id: number): Promise<ApiResponse<Review>> {
  return get(`/reviews/${id}`)
}

// Update review approval status (admin)
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

export interface ReviewPinRequest {
  is_pin: boolean
}

export async function pinReview(
  id: number,
  isPin: boolean
): Promise<ApiResponse<Review>> {
  return patch<Review>(`/reviews/${id}/pin`, { is_pin: isPin })
}

export default {
  // User functions
  getLawyerReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  getPinnedReviews,

  // Admin functions
  getAllReviews,
  getReviewById,
  updateReviewStatus
} 