package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// CreateReviewRequest represents the request to create a review
type CreateReviewRequest struct {
	LawyerID      int     `json:"lawyer_id" binding:"required"`
	AppointmentID *int    `json:"appointment_id,omitempty"`
	Rating        int     `json:"rating" binding:"required,min=1,max=5"`
	Comment       *string `json:"comment,omitempty"`
}

// UpdateReviewRequest represents the request to update a review
type UpdateReviewRequest struct {
	Rating  int     `json:"rating" binding:"required,min=1,max=5"`
	Comment *string `json:"comment,omitempty"`
}

// UpdateReviewStatusRequest represents the request to update a review's approval status
type UpdateReviewStatusRequest struct {
	ApprovedStatus string  `json:"approved_status" binding:"required,oneof=approved rejected pending"`
	HiddenReason   *string `json:"hidden_reason,omitempty"`
}

// @Summary Get all reviews
// @Description Returns a paginated list of reviews with optional filtering
// @Tags reviews
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Param lawyer_id query int false "Filter by lawyer ID"
// @Param user_id query int false "Filter by user ID"
// @Param status query string false "Filter by approval status"
// @Param search query string false "Search term"
// @Param sort query string false "Field to sort by" default(created_at)
// @Param order query string false "Sort direction ('asc' or 'desc')" default(desc)
// @Success 200 {object} responses.PaginatedResponse{data=[]responses.ReviewResponse}
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews [get]
// GetReviewsHandler returns all reviews with optional filtering
func GetReviewsHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get query parameters for filtering
	lawyerIDStr := c.Query("lawyer_id")
	userIDStr := c.Query("user_id")
	status := c.Query("status")
	search := c.Query("search")
	sortField := c.DefaultQuery("sort", "created_at")
	sortDir := c.DefaultQuery("order", "desc")

	// Normalize sortDir
	if sortDir != "asc" {
		sortDir = "desc"
	}

	var lawyerID, userID *int

	// Parse lawyer ID if provided
	if lawyerIDStr != "" {
		id, err := strconv.Atoi(lawyerIDStr)
		if err != nil {
			responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
			return
		}
		lawyerID = &id
	}

	// Parse user ID if provided
	if userIDStr != "" {
		id, err := strconv.Atoi(userIDStr)
		if err != nil {
			responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
			return
		}
		userID = &id
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get reviews with filtering, search, sorting and pagination
	reviews, total, err := reviewService.GetReviews(page, limit, search, status, lawyerID, userID, sortField, sortDir)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve reviews", responses.ErrCodeDatabaseError)
		return
	}

	// parse reviews response
	reviewsResponse := make([]responses.ReviewResponse, len(reviews))
	for i, review := range reviews {
		reviewsResponse[i] = responses.ReviewResponse{
			ID:       review.ID,
			UserID:   review.UserID,
			LawyerID: review.LawyerID,
			User: responses.UserResponse{
				ID:        review.User.ID,
				Role:      review.User.Role,
				Email:     review.User.Email,
				FirstName: review.User.FirstName,
				Nickname:  review.User.Nickname,
				LastName:  review.User.LastName,
				CreatedAt: review.User.CreatedAt,
				UpdatedAt: review.User.UpdatedAt,
			},
			Lawyer: responses.LawyerResponse{
				ID:       review.Lawyer.ID,
				FullName: review.Lawyer.FullName,
				Email:    review.Lawyer.Email,
			},
			AppointmentID:  review.AppointmentID,
			Rating:         review.Rating,
			Comment:        review.Comment,
			ApprovedStatus: review.ApprovedStatus,
			IsHidden:       review.IsHidden,
			IsPin:          review.IsPin,
			HiddenReason:   review.HiddenReason,
			CreatedAt:      review.CreatedAt,
			UpdatedAt:      review.UpdatedAt,
		}
	}

	// Calculate total pages
	totalPages := (int(total) + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		reviewsResponse,
		page,
		limit,
		int(total),
		totalPages,
	)
}

// @Summary Get review by ID
// @Description Returns a specific review by ID
// @Tags reviews
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Review ID"
// @Success 200 {object} models.Review
// @Failure 400 {object} responses.APIErrorResponse "Invalid review ID"
// @Failure 404 {object} responses.APIErrorResponse "Review not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/{id} [get]
// GetReviewByIDHandler returns a specific review by ID
func GetReviewByIDHandler(c *gin.Context) {
	// Get the review ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid review ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get the review
	review, err := reviewService.GetReviewByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Review not found", responses.ErrCodeResourceNotFound)
		return
	}

	responses.NewAPIResponse(c).OK(review)
}

// @Summary Get reviews for lawyer
// @Description Returns a paginated list of reviews for a specific lawyer
// @Tags reviews
// @Produce json
// @Param id path int true "Lawyer ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]models.Review}
// @Failure 400 {object} responses.APIErrorResponse "Invalid lawyer ID"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/{id}/reviews [get]
// GetReviewsForLawyerHandler returns all reviews for a lawyer
func GetReviewsForLawyerHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get the lawyer ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get reviews for the lawyer
	reviews, err := reviewService.GetReviewsByLawyerID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve reviews", responses.ErrCodeDatabaseError)
		return
	}

	// Get total items count
	totalItems := len(reviews)

	// Calculate total pages
	totalPages := (totalItems + limit - 1) / limit

	// Apply pagination
	start := (page - 1) * limit
	end := start + limit
	if start >= len(reviews) {
		reviews = []models.Review{}
	} else if end > len(reviews) {
		reviews = reviews[start:]
	} else {
		reviews = reviews[start:end]
	}

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		reviews,
		page,
		limit,
		totalItems,
		totalPages,
	)
}

// @Summary Get user reviews
// @Description Returns a paginated list of reviews created by the authenticated user
// @Tags reviews
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]models.Review}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/me [get]
// GetUserReviewsHandler returns all reviews by the current user
func GetUserReviewsHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get reviews by the user
	reviews, err := reviewService.GetReviewsByUserID(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve reviews", responses.ErrCodeDatabaseError)
		return
	}

	// Get total items count
	totalItems := len(reviews)

	// Calculate total pages
	totalPages := (totalItems + limit - 1) / limit

	// Apply pagination
	start := (page - 1) * limit
	end := start + limit
	if start >= len(reviews) {
		reviews = []models.Review{}
	} else if end > len(reviews) {
		reviews = reviews[start:]
	} else {
		reviews = reviews[start:end]
	}

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		reviews,
		page,
		limit,
		totalItems,
		totalPages,
	)
}

// @Summary Create review
// @Description Creates a new review
// @Tags reviews
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param review body CreateReviewRequest true "Review details"
// @Success 201 {object} models.Review
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews [post]
// CreateReviewHandler creates a new review
func CreateReviewHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Parse the request body
	var req CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// If an appointment ID is provided, verify that it belongs to the user and lawyer
	if req.AppointmentID != nil {
		appointmentService := services.NewAppointmentService()
		appointment, err := appointmentService.GetAppointmentByID(*req.AppointmentID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
			return
		}

		// Check if the appointment belongs to the user and lawyer
		if appointment.UserID != userID || appointment.LawyerID != req.LawyerID {
			responses.NewAPIResponse(c).Forbidden("You can only review appointments you have attended", responses.ErrCodeForbidden)
			return
		}

		// Check if the appointment is completed
		if appointment.Status != "completed" {
			responses.NewAPIResponse(c).BadRequest("You can only review completed appointments", responses.ErrCodeInvalidRequest)
			return
		}
	}

	// Create the review
	review := models.Review{
		UserID:        userID,
		LawyerID:      req.LawyerID,
		AppointmentID: req.AppointmentID,
		Rating:        req.Rating,
		Comment:       req.Comment,
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Create the review
	err := reviewService.CreateReview(&review)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create review", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).Created(review)
}

// @Summary Update review
// @Description Updates an existing review
// @Tags reviews
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Review ID"
// @Param review body UpdateReviewRequest true "Updated review details"
// @Success 200 {object} models.Review
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "Review not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/{id} [put]
// UpdateReviewHandler updates an existing review
func UpdateReviewHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get the review ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid review ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get the existing review
	existingReview, err := reviewService.GetReviewByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Review not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the user owns this review
	if existingReview.UserID != userID {
		// Check if the user is an admin
		userRole, _ := middleware.GetUserRole(c)
		if userRole != "admin" {
			responses.NewAPIResponse(c).Forbidden("You can only update your own reviews", responses.ErrCodeForbidden)
			return
		}
	}

	// Parse the request body
	var req UpdateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Update the review
	existingReview.Rating = req.Rating
	existingReview.Comment = req.Comment

	// Update the review
	err = reviewService.UpdateReview(existingReview)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update review", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(existingReview)
}

// @Summary Delete review
// @Description Deletes an existing review
// @Tags reviews
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Review ID"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid review ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "Review not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/{id} [delete]
// DeleteReviewHandler deletes a review
func DeleteReviewHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get the review ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid review ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get the review
	review, err := reviewService.GetReviewByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Review not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the user owns this review
	if review.UserID != userID {
		// Check if the user is an admin
		userRole, _ := middleware.GetUserRole(c)
		if userRole != "admin" {
			responses.NewAPIResponse(c).Forbidden("You can only delete your own reviews", responses.ErrCodeForbidden)
			return
		}
	}

	// Delete the review
	err = reviewService.DeleteReview(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete review", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Review deleted successfully"})
}

// @Summary Update review status
// @Description Updates a review's approval status (admin only)
// @Tags reviews
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Review ID"
// @Param status body UpdateReviewStatusRequest true "Status update details"
// @Success 200 {object} models.Review
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "Review not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/{id}/status [put]
// UpdateReviewStatusHandler updates a review's approval status (admin only)
func UpdateReviewStatusHandler(c *gin.Context) {
	// Ensure the user is an admin
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Admin access required", responses.ErrCodeForbidden)
		return
	}

	// Get the review ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid review ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Parse the request body
	var req UpdateReviewStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the review service
	reviewService := services.NewReviewService()

	// Get the existing review
	existingReview, err := reviewService.GetReviewByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Review not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Update the review status
	existingReview.ApprovedStatus = &req.ApprovedStatus

	// If the status is 'rejected', update the hidden status and reason
	if req.ApprovedStatus == "rejected" {
		existingReview.IsHidden = true
		existingReview.HiddenReason = req.HiddenReason
	} else if req.ApprovedStatus == "approved" {
		existingReview.IsHidden = false
		existingReview.HiddenReason = nil
	}

	// Update the review
	err = reviewService.UpdateReviewStatus(existingReview)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update review status", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(existingReview)
}

type PinReviewRequest struct {
	IsPin *bool `json:"is_pin" binding:"required"`
}

// @Summary Pin or unpin review
// @Description Pins or unpins a review to highlight it (admin only)
// @Tags reviews
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Review ID"
// @Param pin body PinReviewRequest true "Pin status"
// @Success 200 {object} models.Review
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or cannot pin more than 3 reviews"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "Review not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/{id}/pin [put]
func PinReviewHandler(c *gin.Context) {
	// admin only
	role, ok := middleware.GetUserRole(c)
	if !ok || role != "admin" {
		responses.NewAPIResponse(c).Forbidden("Admin access required", responses.ErrCodeForbidden)
		return
	}

	// parse review ID
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid review ID", responses.ErrCodeInvalidRequest)
		return
	}

	// bind request
	var req PinReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	svc := services.NewReviewService()
	updated, err := svc.PinReview(id, *req.IsPin)
	if err != nil {
		// if not found
		switch err.Error() {
		case "review not found":
			responses.NewAPIResponse(c).NotFound("Review not found", responses.ErrCodeResourceNotFound)
		case "cannot pin more than 3 reviews":
			responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		default:
			responses.NewAPIResponse(c).InternalServerError("Failed to update pin status", responses.ErrCodeDatabaseError)
		}
		return
	}

	responses.NewAPIResponse(c).OK(updated)
}

// @Summary Get pinned reviews
// @Description Returns all pinned reviews
// @Tags reviews
// @Produce json
// @Success 200 {array} models.Review
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /reviews/pinned [get]
func GetPinnedReviewsHandler(c *gin.Context) {
	svc := services.NewReviewService()

	reviews, err := svc.GetPinnedReviews()
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to fetch pinned reviews", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).
		OK(reviews)
}
