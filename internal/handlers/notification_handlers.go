package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/models"
)

// GetNotificationsRequest represents the request to get notifications
type GetNotificationsRequest struct {
	Limit  int `form:"limit,default=10"`
	Offset int `form:"offset,default=0"`
}

// Notification is an alias for models.Notification to make it visible to Swagger
type Notification = models.Notification

// @Summary Get all notifications
// @Description Returns a paginated list of notifications for the authenticated user
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications [get]
// GetNotificationsHandler returns all notifications for the current user
func GetNotificationsHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

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
	
	// Calculate offset
	offset := (page - 1) * limit

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Get notifications for the user
	notifications, err := notificationService.GetNotificationsByUserID(userID, limit, offset)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve notifications", responses.ErrCodeDatabaseError)
		return
	}
	
	// Get total count
	totalCount, err := notificationService.GetNotificationsCount(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve notification count", responses.ErrCodeDatabaseError)
		return
	}
	
	// Calculate total pages
	totalPages := (totalCount + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		notifications,
		page,
		limit,
		totalCount,
		totalPages,
	)
}

// @Summary Get notification by ID
// @Description Returns a specific notification by ID
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Notification ID"
// @Success 200 {object} Notification
// @Failure 400 {object} responses.APIErrorResponse "Invalid notification ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "Notification not found"
// @Router /notifications/{id} [get]
// GetNotificationByIDHandler returns a specific notification by ID
func GetNotificationByIDHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid notification ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Get the notification
	notification, err := notificationService.GetNotificationByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Notification not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the notification belongs to the current user
	if notification.UserID != userID {
		responses.NewAPIResponse(c).Forbidden("You don't have permission to view this notification", responses.ErrCodeForbidden)
		return
	}

	responses.NewAPIResponse(c).OK(notification)
}

// @Summary Get unread notification count
// @Description Returns the count of unread notifications for the authenticated user
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H{count=int}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications/unread/count [get]
// GetUnreadNotificationCountHandler returns the count of unread notifications for the current user
func GetUnreadNotificationCountHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Get the unread notification count
	count, err := notificationService.GetUnreadNotificationCount(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve notification count", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"count": count})
}

// @Summary Mark notification as read
// @Description Marks a specific notification as read
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Notification ID"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid notification ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "Notification not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications/{id}/read [put]
// MarkNotificationAsReadHandler marks a notification as read
func MarkNotificationAsReadHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid notification ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Get the notification to check ownership
	notification, err := notificationService.GetNotificationByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Notification not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the user owns this notification
	if notification.UserID != userID {
		responses.NewAPIResponse(c).Forbidden("You can only mark your own notifications as read", responses.ErrCodeForbidden)
		return
	}

	// Mark the notification as read
	err = notificationService.MarkNotificationAsRead(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to mark notification as read", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Notification marked as read"})
}

// @Summary Mark all notifications as read
// @Description Marks all notifications for the authenticated user as read
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H{message=string}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications/read-all [put]
// MarkAllNotificationsAsReadHandler marks all notifications for the current user as read
func MarkAllNotificationsAsReadHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Mark all notifications as read
	err := notificationService.MarkAllNotificationsAsRead(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to mark notifications as read", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "All notifications marked as read"})
}

// @Summary Delete notification
// @Description Deletes a specific notification
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Notification ID"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid notification ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "Notification not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications/{id} [delete]
// DeleteNotificationHandler deletes a notification
func DeleteNotificationHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid notification ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Get the notification to check ownership
	notification, err := notificationService.GetNotificationByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Notification not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the user owns this notification
	if notification.UserID != userID {
		responses.NewAPIResponse(c).Forbidden("You can only delete your own notifications", responses.ErrCodeForbidden)
		return
	}

	// Delete the notification
	err = notificationService.DeleteNotification(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete notification", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Notification deleted successfully"})
}

// @Summary Delete all notifications
// @Description Deletes all notifications for the authenticated user
// @Tags notifications
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H{message=string}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /notifications [delete]
// DeleteAllNotificationsHandler deletes all notifications for the current user
func DeleteAllNotificationsHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the notification service
	notificationService := services.NewNotificationService()

	// Delete all notifications
	err := notificationService.DeleteAllNotifications(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete all notifications", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "All notifications deleted successfully"})
}
