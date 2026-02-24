package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"github.com/kotolino/lawyer/internal/services"
)

// AnswerResponse represents the response for an answer
type AnswerResponse struct {
	ID         int                      `json:"id"`
	Content    string                   `json:"content"`
	QuestionID int                      `json:"question_id"`
	LawyerID   int                      `json:"lawyer_id"`
	Lawyer     responses.LawyerResponse `json:"lawyer"` // New field for the lawyer object
	CreatedAt  time.Time                `json:"created_at"`
	UpdatedAt  time.Time                `json:"updated_at"`
	IsAccepted bool                     `json:"is_accepted"`
}

// @Summary Get answers by question
// @Description Retrieves all answers for a specific question with pagination
// @Tags answers
// @Param id path int true "Question ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]AnswerResponse}
// @Failure 400 {object} responses.APIErrorResponse "Invalid question ID"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{id}/answers [get]
func GetAnswersByQuestionHandler(c *gin.Context) {
	// Get question ID from URL parameter
	questionID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid question ID", responses.ErrCodeInvalidRequest)
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

	// Get answers from the database
	answers, totalCount, err := services.GetAnswerService().GetAnswersByQuestionWithPagination(questionID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get answers", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format, appending the Lawyer object to each answer
	var responseItems []AnswerResponse
	for _, answer := range answers {
		responseItems = append(responseItems, AnswerResponse{
			ID:         answer.ID,
			Content:    answer.Content,
			QuestionID: answer.QuestionID,
			LawyerID:   answer.LawyerID,
			Lawyer: responses.LawyerResponse{
				ID:           answer.Lawyer.ID,
				UserID:       answer.Lawyer.UserID,
				FullName:     answer.Lawyer.FullName,
				Email:        answer.Lawyer.Email,
				OfficeName:   answer.Lawyer.OfficeName,
				ProfileImage: answer.Lawyer.User.ProfileImage,
			},
			CreatedAt:  answer.CreatedAt,
			UpdatedAt:  answer.UpdatedAt,
			IsAccepted: answer.IsAccepted,
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

// @Summary Get answer by ID
// @Description Retrieves an answer by its ID
// @Tags answers
// @Param id path int true "Answer ID"
// @Success 200 {object} models.Answer
// @Failure 400 {object} responses.APIErrorResponse "Invalid answer ID"
// @Failure 404 {object} responses.APIErrorResponse "Answer not found"
// @Router /answers/{id} [get]
func GetAnswerByIDHandler(c *gin.Context) {
	// Get answer ID from URL
	answerIDStr := c.Param("id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid answer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get answer
	answer, err := services.GetAnswerService().GetAnswerByID(answerID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Answer not found", responses.ErrCodeResourceNotFound)
		return
	}

	responses.NewAPIResponse(c).OK(answer)
}

// @Summary Get lawyer answers
// @Description Retrieves all answers by a specific lawyer with pagination
// @Tags answers,lawyers
// @Param id path int true "Lawyer ID"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]AnswerResponse}
// @Failure 400 {object} responses.APIErrorResponse "Invalid lawyer ID"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/{id}/answers [get]
func GetLawyerAnswersHandler(c *gin.Context) {
	// Get lawyer ID from URL parameter
	lawyerID, err := strconv.Atoi(c.Param("id"))
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

	// Get answers from the database
	answers, totalCount, err := services.GetAnswerService().GetLawyerAnswersWithPagination(lawyerID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get answers", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	var responseItems []AnswerResponse
	for _, answer := range answers {
		responseItems = append(responseItems, AnswerResponse{
			ID:         answer.ID,
			Content:    answer.Content,
			QuestionID: answer.QuestionID,
			LawyerID:   answer.LawyerID,
			CreatedAt:  answer.CreatedAt,
			UpdatedAt:  answer.UpdatedAt,
			IsAccepted: answer.IsAccepted,
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

// @Summary Create answer
// @Description Creates a new answer to a question
// @Tags answers
// @Accept json
// @Produce json
// @Param question_id path int true "Question ID"
// @Param content body string true "Answer content"
// @Success 201 {object} AnswerResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - must be a lawyer"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /questions/{question_id}/answers [post]
func CreateAnswerHandler(c *gin.Context) {
	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get lawyer ID
	var lawyer models.Lawyer
	if err := repository.GetDB().Where("user_id = ?", userID).First(&lawyer).Error; err != nil {
		responses.NewAPIResponse(c).BadRequest("You must have a lawyer profile to answer questions", responses.ErrCodeUnauthorized)
		return
	}

	// Check if the lawyer is verified
	if !lawyer.IsVerified {
		responses.NewAPIResponse(c).Forbidden("Your lawyer account must be verified before answering questions", responses.ErrCodeForbidden)
		return
	}

	// Bind request body
	var answerRequest struct {
		QuestionID int    `json:"question_id" binding:"required"`
		Content    string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&answerRequest); err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid request payload", responses.ErrCodeInvalidRequest)
		return
	}

	// Create answer
	answer := models.Answer{
		QuestionID: answerRequest.QuestionID,
		LawyerID:   lawyer.ID,
		Content:    answerRequest.Content,
	}

	createdAnswer, err := services.GetAnswerService().CreateAnswer(answer)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create answer", responses.ErrCodeDatabaseError)
		return
	}

	resp := AnswerResponse{
		ID:         createdAnswer.ID,
		Content:    createdAnswer.Content,
		QuestionID: createdAnswer.QuestionID,
		LawyerID:   createdAnswer.LawyerID,
		Lawyer: responses.LawyerResponse{
			ID:           createdAnswer.Lawyer.ID,
			FullName:     createdAnswer.Lawyer.FullName,
			Email:        createdAnswer.Lawyer.Email,
			ProfileImage: createdAnswer.Lawyer.User.ProfileImage,
		},
		CreatedAt:  createdAnswer.CreatedAt,
		UpdatedAt:  createdAnswer.UpdatedAt,
		IsAccepted: createdAnswer.IsAccepted,
	}
	responses.NewAPIResponse(c).Created(resp)
}

// @Summary Update answer
// @Description Updates an existing answer
// @Tags answers
// @Accept json
// @Produce json
// @Param id path int true "Answer ID"
// @Param content body string true "New answer content"
// @Success 200 {object} AnswerResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid answer ID or request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - must be the answer author"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /answers/{id} [put]
func UpdateAnswerHandler(c *gin.Context) {
	// Get answer ID from URL
	answerIDStr := c.Param("id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid answer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get lawyer ID
	var lawyer models.Lawyer
	if err := repository.GetDB().Where("user_id = ?", userID).First(&lawyer).Error; err != nil {
		responses.NewAPIResponse(c).Forbidden("You must be a lawyer to update answers", responses.ErrCodeForbidden)
		return
	}

	// Bind request body
	var answerUpdate struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&answerUpdate); err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid update payload", responses.ErrCodeInvalidRequest)
		return
	}

	// Update answer
	updatedAnswer := models.Answer{
		Content: answerUpdate.Content,
	}

	result, err := services.GetAnswerService().UpdateAnswer(answerID, lawyer.ID, updatedAnswer)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update answer", responses.ErrCodeDatabaseError)
		return
	}

	resp := AnswerResponse{
		ID:         result.ID,
		Content:    result.Content,
		QuestionID: result.QuestionID,
		LawyerID:   result.LawyerID,
		Lawyer: responses.LawyerResponse{
			ID:           result.Lawyer.ID,
			FullName:     result.Lawyer.FullName,
			Email:        result.Lawyer.Email,
			ProfileImage: result.Lawyer.User.ProfileImage,
		},
		CreatedAt:  result.CreatedAt,
		UpdatedAt:  result.UpdatedAt,
		IsAccepted: result.IsAccepted,
	}
	responses.NewAPIResponse(c).OK(resp)
}

// @Summary Accept answer
// @Description Marks an answer as accepted by the question owner
// @Tags answers
// @Param id path int true "Answer ID"
// @Success 200 {object} gin.H "Answer accepted"
// @Failure 400 {object} responses.APIErrorResponse "Invalid answer ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /answers/{id}/accept [put]
func AcceptAnswerHandler(c *gin.Context) {
	// Get answer ID from URL
	answerIDStr := c.Param("id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid answer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Accept answer
	if err := services.GetAnswerService().AcceptAnswer(answerID, userID); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to accept answer", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Answer accepted"})
}

// @Summary Delete answer
// @Description Deletes an answer (must be the author)
// @Tags answers
// @Param id path int true "Answer ID"
// @Success 200 {object} gin.H "Answer deleted"
// @Failure 400 {object} responses.APIErrorResponse "Invalid answer ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - must be a lawyer"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /answers/{id} [delete]
func DeleteAnswerHandler(c *gin.Context) {
	// Get answer ID from URL
	answerIDStr := c.Param("id")
	answerID, err := strconv.Atoi(answerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid answer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get lawyer ID
	var lawyer models.Lawyer
	if err := repository.GetDB().Where("user_id = ?", userID).First(&lawyer).Error; err != nil {
		responses.NewAPIResponse(c).Forbidden("You must be a lawyer to delete answers", responses.ErrCodeForbidden)
		return
	}

	// Delete answer
	if err := services.GetAnswerService().DeleteAnswer(answerID, lawyer.ID); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete answer", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Answer deleted"})
}

// @Summary Get my answers
// @Description Retrieves all answers by the currently authenticated lawyer with pagination
// @Tags answers
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Success 200 {object} responses.PaginatedResponse{data=[]AnswerResponse}
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - must be a lawyer"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /me/answers [get]
func GetMyAnswersHandler(c *gin.Context) {
	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get lawyer ID
	var lawyer models.Lawyer
	if err := repository.GetDB().Where("user_id = ?", userID).First(&lawyer).Error; err != nil {
		responses.NewAPIResponse(c).Forbidden("You must be a lawyer to access this resource", responses.ErrCodeForbidden)
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

	// Get answers from the database
	answers, totalCount, err := services.GetAnswerService().GetLawyerAnswersWithPagination(lawyer.ID, page, limit)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get answers", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	var responseItems []AnswerResponse
	for _, answer := range answers {
		responseItems = append(responseItems, AnswerResponse{
			ID:         answer.ID,
			Content:    answer.Content,
			QuestionID: answer.QuestionID,
			LawyerID:   answer.LawyerID,
			CreatedAt:  answer.CreatedAt,
			UpdatedAt:  answer.UpdatedAt,
			IsAccepted: answer.IsAccepted,
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
