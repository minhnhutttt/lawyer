import {User} from "@/lib/types/users";

export type ArticleCategory =
  | 'debt_liabilities'
  | 'traffic_accidents'
  | 'divorce_gender_issues'
  | 'inheritance_wills'
  | 'labor_issues'
  | 'financial_troubles'
  | 'medical_issues'
  | 'foreign_nationals_issues'
  | 'internet_issues'
  | 'real_estate_corporate';

export const ARTICLE_CATEGORIES = [
  'debt_liabilities',
  'traffic_accidents',
  'divorce_gender_issues',
  'inheritance_wills',
  'labor_issues',
  'financial_troubles',
  'medical_issues',
  'foreign_nationals_issues',
  'internet_issues',
  'real_estate_corporate',
] as const;

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  thumbnail?: string;
  status: ArticleStatus;
  author: User;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleCreateRequest {
  title: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  thumbnail?: string;
  status: ArticleStatus;
}

export interface ArticleUpdateRequest {
  title?: string;
  content?: string;
  summary?: string;
  category?: ArticleCategory;
  thumbnail?: string;
  status?: ArticleStatus;
}

export interface ArticleSearchParams {
  category?: ArticleCategory;
  status?: ArticleStatus;
  query?: string;
  page?: number;
  limit?: number;
} 