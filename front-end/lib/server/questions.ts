import { ApiResponse } from '../types/api'
import { Question, QuestionSearchParams } from '../types/questions'
import { get } from './api'

/**
 * Questions service for server-side data fetching
 * Uses the base API service for making requests
 */

/**
 * Get questions with filtering options
 */
export async function getQuestions(params?: QuestionSearchParams): Promise<ApiResponse<Question[]>> {
  return get<Question[]>('/public/questions', params)
}

/**
 * Get a specific question by ID
 */
export async function getQuestionById(id: number): Promise<ApiResponse<Question>> {
  return get<Question>(`/public/questions/${id}`)
}

/**
 * Export all methods as a default object
 */
export default {
  getQuestions,
  getQuestionById
}
