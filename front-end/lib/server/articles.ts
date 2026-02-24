import { Article, ArticleSearchParams } from '../types/articles'
import { ApiResponse } from '../types/api'
import { get } from './api'

/**
 * Articles service for server-side data fetching
 * Uses the base API service for making requests
 */

/**
 * Get articles with filtering options
 */
export async function getArticles(params?: ArticleSearchParams): Promise<ApiResponse<Article[]>> {
  return get<Article[]>('/public/articles', { params })
}

/**
 * Get a specific article by ID
 */
export async function getArticleById(id: number): Promise<ApiResponse<Article>> {
  return get<Article>(`/public/articles/${id}`)
}

/**
 * Get a specific article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  return get<Article>(`/public/articles/slug/${slug}`)
}

/**
 * Export all methods as a default object
 */
export default {
  getArticles,
  getArticleById,
  getArticleBySlug
}
