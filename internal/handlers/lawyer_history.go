package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"github.com/kotolino/lawyer/internal/services"
)

// GetLawyerHistoryHandler returns the history of changes for a specific lawyer
func GetLawyerHistoryHandler(c *gin.Context) {
	// Get lawyer ID from URL parameter
	lawyerIDStr := c.Param("id")
	lawyerID, err := strconv.Atoi(lawyerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
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

	// Get lawyer history
	history, pagination, err := services.GetLawyerHistory(repository.DB, lawyerID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get lawyer history", responses.ErrCodeDatabaseError)
		return
	}

	// Return paginated response with proper API format
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		history,
		pagination.CurrentPage,
		pagination.PerPage,
		pagination.Total,
		pagination.TotalPages,
	)
}

// LogLawyerChange adds an entry to lawyer history
func LogLawyerChange(lawyerID, userID int, changes []models.FieldChange) error {
	return services.LogLawyerChange(repository.DB, lawyerID, userID, changes)
}
