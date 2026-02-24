package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// QuestionResponse represents the response for a question
type QuestionResponse struct {
	ID          int                    `json:"id"`
	Title       string                 `json:"title"`
	Content     string                 `json:"content"`
	UserID      int                    `json:"user_id"`
	User        responses.UserResponse `json:"user"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
	Status      string                 `json:"status"`
	IsHidden    bool                   `json:"is_hidden"`
	AnswerCount int64                  `json:"answer_count"`
}

// @Summary Get all questions
// @Description Retrieves a paginated list of questions with optional filtering
// @Tags questions
// @Produce json
// @Param params[page] query int false "Page number" default(1)
// @Param params[limit] query int false "Number of items per page" default(10)
// @Param params[status] query string false "Filter by status"
// @Param params[title] query string false "Filter by title"
// @Param params[is_public] query string false "Filter by public/private status"
// @Success 200 {object} responses.PaginatedResponse{data=[]QuestionResponse}
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions [get]
func GetQuestionsHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("params[page]", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("params[limit]", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get query parameters for filtering
	status := c.Query("params[status]")
	title := c.Query("params[title]")
	isPublic := c.Query("params[is_public]")

	// Get questions from the database
	questions, answerCounts, totalCount, err := services.GetQuestionService().GetQuestionsWithPagination(title, status, isPublic, page, limit)

	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get questions", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	responseItems := make([]QuestionResponse, 0, len(questions))

	for _, question := range questions {
		responseItems = append(responseItems, QuestionResponse{
			ID:      question.ID,
			Title:   question.Title,
			Content: question.Content,
			UserID:  question.UserID,
			User: responses.UserResponse{
				ID:        question.User.ID,
				Email:     question.User.Email,
				FirstName: question.User.FirstName,
				LastName:  question.User.LastName,
				Nickname:  question.User.Nickname,
				Role:      question.User.Role,
				CreatedAt: question.User.CreatedAt,
				UpdatedAt: question.User.UpdatedAt,
			},
			CreatedAt:   question.CreatedAt,
			UpdatedAt:   question.UpdatedAt,
			Status:      question.Status,
			IsHidden:    question.IsHidden,
			AnswerCount: answerCounts[question.ID],
		})
	}

	// Calculate total pages
	totalPages := (int(totalCount) + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		responseItems,
		page,
		limit,
		int(totalCount),
		totalPages,
	)
}

// @Summary Get question by ID
// @Description Retrieves a specific question by its ID
// @Tags questions
// @Produce json
// @Param id path int true "Question ID"
// @Success 200 {object} QuestionResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid question ID"
// @Failure 404 {object} responses.APIErrorResponse "Question not found"
// @Router /questions/{id} [get]
func GetQuestionByIDHandler(c *gin.Context) {
	// Get question ID from URL
	questionIDStr := c.Param("id")
	questionID, err := strconv.Atoi(questionIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get question
	question, err := services.GetQuestionService().GetQuestionByID(questionID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound(err.Error(), responses.ErrCodeResourceNotFound)
		return
	}

	responses.NewAPIResponse(c).OK(QuestionResponse{
		ID:      question.ID,
		Title:   question.Title,
		Content: question.Content,
		UserID:  question.UserID,
		User: responses.UserResponse{
			ID:        question.User.ID,
			FirstName: question.User.FirstName,
			LastName:  question.User.LastName,
			Nickname:  question.User.Nickname,
			Role:      question.User.Role,
		},
		CreatedAt: question.CreatedAt,
		UpdatedAt: question.UpdatedAt,
		Status:    question.Status,
	})
}

// @Summary Get user questions
// @Description Retrieves a paginated list of questions created by a specific user
// @Tags questions
// @Produce json
// @Param id path int true "User ID"
// @Param params[page] query int false "Page number" default(1)
// @Param params[limit] query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]QuestionResponse}
// @Failure 400 {object} responses.APIErrorResponse "Invalid user ID"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id}/questions [get]
func GetUserQuestionsHandler(c *gin.Context) {
	// Get user ID from URL parameter
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
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

	// Get questions from the database
	questions, totalCount, err := services.GetQuestionService().GetUserQuestionsWithPagination(userID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get questions", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	var responseItems []QuestionResponse
	for _, question := range questions {
		responseItems = append(responseItems, QuestionResponse{
			ID:        question.ID,
			Title:     question.Title,
			Content:   question.Content,
			UserID:    question.UserID,
			CreatedAt: question.CreatedAt,
			UpdatedAt: question.UpdatedAt,
			Status:    question.Status,
			IsHidden:  question.IsHidden,
		})
	}

	// Calculate total pages
	totalPages := (int(totalCount) + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		responseItems,
		page,
		limit,
		int(totalCount),
		totalPages,
	)
}

// @Summary Create question
// @Description Creates a new question
// @Tags questions
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param question body models.Question true "Question details"
// @Success 201 {object} QuestionResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions [post]
func CreateQuestionHandler(c *gin.Context) {
	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Bind request body
	var question models.Question
	if err := c.ShouldBindJSON(&question); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Set the user ID
	question.UserID = userID

	// Create question
	createdQuestion, err := services.GetQuestionService().CreateQuestion(question)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create question", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).Created(createdQuestion)
}

// @Summary Update question
// @Description Updates an existing question
// @Tags questions
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Question ID"
// @Param question body models.Question true "Updated question details"
// @Success 200 {object} QuestionResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden"
// @Failure 404 {object} responses.APIErrorResponse "Question not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{id} [put]
func UpdateQuestionHandler(c *gin.Context) {
	// Get question ID from URL
	questionIDStr := c.Param("id")
	questionID, err := strconv.Atoi(questionIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Bind request body
	var questionUpdate models.Question
	if err := c.ShouldBindJSON(&questionUpdate); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Update question
	updatedQuestion, err := services.GetQuestionService().UpdateQuestion(questionID, userID, questionUpdate)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update question", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(updatedQuestion)
}

// @Summary Update question status
// @Description Updates the status of an existing question (admins and question owner only)
// @Tags questions
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Question ID"
// @Param status body UpdateQuestionStatusRequest true "Status update"
// @Success 200 {object} gin.H "Success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden"
// @Failure 404 {object} responses.APIErrorResponse "Question not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{id}/status [put]
func UpdateQuestionStatusHandler(c *gin.Context) {
	// Get question ID from URL
	questionIDStr := c.Param("id")
	questionID, err := strconv.Atoi(questionIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Bind request body
	var statusUpdate struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&statusUpdate); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Update status
	if err := services.GetQuestionService().UpdateQuestionStatus(questionID, statusUpdate.Status); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update question status", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Question status updated"})
}

// @Summary Delete question
// @Description Deletes an existing question
// @Tags questions
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Question ID"
// @Success 200 {object} gin.H "Success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid question ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{id} [delete]
func DeleteQuestionHandler(c *gin.Context) {
	// Get question ID from URL
	questionIDStr := c.Param("id")
	questionID, err := strconv.Atoi(questionIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Delete question
	if err := services.GetQuestionService().DeleteQuestion(questionID, userID); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete question", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Question deleted"})
}

// @Summary Get my questions
// @Description Retrieves a paginated list of questions created by the authenticated user
// @Tags questions
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]QuestionResponse}
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/me [get]
func GetMyQuestionsHandler(c *gin.Context) {
	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
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

	// Get questions from the database
	questions, totalCount, err := services.GetQuestionService().GetUserQuestionsWithPagination(userID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get user questions", responses.ErrCodeDatabaseError)
		return
	}

	// Safe empty slice for response, never nil
	responseItems := make([]QuestionResponse, 0, len(questions))
	for _, question := range questions {
		responseItems = append(responseItems, QuestionResponse{
			ID:        question.ID,
			Title:     question.Title,
			Content:   question.Content,
			UserID:    question.UserID,
			CreatedAt: question.CreatedAt,
			UpdatedAt: question.UpdatedAt,
			Status:    question.Status,
			IsHidden:  question.IsHidden,
		})
	}

	// Calculate total pages
	totalPages := 0
	if totalCount > 0 {
		totalPages = (int(totalCount) + limit - 1) / limit
	}

	// Always return [] if empty, never null
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		responseItems,
		page,
		limit,
		int(totalCount),
		totalPages,
	)
}

type UpdateQuestionHiddenRequest struct {
	IsHidden *bool `json:"is_hidden" binding:"required"`
}

// UpdateQuestionStatusRequest represents a request to update the status of a question
type UpdateQuestionStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

// @Summary Update question visibility
// @Description Updates the visibility (hidden/public) of a question (admin only)
// @Tags questions
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Question ID"
// @Param visibility body UpdateQuestionHiddenRequest true "Visibility update"
// @Success 200 {object} models.Question
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "Question not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{id}/visibility [put]
func UpdateQuestionHiddenHandler(c *gin.Context) {
	// admin only
	role, ok := middleware.GetUserRole(c)
	if !ok || role != "admin" {
		responses.NewAPIResponse(c).Forbidden("Admin access required", responses.ErrCodeForbidden)
		return
	}

	// parse question ID
	idStr := c.Param("id")
	qID, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
		return
	}

	// bind JSON
	var req UpdateQuestionHiddenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	if req.IsHidden == nil {
		responses.NewAPIResponse(c).BadRequest("Field 'is_hidden' is required", responses.ErrCodeInvalidRequest)
		return
	}

	qs := services.GetQuestionService()
	q, err := qs.GetQuestionByID(qID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Question not found", responses.ErrCodeResourceNotFound)
		return
	}

	// only flip the hidden flag
	q.IsHidden = *req.IsHidden

	if err := qs.UpdateQuestionHidden(q); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update visibility", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(q)
}
