import { PaginationMeta } from "../types";
import { ApiResponse } from "../types/api";

export interface FieldChange {
  field: string;
  old: any;
  new: any;
}

export interface LawyerHistory {
  id: number;
  lawyer_id: number;
  user_id: number;
  changes: FieldChange[];
  created_at: string;
  user_name?: string;  // Optional field that might be populated by the backend
}

// Use the standard ApiResponse type to maintain consistency
export type LawyerHistoryResponse = ApiResponse<LawyerHistory[]>;

export interface LawyerHistoryParams {
  lawyer_id: number;
  page?: number;
  limit?: number;
}
