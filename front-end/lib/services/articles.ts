import { get, post, put, del } from '../api'
import { Article, ArticleCreateRequest, ArticleUpdateRequest, ArticleSearchParams } from '../types/articles'
import { ApiResponse } from '../types/api'

// Get articles with filtering options
export async function getArticles(params?: ArticleSearchParams): Promise<ApiResponse<Article[]>> {
  return get('/public/articles', { params })
}

// Get a specific article by ID
export async function getArticleById(id: number): Promise<ApiResponse<Article>> {
  return get(`/public/articles/${id}`)
}

// Get a specific article by slug
export async function getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
  return get(`/public/articles/slug/${slug}`)
}

// Create a new article
export async function createArticle(data: ArticleCreateRequest): Promise<ApiResponse<Article>> {
  return post('/articles', data)
}

// Update an article
export async function updateArticle(id: number, data: ArticleUpdateRequest): Promise<ApiResponse<Article>> {
  return put(`/articles/${id}`, data)
}

// Delete an article
export async function deleteArticle(id: number): Promise<ApiResponse<{ message: string }>> {
  return del(`/articles/${id}`)
}

export default {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle
} 