package services

import (
	"errors"
	"log"

	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

// ReviewService handles business logic related to reviews
type ReviewService struct {
	DB *gorm.DB
}

// NewReviewService creates a new review service
func NewReviewService() *ReviewService {
	return &ReviewService{
		DB: repository.DB,
	}
}

// GetReviewByID retrieves a review by its ID
func (s *ReviewService) GetReviewByID(id int) (*models.Review, error) {
	if id <= 0 {
		return nil, errors.New("invalid review ID")
	}

	var review models.Review
	result := s.DB.First(&review, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("review not found")
		}
		return nil, result.Error
	}

	return &review, nil
}

// GetReviewsByLawyerID retrieves all reviews for a lawyer
func (s *ReviewService) GetReviewsByLawyerID(lawyerID int) ([]models.Review, error) {
	if lawyerID <= 0 {
		return nil, errors.New("invalid lawyer ID")
	}

	var reviews []models.Review
	result := s.DB.Where("lawyer_id = ?", lawyerID).
		Where("approved_status = ?", "approved").
		Order("created_at DESC").
		Find(&reviews)

	if result.Error != nil {
		return nil, result.Error
	}

	return reviews, nil
}

// GetReviewsByUserID retrieves all reviews by a user
func (s *ReviewService) GetReviewsByUserID(userID int) ([]models.Review, error) {
	if userID <= 0 {
		return nil, errors.New("invalid user ID")
	}

	var reviews []models.Review
	result := s.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&reviews)

	if result.Error != nil {
		return nil, result.Error
	}

	return reviews, nil
}

// GetReviews retrieves reviews with pagination, search, filtering and sorting
func (s *ReviewService) GetReviews(page, limit int, search string, status string, lawyerID, userID *int, sortField string, sortDir string) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	// Base query
	query := s.DB.Model(&models.Review{})

	// Always join the related tables for sorting and filtering
	query = query.Joins("LEFT JOIN users ON reviews.user_id = users.id")
	query = query.Joins("LEFT JOIN lawyers ON reviews.lawyer_id = lawyers.id")

	// Apply status filter if provided
	if status != "" && status != "all" {
		query = query.Where("reviews.approved_status = ?", status)
	}

	// Apply lawyer filter if provided
	if lawyerID != nil {
		query = query.Where("reviews.lawyer_id = ?", *lawyerID)
	}

	// Apply user filter if provided
	if userID != nil {
		query = query.Where("reviews.user_id = ?", *userID)
	}

	// Apply search if provided
	if search != "" {
		// Search in related tables and comments
		query = query.Where(
			"users.first_name ILIKE ? OR users.last_name ILIKE ? OR lawyers.full_name ILIKE ? OR reviews.comment ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%",
		)
	}

	// Count total with filters and search applied
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit

	// Define allowed sort fields with their column paths
	// Define allowed sort fields
	allowedSortFields := map[string]bool{
		"id": true, "rating": true, "created_at": true, "updated_at": true,
		"approved_status": true, "users.name": true, "lawyers.full_name": true,
	}

	// Get order clause from utility service
	orderClause := utilService.BuildOrderClause(sortField, sortDir, allowedSortFields)

	// Make sure we select the Review model fields to avoid column ambiguity
	query = query.Select("reviews.*")

	// Get paginated results with all filters, search, and sorting applied
	err = query.
		Preload("User").
		Preload("Lawyer").
		Order("is_pin DESC").
		Order(orderClause).
		Offset(offset).
		Limit(limit).
		Find(&reviews).Error
	if err != nil {
		return nil, 0, err
	}

	return reviews, total, nil
}

// GetAllReviews returns all reviews
func (s *ReviewService) GetAllReviews() ([]models.Review, error) {
	var reviews []models.Review

	result := s.DB.
		Preload("User").
		Preload("Lawyer").
		Find(&reviews)
	if result.Error != nil {
		return nil, result.Error
	}

	return reviews, nil
}

// CreateReview creates a new review
func (s *ReviewService) CreateReview(review *models.Review) error {
	// Begin a transaction
	tx := s.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Create the review
	if err := tx.Create(review).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}

// UpdateReview updates an existing review
func (s *ReviewService) UpdateReview(review *models.Review) error {
	if review.ID <= 0 {
		return errors.New("invalid review ID")
	}

	// Begin a transaction
	tx := s.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Check if review exists
	var existingReview models.Review
	if err := tx.First(&existingReview, review.ID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("review not found")
		}
		return err
	}

	// Update the review
	updateData := map[string]interface{}{
		"rating":          review.Rating,
		"comment":         review.Comment,
		"approved_status": "pending",
	}
	if err := tx.Model(&review).Updates(updateData).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update the lawyer's rating
	if err := s.updateLawyerRating(review.LawyerID); err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}

// DeleteReview deletes a review
func (s *ReviewService) DeleteReview(reviewID int) error {
	if reviewID <= 0 {
		return errors.New("invalid review ID")
	}

	// Get the review to find the lawyer ID
	var review models.Review
	if err := s.DB.First(&review, reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("review not found")
		}
		return err
	}

	// Begin a transaction
	tx := s.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Delete the review
	if err := tx.Delete(&models.Review{}, reviewID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Update the lawyer's rating
	if err := s.updateLawyerRating(review.LawyerID); err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}

// updateLawyerRating updates a lawyer's rating based on all reviews
func (s *ReviewService) updateLawyerRating(lawyerID int) error {
	// Calculate the average rating
	type Result struct {
		AvgRating float64
		Count     int64
	}
	var result Result

	if err := s.DB.Model(&models.Review{}).
		Select("AVG(rating) as avg_rating, COUNT(*) as count").
		Where("lawyer_id = ? AND approved_status = ?", lawyerID, "approved").
		Scan(&result).Error; err != nil {
		return err
	}

	// Round to the nearest integer
	rating := int(result.AvgRating + 0.5)

	// Update the lawyer's rating
	return s.DB.Model(&models.Lawyer{}).
		Where("id = ?", lawyerID).
		Updates(map[string]interface{}{
			"rating": rating,
		}).Error
}

// UpdateReviewStatus updates a review's approval status
func (s *ReviewService) UpdateReviewStatus(review *models.Review) error {
	if review.ID <= 0 {
		return errors.New("invalid review ID")
	}

	// Begin a transaction
	tx := s.DB.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// Check if review exists
	var existingReview models.Review
	if err := tx.First(&existingReview, review.ID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("review not found")
		}
		return err
	}

	// Update the review status
	updateData := map[string]interface{}{
		"approved_status": review.ApprovedStatus,
		"is_hidden":       review.IsHidden,
		"hidden_reason":   review.HiddenReason,
	}

	if err := tx.Model(&review).Updates(updateData).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := s.updateLawyerRating(review.LawyerID); err != nil {
		tx.Rollback()
		return err
	}

	// Commit the transaction
	return tx.Commit().Error
}

func (s *ReviewService) PinReview(id int, isPin bool) (*models.Review, error) {
	if id <= 0 {
		return nil, errors.New("invalid review ID")
	}

	// find existing
	var review models.Review
	if err := s.DB.First(&review, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("review not found")
		}
		return nil, err
	}

	if isPin {
		var pinnedCount int64
		if err := s.DB.
			Model(&models.Review{}).
			Where("is_pin = ? AND approved_status = ?", true, "approved").
			Count(&pinnedCount).Error; err != nil {
			return nil, err
		}
		if pinnedCount >= 3 {
			return nil, errors.New("cannot pin more than 3 reviews")
		}
		review.IsPin = true
	} else {
		review.IsPin = false
	}
	if err := s.DB.Save(&review).Error; err != nil {
		return nil, err
	}
	return &review, nil
}

func (s *ReviewService) GetPinnedReviews() ([]models.Review, error) {
	var reviews []models.Review
	err := s.DB.
		Where("is_pin = ?", true).
		Where("approved_status = ?", "approved").
		Order("updated_at DESC").
		Preload("User").
		Preload("Lawyer").
		Preload("Lawyer.User").
		Find(&reviews).
		Error

	if err != nil {
		return nil, err
	}

	// Enrich lawyers with review stats
	if len(reviews) > 0 {
		lawyerSvc := NewLawyerService()
		for i := range reviews {
			// Check if Lawyer is not nil and has a valid ID
			if reviews[i].Lawyer.ID > 0 {
				// Pass a pointer to the Lawyer object
				err := lawyerSvc.EnrichLawyerWithReviewStats(&reviews[i].Lawyer)
				if err != nil {
					// Just log the error instead of failing the entire request
					log.Printf("Error enriching lawyer with review stats: %v", err)
				}
			}
		}
	}

	return reviews, nil
}
