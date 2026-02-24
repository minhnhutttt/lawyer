package services

import (
	"errors"
	"time"

	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

// ArticleService handles business logic related to articles
type ArticleService struct {
	DB *gorm.DB
}

// NewArticleService creates a new article service
func NewArticleService() *ArticleService {
	return &ArticleService{
		DB: repository.DB,
	}
}

// GetArticleService returns the article service singleton
func GetArticleService() *ArticleService {
	return &ArticleService{
		DB: repository.DB,
	}
}

// GetArticleByID retrieves an article by its ID
func (s *ArticleService) GetArticleByID(id int) (*models.Article, error) {
	if id <= 0 {
		return nil, errors.New("invalid article ID")
	}

	var article models.Article
	result := s.DB.First(&article, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("article not found")
		}
		return nil, result.Error
	}

	return &article, nil
}

// GetArticlesByAuthorID retrieves all articles by an author
func (s *ArticleService) GetArticlesByAuthorID(authorID int) ([]models.Article, error) {
	if authorID <= 0 {
		return nil, errors.New("invalid author ID")
	}

	var articles []models.Article
	result := s.DB.Where("author_id = ?", authorID).
		Order("created_at DESC").
		Find(&articles)

	if result.Error != nil {
		return nil, result.Error
	}

	return articles, nil
}

// GetArticles retrieves articles with optional filtering by category and status
func (s *ArticleService) GetArticles(category, status, title string) ([]models.Article, error) {
	query := s.DB.Model(&models.Article{})

	if category != "" {
		query = query.Where("category = ?", category)
	}

	if title != "" {
		query = query.Where(
			"title LIKE ? OR content LIKE ?",
			"%"+title+"%",
			"%"+title+"%",
		)
	}

	if status != "" {
		query = query.Where("status = ?", status)
	}

	var articles []models.Article
	result := query.Order("created_at DESC").Find(&articles)

	if result.Error != nil {
		return nil, result.Error
	}

	return articles, nil
}

// GetArticleBySlug retrieves an article by its slug
func (s *ArticleService) GetArticleBySlug(slug string) (*models.Article, error) {
	if slug == "" {
		return nil, errors.New("invalid slug")
	}

	var article models.Article
	result := s.DB.Preload("Author").Where("slug = ?", slug).First(&article)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("article not found")
		}
		return nil, result.Error
	}

	return &article, nil
}

// GetPublishedArticles retrieves all published articles
func (s *ArticleService) GetPublishedArticles() ([]models.Article, error) {
	var articles []models.Article
	result := s.DB.Where("status = ?", "published").
		Order("published_at DESC").
		Find(&articles)

	if result.Error != nil {
		return nil, result.Error
	}

	return articles, nil
}

// CreateArticle creates a new article
func (s *ArticleService) CreateArticle(article *models.Article) (int, error) {
	// Set default values if not provided
	if article.Status == "" {
		article.Status = "draft"
	}

	// Set published_at to now if the status is "published"
	if article.Status == "published" && article.PublishedAt.IsZero() {
		article.PublishedAt = time.Now()
	}

	result := s.DB.Create(article)
	if result.Error != nil {
		return 0, result.Error
	}

	return article.ID, nil
}

// UpdateArticle updates an existing article
func (s *ArticleService) UpdateArticle(article *models.Article) error {
	if article.ID <= 0 {
		return errors.New("invalid article ID")
	}

	// Check if article exists
	var existingArticle models.Article
	if err := s.DB.First(&existingArticle, article.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("article not found")
		}
		return err
	}

	// Update published_at if status changed to published
	if article.Status == "published" && existingArticle.Status != "published" {
		article.PublishedAt = time.Now()
	}

	// Update the article
	updateData := map[string]interface{}{
		"title":        article.Title,
		"content":      article.Content,
		"category":     article.Category,
		"summary":      article.Summary,
		"thumbnail":    article.Thumbnail,
		"status":       article.Status,
		"slug":         article.Slug,
		"published_at": article.PublishedAt,
	}

	result := s.DB.Model(article).Updates(updateData)
	return result.Error
}

// DeleteArticle deletes an article
func (s *ArticleService) DeleteArticle(articleID, authorID int) error {
	if articleID <= 0 {
		return errors.New("invalid article ID")
	}

	// Check if article exists and belongs to the author
	var article models.Article
	if err := s.DB.Where("id = ? AND author_id = ?", articleID, authorID).First(&article).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("article not found or you don't have permission to delete it")
		}
		return err
	}

	// Delete the article
	result := s.DB.Delete(&article)
	return result.Error
}
