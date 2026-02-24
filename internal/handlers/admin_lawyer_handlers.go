package handlers

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
)

// LawyerVerificationRequest represents the request to update lawyer verification status
type LawyerVerificationRequest struct {
	IsVerified bool `json:"is_verified" binding:"required"`
}

// LawyerVerificationResponse represents the response after updating lawyer verification
type LawyerVerificationResponse struct {
	ID         int    `json:"id"`
	IsVerified bool   `json:"is_verified"`
	Message    string `json:"message"`
}

// VerifyLawyerHandler handles the request to update a lawyer's verification status
func VerifyLawyerHandler(c *gin.Context) {
	// Check admin permissions
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Admin access required", responses.ErrCodeForbidden)
		return
	}

	// Get the lawyer ID from the URL parameter
	lawyerID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Parse request body
	var req LawyerVerificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid request body", responses.ErrCodeInvalidRequest)
		return
	}

	// Get lawyer service
	lawyerService := services.NewLawyerService()

	// Check if lawyer exists
	_, err = lawyerService.GetLawyerByID(lawyerID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Update the verification status
	err = lawyerService.UpdateLawyerVerificationStatus(uint(lawyerID), req.IsVerified)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update lawyer verification status", responses.ErrCodeDatabaseError)
		return
	}

	// Log the verification action
	userID, _ := middleware.GetUserID(c)
	if req.IsVerified {
		fmt.Printf("Lawyer %d verified by admin (user ID: %v)\n", lawyerID, userID)
	} else {
		fmt.Printf("Lawyer %d verification revoked by admin (user ID: %v)\n", lawyerID, userID)
	}

	// Create response
	response := LawyerVerificationResponse{
		ID:         lawyerID,
		IsVerified: req.IsVerified,
		Message:    "Lawyer verification status updated successfully",
	}

	// Return success response
	responses.NewAPIResponse(c).OK(response)
}
