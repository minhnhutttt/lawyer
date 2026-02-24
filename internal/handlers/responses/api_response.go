package responses

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIResponse is a helper to create standardized API responses
type APIResponse struct {
	ctx *gin.Context
}

// NewAPIResponse creates a new API response helper
func NewAPIResponse(c *gin.Context) *APIResponse {
	return &APIResponse{
		ctx: c,
	}
}

// ErrorCode represents specific error codes that can be used by the frontend
type ErrorCode string

// Error codes
const (
	// Authentication errors
	ErrCodeInvalidCredentials ErrorCode = "INVALID_CREDENTIALS"
	ErrCodeUnauthorized       ErrorCode = "UNAUTHORIZED"
	ErrCodeForbidden          ErrorCode = "FORBIDDEN"
	ErrCodeEmailNotVerified   ErrorCode = "EMAIL_NOT_VERIFIED"

	// Resource errors
	ErrCodeResourceNotFound      ErrorCode = "RESOURCE_NOT_FOUND"
	ErrCodeResourceAlreadyExists ErrorCode = "RESOURCE_ALREADY_EXISTS"

	// Validation errors
	ErrCodeInvalidRequest       ErrorCode = "INVALID_REQUEST"
	ErrCodeValidationFailed     ErrorCode = "VALIDATION_FAILED"
	ErrCodeMissingRequiredField ErrorCode = "MISSING_REQUIRED_FIELD"

	// Server errors
	ErrCodeInternalServer ErrorCode = "INTERNAL_SERVER_ERROR"
	ErrCodeDatabaseError  ErrorCode = "DATABASE_ERROR"

	// Business logic errors
	ErrCodeOperationFailed        ErrorCode = "OPERATION_FAILED"
	ErrCodeEmailIsAlreadyInUse    ErrorCode = "EMAIL_IS_ALREADY_IN_USE"
	ErrCodeEmailIsAlreadyVerified ErrorCode = "EMAIL_IS_ALREADY_VERIFIED"
)

// Success returns a successful response with data wrapped in a data field
func (r *APIResponse) Success(statusCode int, data interface{}) {
	r.ctx.JSON(statusCode, gin.H{
		"data": data,
	})
}

// Error returns an error response with an error code
func (r *APIResponse) Error(statusCode int, message string, code ErrorCode) {
	r.ctx.JSON(statusCode, gin.H{
		"error": message,
		"code":  code,
	})
}

// Paginated returns a paginated response with the data wrapped in a data field
// and pagination information
func (r *APIResponse) Paginated(statusCode int, data interface{}, page, pageSize, totalItems, totalPages int) {
	r.ctx.JSON(statusCode, ListResponse{
		Data: data,
		Pagination: PaginationResponse{
			Page:       page,
			PageSize:   pageSize,
			TotalItems: totalItems,
			TotalPages: totalPages,
		},
	})
}

// Created returns a 201 Created response with the data wrapped in a data field
func (r *APIResponse) Created(data interface{}) {
	r.Success(http.StatusCreated, data)
}

// OK returns a 200 OK response with the data wrapped in a data field
func (r *APIResponse) OK(data interface{}) {
	r.Success(http.StatusOK, data)
}

// NoContent returns a 204 No Content response
func (r *APIResponse) NoContent() {
	r.ctx.Status(http.StatusNoContent)
}

// BadRequest returns a 400 Bad Request response with an error message and code
func (r *APIResponse) BadRequest(message string, code ErrorCode) {
	if code == "" {
		code = ErrCodeInvalidRequest
	}
	r.Error(http.StatusBadRequest, message, code)
}

// Unauthorized returns a 401 Unauthorized response with an error message and code
func (r *APIResponse) Unauthorized(message string, code ErrorCode) {
	if code == "" {
		code = ErrCodeUnauthorized
	}
	r.Error(http.StatusUnauthorized, message, code)
}

// Forbidden returns a 403 Forbidden response with an error message and code
func (r *APIResponse) Forbidden(message string, code ErrorCode) {
	if code == "" {
		code = ErrCodeForbidden
	}
	r.Error(http.StatusForbidden, message, code)
}

// NotFound returns a 404 Not Found response with an error message and code
func (r *APIResponse) NotFound(message string, code ErrorCode) {
	if code == "" {
		code = ErrCodeResourceNotFound
	}
	r.Error(http.StatusNotFound, message, code)
}

// InternalServerError returns a 500 Internal Server Error response with an error message and code
func (r *APIResponse) InternalServerError(message string, code ErrorCode) {
	if code == "" {
		code = ErrCodeInternalServer
	}
	r.Error(http.StatusInternalServerError, message, code)
}
