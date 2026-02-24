package responses

// GenericResponse represents a basic response with a message
type GenericResponse struct {
	Message string `json:"message"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// APIErrorResponse represents an API error response with error message and code
type APIErrorResponse struct {
	Error string    `json:"error"`
	Code  ErrorCode `json:"code"`
}

// PaginationResponse represents a paginated response
type PaginationResponse struct {
	Page       int `json:"page"`
	PageSize   int `json:"page_size"`
	TotalItems int `json:"total_items"`
	TotalPages int `json:"total_pages"`
}

// ListResponse represents a paginated list response
type ListResponse struct {
	Data       interface{}      `json:"data"`
	Pagination PaginationResponse `json:"pagination"`
}

// PaginatedResponse is an alias for ListResponse to maintain compatibility with Swagger annotations
type PaginatedResponse = ListResponse