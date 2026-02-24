import {get, post, put, del, patch} from '../api'
import { Question, Answer, QuestionCreateRequest, AnswerCreateRequest, QuestionSearchParams, QuestionStatus } from '../types/questions'
import { ApiResponse } from '../types/api'
import {Review} from "@/lib/types";

// Get questions with filtering options
export async function getQuestions(params?: QuestionSearchParams): Promise<ApiResponse<Question[]>> {
  return get('/public/questions', { params })
}

// Get questions created by the current user
export async function getMyQuestions(params?: QuestionSearchParams): Promise<ApiResponse<Question[]>> {
  return get('/questions/my', { params })
}

// Get a specific question by ID
export async function getQuestionById(id: number): Promise<ApiResponse<Question>> {
  return get(`/public/questions/${id}`)
}

// Create a new question
export async function createQuestion(data: QuestionCreateRequest): Promise<ApiResponse<Question>> {
  return post('/questions', data)
}

// Update a question
export async function updateQuestion(id: number, data: Partial<QuestionCreateRequest>): Promise<ApiResponse<Question>> {
  return put(`/questions/${id}`, data)
}

// Update question status
export async function updateQuestionStatus(id: number, status: QuestionStatus): Promise<ApiResponse<Question>> {
  return put(`/questions/${id}/status`, { status })
}

// Delete a question
export async function deleteQuestion(id: number): Promise<ApiResponse<{ message: string }>> {
  return del(`/questions/${id}`)
}

// Get answers for a question
export async function getQuestionAnswers(questionId: number): Promise<ApiResponse<Answer[]>> {
  return get(`/public/questions/${questionId}/answers`)
}

// Create an answer for a question
export async function createAnswer(data: AnswerCreateRequest): Promise<ApiResponse<Answer>> {
  return post('/answers', data)
}

// Update an answer
export async function updateAnswer(id: number, content: string): Promise<ApiResponse<Answer>> {
  return put(`/answers/${id}`, { content })
}

// Mark an answer as accepted
export async function acceptAnswer(id: number): Promise<ApiResponse<Answer>> {
  return put(`/answers/${id}/accept`, {})
}

// Delete an answer
export async function deleteAnswer(id: number): Promise<ApiResponse<{ message: string }>> {
  return del(`/answers/${id}`)
}

export async function updateQuestionHidden(
    id: number,
    isHidden: boolean,
): Promise<ApiResponse<Question>> {
  return patch(`/questions/${id}/hidden`, {
    is_hidden: isHidden,
  })
}

export default {
  getQuestions,
  getMyQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  updateQuestionStatus,
  deleteQuestion,
  getQuestionAnswers,
  createAnswer,
  updateAnswer,
  acceptAnswer,
  deleteAnswer,
  updateQuestionHidden
} 