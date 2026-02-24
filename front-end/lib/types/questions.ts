import {LawyerBrief, LawyerResponse} from './lawyers';
import {User} from "@/lib/types/users";

export type QuestionStatus = 'open' | 'answered' | 'closed';

export interface Question {
  id: number;
  title: string;
  content: string;
  status: QuestionStatus;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  answer_count: number;
  is_hidden: boolean;
  user: User;
}

export interface Answer {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
  upvotes: number;
  lawyer: LawyerResponse;
}

export interface QuestionCreateRequest {
  title: string;
  content: string;
}

export interface AnswerCreateRequest {
  content: string;
  question_id: number;
}

export interface QuestionSearchParams {
  status?: QuestionStatus;
  title?: string;
  is_public?: string;
  page?: number;
  limit?: number;
  page_size?: number;
} 