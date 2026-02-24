// API response interfaces

export interface PaginationMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationMeta;
}

// Error response interface
export interface ApiErrorResponse {
  error: string;
  code: string;
  status?: number;
}

// Error code types representing the backend error codes
export type ErrorCode = 
// Authentication errors
  | "INVALID_CREDENTIALS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "EMAIL_NOT_VERIFIED"

// Resource errors
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_ALREADY_EXISTS"

// Validation errors
  | "INVALID_REQUEST"
  | "VALIDATION_FAILED"
  | "MISSING_REQUIRED_FIELD"

// Server errors
  | "INTERNAL_SERVER_ERROR"
  | "DATABASE_ERROR"

// Business logic errors
  | "OPERATION_FAILED"
  | "QUOTA_EXCEEDED"
  | "INVALID_OPERATION"