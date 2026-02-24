package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// ArticleResponse represents the response for an article
type ArticleResponse struct {
	ID          int                    `json:"id"`
	Title       string                 `json:"title"`
	Content     string                 `json:"content"`
	Category    string                 `json:"category"`
	Summary     *string                `json:"summary,omitempty"`
	Thumbnail   *string                `json:"thumbnail,omitempty"`
	AuthorID    int                    `json:"author_id"`
	Author      responses.UserResponse `json:"author"`
	PublishedAt time.Time              `json:"published_at"`
	UpdatedAt   *time.Time             `json:"updated_at,omitempty"`
	Status      string                 `json:"status"`
	Slug        string                 `json:"slug"`
}

// CreateArticleRequest represents the request body for creating an article
type CreateArticleRequest struct {
	Title     string  `json:"title" binding:"required"`
	Content   string  `json:"content" binding:"required"`
	Category  string  `json:"category" binding:"required"`
	Summary   *string `json:"summary"`
	Thumbnail *string `json:"thumbnail"`
	Status    string  `json:"status" binding:"required"`
	Slug      string  `json:"slug" binding:"required"`
}

// UpdateArticleRequest represents the request body for updating an article
type UpdateArticleRequest struct {
	Title     string  `json:"title"`
	Content   string  `json:"content"`
	Category  string  `json:"category"`
	Summary   *string `json:"summary"`
	Thumbnail *string `json:"thumbnail"`
	Status    string  `json:"status"`
	Slug      string  `json:"slug"`
}

// @Summary Get all articles
// @Description Retrieves a paginated list of articles with optional filtering
// @Tags articles
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Param params[category] query string false "Filter by category"
// @Param params[query] query string false "Search in title"
// @Param status query string false "Filter by status"
// @Success 200 {object} responses.PaginatedResponse{data=[]ArticleResponse}
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles [get]
func GetArticlesHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("params[limit]", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get query parameters for filtering
	category := c.Query("params[category]")
	title := c.Query("params[query]")
	status := c.Query("status")

	// Get articles from the database
	articles, err := services.GetArticleService().GetArticles(category, status, title)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get articles", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	var responseItems []ArticleResponse
	for _, article := range articles {
		updatedAt := article.UpdatedAt // Create a copy
		responseItems = append(responseItems, ArticleResponse{
			ID:          article.ID,
			Title:       article.Title,
			Content:     article.Content,
			Category:    article.Category,
			Summary:     article.Summary,
			Thumbnail:   article.Thumbnail,
			AuthorID:    article.AuthorID,
			PublishedAt: article.PublishedAt,
			UpdatedAt:   &updatedAt,
			Status:      article.Status,
			Slug:        article.Slug,
		})
	}

	// Get total items count
	totalItems := len(responseItems)

	// Calculate total pages
	totalPages := (totalItems + limit - 1) / limit

	// Apply pagination
	start := (page - 1) * limit
	end := start + limit
	if start >= len(responseItems) {
		responseItems = []ArticleResponse{}
	} else if end > len(responseItems) {
		responseItems = responseItems[start:]
	} else {
		responseItems = responseItems[start:end]
	}

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		responseItems,
		page,
		limit,
		totalItems,
		totalPages,
	)
}

// @Summary Get article by ID
// @Description Returns the article details by ID
// @Tags articles
// @Param id path int true "Article ID"
// @Success 200 {object} ArticleResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid article ID"
// @Failure 404 {object} responses.APIErrorResponse "Article not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles/{id} [get]
func GetArticleByIDHandler(c *gin.Context) {
	// Get article ID from URL parameter
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid article ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get article from the database
	article, err := services.GetArticleService().GetArticleByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			responses.NewAPIResponse(c).NotFound("Article not found", responses.ErrCodeResourceNotFound)
			return
		}
		responses.NewAPIResponse(c).InternalServerError("Failed to get article", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	updatedAt := article.UpdatedAt // Create a copy
	response := ArticleResponse{
		ID:          article.ID,
		Title:       article.Title,
		Content:     article.Content,
		Category:    article.Category,
		Summary:     article.Summary,
		Thumbnail:   article.Thumbnail,
		AuthorID:    article.AuthorID,
		PublishedAt: article.PublishedAt,
		UpdatedAt:   &updatedAt,
		Status:      article.Status,
		Slug:        article.Slug,
	}

	responses.NewAPIResponse(c).OK(response)
}

// @Summary Get article by slug
// @Description Returns the article details by slug
// @Tags articles
// @Param slug path string true "Article Slug"
// @Success 200 {object} ArticleResponse
// @Failure 404 {object} responses.APIErrorResponse "Article not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles/slug/{slug} [get]
func GetArticleBySlugHandler(c *gin.Context) {
	// Get article slug from URL parameter
	slug := c.Param("slug")

	// Get article from the database
	article, err := services.GetArticleService().GetArticleBySlug(slug)
	if err != nil {
		if err == sql.ErrNoRows {
			responses.NewAPIResponse(c).NotFound("Article not found", responses.ErrCodeResourceNotFound)
			return
		}
		responses.NewAPIResponse(c).InternalServerError("Failed to get article", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	updatedAt := article.UpdatedAt // Create a copy
	response := ArticleResponse{
		ID:        article.ID,
		Title:     article.Title,
		Content:   article.Content,
		Category:  article.Category,
		Summary:   article.Summary,
		Thumbnail: article.Thumbnail,
		AuthorID:  article.AuthorID,
		Author: responses.UserResponse{
			ID:        article.Author.ID,
			FirstName: article.Author.FirstName,
			Nickname:  article.Author.Nickname,
			LastName:  article.Author.LastName,
		},
		PublishedAt: article.PublishedAt,
		UpdatedAt:   &updatedAt,
		Status:      article.Status,
		Slug:        article.Slug,
	}

	responses.NewAPIResponse(c).OK(response)
}

// @Summary Create new article
// @Description Creates a new article
// @Tags articles
// @Accept json
// @Produce json
// @Param article body CreateArticleRequest true "Article data"
// @Success 201 {object} ArticleResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles [post]
func CreateArticleHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Parse request body
	var req CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Create article in the database
	now := time.Now()
	article := models.Article{
		Title:       req.Title,
		Content:     req.Content,
		Category:    req.Category,
		Summary:     req.Summary,
		Thumbnail:   req.Thumbnail,
		AuthorID:    userID,
		PublishedAt: now,
		Status:      req.Status,
		Slug:        req.Slug,
	}

	id, err := services.GetArticleService().CreateArticle(&article)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create article", responses.ErrCodeDatabaseError)
		return
	}

	// Set the ID of the created article
	article.ID = id

	// Convert to response format
	updatedAt := article.UpdatedAt // Create a copy
	response := ArticleResponse{
		ID:          article.ID,
		Title:       article.Title,
		Content:     article.Content,
		Category:    article.Category,
		Summary:     article.Summary,
		Thumbnail:   article.Thumbnail,
		AuthorID:    article.AuthorID,
		PublishedAt: article.PublishedAt,
		UpdatedAt:   &updatedAt,
		Status:      article.Status,
		Slug:        article.Slug,
	}

	responses.NewAPIResponse(c).Created(response)
}

// @Summary Update article
// @Description Updates an existing article by ID
// @Tags articles
// @Accept json
// @Produce json
// @Param id path int true "Article ID"
// @Param article body UpdateArticleRequest true "Updated article data"
// @Success 200 {object} ArticleResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden"
// @Failure 404 {object} responses.APIErrorResponse "Article not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles/{id} [put]
func UpdateArticleHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get article ID from URL parameter
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid article ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get existing article from the database
	existingArticle, err := services.GetArticleService().GetArticleByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			responses.NewAPIResponse(c).NotFound("Article not found", responses.ErrCodeResourceNotFound)
			return
		}
		responses.NewAPIResponse(c).InternalServerError("Failed to get article", responses.ErrCodeDatabaseError)
		return
	}

	// Check if the user is the author of the article
	if existingArticle.AuthorID != userID {
		// Check if the user is an admin
		userRole, _ := middleware.GetUserRole(c)
		if userRole != "admin" {
			responses.NewAPIResponse(c).Forbidden("You are not authorized to update this article", responses.ErrCodeForbidden)
			return
		}
	}

	// Parse request body
	var req UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Update article with the new values
	if req.Title != "" {
		existingArticle.Title = req.Title
	}
	if req.Content != "" {
		existingArticle.Content = req.Content
	}
	if req.Category != "" {
		existingArticle.Category = req.Category
	}
	if req.Summary != nil {
		existingArticle.Summary = req.Summary
	}
	if req.Thumbnail != nil {
		existingArticle.Thumbnail = req.Thumbnail
	}
	if req.Status != "" {
		existingArticle.Status = req.Status
	}
	if req.Slug != "" {
		existingArticle.Slug = req.Slug
	}

	// Update the article in the database
	err = services.GetArticleService().UpdateArticle(existingArticle)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update article", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to response format
	updatedAt := existingArticle.UpdatedAt // Create a copy
	response := ArticleResponse{
		ID:          existingArticle.ID,
		Title:       existingArticle.Title,
		Content:     existingArticle.Content,
		Category:    existingArticle.Category,
		Summary:     existingArticle.Summary,
		Thumbnail:   existingArticle.Thumbnail,
		AuthorID:    existingArticle.AuthorID,
		PublishedAt: existingArticle.PublishedAt,
		UpdatedAt:   &updatedAt,
		Status:      existingArticle.Status,
		Slug:        existingArticle.Slug,
	}

	responses.NewAPIResponse(c).OK(response)
}

// @Summary Delete article
// @Description Deletes article by ID
// @Tags articles
// @Param id path int true "Article ID"
// @Success 200 {object} gin.H "Article deleted"
// @Failure 400 {object} responses.APIErrorResponse "Invalid article ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /articles/{id} [delete]
func DeleteArticleHandler(c *gin.Context) {
	// Get article ID from URL parameter
	articleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid article ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Delete article from the database
	err = services.GetArticleService().DeleteArticle(articleID, userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete article", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Article deleted"})
}
