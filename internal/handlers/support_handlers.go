package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// SupportContactRequest represents the data sent from the support contact form
type SupportContactRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Message string `json:"message" binding:"required"`
}

// ContactSupportHandler handles the contact form submission and sends an email to the support team
// @Summary Submit a contact form
// @Description Submits a contact form and sends an email to the support team
// @Tags support
// @Accept json
// @Produce json
// @Param request body SupportContactRequest true "Support contact request"
// @Success 200 {object} responses.SuccessResponse
// @Failure 400 {object} responses.ErrorResponse
// @Failure 500 {object} responses.ErrorResponse
// @Router /api/support/contact [post]
func ContactSupportHandler(c *gin.Context) {
	var req SupportContactRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user information if authenticated
	userID, exists := middleware.GetUserID(c)
	var userInfo *models.User
	var userRole string

	if exists {
		var err error
		userService := services.GetUserService()
		userInfo, err = userService.GetUserByID(userID)
		if err == nil && userInfo != nil {
			userRole = userInfo.Role
		}
	}

	currentTime := time.Now().Format("2006/01/02 - 15:04")

	// Get support service and send the email
	supportService := services.GetSupportService()
	err := supportService.SendSupportContactEmail(req.Name, req.Email, req.Message, currentTime, userRole)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send support email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Your message has been sent successfully"})
}
