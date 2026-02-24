package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

// LawyerService handles business logic related to lawyers
type LawyerService struct {
	DB *gorm.DB
}

// NewLawyerService creates a new lawyer service
func NewLawyerService() *LawyerService {
	return &LawyerService{
		DB: repository.DB,
	}
}

// GetLawyerByID retrieves a lawyer by their ID
func (s *LawyerService) GetLawyerByID(id int) (*models.Lawyer, error) {
	if id <= 0 {
		return nil, errors.New("invalid lawyer ID")
	}

	var lawyer models.Lawyer
	result := s.DB.Preload("User").First(&lawyer, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("lawyer not found")
		}
		return nil, result.Error
	}

	return &lawyer, nil
}

// GetLawyerByUserID retrieves a lawyer by their user ID
func (s *LawyerService) GetLawyerByUserID(userID int) (*models.Lawyer, error) {
	if userID <= 0 {
		return nil, errors.New("invalid user ID")
	}

	var lawyer models.Lawyer
	result := s.DB.Preload("User").Where("user_id = ?", userID).First(&lawyer)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("lawyer not found")
		}
		return nil, result.Error
	}

	return &lawyer, nil
}

// GetAllLawyers retrieves all lawyers with optional filtering
func (s *LawyerService) GetAllLawyers(filters map[string]interface{}) ([]models.Lawyer, error) {
	var lawyers []models.Lawyer

	query := s.DB

	// Apply filters
	if specialty, ok := filters["specialty"].(string); ok && specialty != "" {
		query = query.Where("? = ANY(specialties)", specialty)
	}

	if barAssociation, ok := filters["bar_association"].(string); ok && barAssociation != "" {
		query = query.Where("bar_association = ?", barAssociation)
	}

	if minExperience, ok := filters["min_experience"].(int); ok && minExperience > 0 {
		query = query.Where("experience_years >= ?", minExperience)
	}

	if language, ok := filters["language"].(string); ok && language != "" {
		query = query.Where("? = ANY(languages)", language)
	}

	result := query.Order("id").Find(&lawyers)

	if result.Error != nil {
		return nil, result.Error
	}

	return lawyers, nil
}

// CreateLawyer creates a new lawyer profile in the system
func (s *LawyerService) CreateLawyer(lawyer *models.Lawyer) error {
	// Check if a lawyer with this user ID already exists
	var existingLawyer models.Lawyer
	if err := s.DB.Where("user_id = ?", lawyer.UserID).First(&existingLawyer).Error; err == nil {
		// A lawyer with this user ID already exists
		return errors.New("a lawyer profile already exists for this user")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Some other error occurred
		return err
	}

	// Ensure specialties and languages are properly handled
	if lawyer.Specialties == nil {
		lawyer.Specialties = models.StringArray{}
	}

	if lawyer.Languages == nil {
		lawyer.Languages = models.StringArray{}
	}

	// Create the lawyer record
	if err := s.DB.Create(lawyer).Error; err != nil {
		return err
	}

	return nil
}

// UpdateLawyer updates an existing lawyer
func (s *LawyerService) UpdateLawyer(lawyerID int, updates map[string]interface{}) error {
	if lawyerID <= 0 {
		return errors.New("invalid lawyer ID")
	}

	// Check if lawyer exists
	var existingLawyer models.Lawyer
	if err := s.DB.First(&existingLawyer, lawyerID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("lawyer not found")
		}
		return err
	}

	// Check if we need to update first_name and last_name fields
	var firstName, lastName string
	var hasFirstName, hasLastName bool
	var userUpdates = make(map[string]interface{})

	// Extract first_name and last_name if they exist
	if firstNameVal, ok := updates["first_name"]; ok && firstNameVal != nil {
		firstName, _ = firstNameVal.(string)
		hasFirstName = true
		userUpdates["first_name"] = firstName
		// Remove from lawyer updates since it doesn't exist in lawyers table
		delete(updates, "first_name")
	}

	if lastNameVal, ok := updates["last_name"]; ok && lastNameVal != nil {
		lastName, _ = lastNameVal.(string)
		hasLastName = true
		userUpdates["last_name"] = lastName
		// Remove from lawyer updates since it doesn't exist in lawyers table
		delete(updates, "last_name")

	}

	// If we have either first_name or last_name, update the full_name field
	// Handle gender update which belongs to the users table, not lawyers table
	if genderVal, ok := updates["gender"]; ok {
		if genderStr, ok2 := genderVal.(string); ok2 {
			if genderStr == "" {
				userUpdates["gender"] = nil
			} else {
				userUpdates["gender"] = genderStr
			}
		} else {
			// fall back to raw value if assertion fails
			userUpdates["gender"] = genderVal
		}
		delete(updates, "gender")
	}

	if hasFirstName || hasLastName {
		// Get current data if needed
		if !hasFirstName || !hasLastName {
			// Only partial name update, need to get current user data
			var user models.User
			if err := s.DB.First(&user, existingLawyer.UserID).Error; err != nil {
				return fmt.Errorf("failed to retrieve user data: %w", err)
			}

			if !hasFirstName && user.FirstName != nil {
				firstName = *user.FirstName
			}

			if !hasLastName && user.LastName != nil {
				lastName = *user.LastName
			}
		}

		// Combine into full_name for the lawyer record (format: LastName FirstName)
		if lastName != "" || firstName != "" {
			fullName := strings.TrimSpace(lastName + " " + firstName)
			updates["full_name"] = fullName
		}
	}

	// Apply any user-level updates (first_name, last_name, gender, etc.)
	if len(userUpdates) > 0 {
		if err := s.DB.Model(&models.User{}).Where("id = ?", existingLawyer.UserID).Updates(userUpdates).Error; err != nil {
			return fmt.Errorf("failed to update user data: %w", err)
		}
	}

	// Handle array types specially for PostgreSQL
	if specialtiesRaw, ok := updates["specialties"]; ok && specialtiesRaw != nil {
		// Convert specialties to StringArray
		specialties := []string{}
		specialtiesJson, _ := json.Marshal(specialtiesRaw)
		json.Unmarshal(specialtiesJson, &specialties)
		updates["specialties"] = models.StringArray(specialties)
	}

	if languagesRaw, ok := updates["languages"]; ok && languagesRaw != nil {
		// Convert languages to StringArray
		languages := []string{}
		languagesJson, _ := json.Marshal(languagesRaw)
		json.Unmarshal(languagesJson, &languages)
		updates["languages"] = models.StringArray(languages)
	}

	// Apply updates to the lawyer model
	result := s.DB.Model(&models.Lawyer{}).Where("id = ?", lawyerID).Updates(updates)
	return result.Error
}
func (s *LawyerService) DeleteLawyer(lawyerID int) error {
	result := s.DB.Delete(&models.Lawyer{}, lawyerID)
	return result.Error
}

// SearchLawyers provides enhanced search functionality with pagination and more filters
func (s *LawyerService) SearchLawyers(filters map[string]interface{}) ([]models.Lawyer, int64, error) {
	var lawyers []models.Lawyer
	var total int64

	// Base query
	query := s.DB.Model(&models.Lawyer{}).Joins("JOIN users ON lawyers.user_id = users.id AND users.is_active = true")

	// Only show verified lawyers in public searches unless explicitly requested
	if _, ok := filters["include_unverified"]; !ok {
		query = query.Where("is_verified = ?", true)
	}

	// Apply filters
	if specialty, ok := filters["specialty"].(string); ok && specialty != "" {
		query = query.Where("? = ANY(specialties)", specialty)
	}

	if barAssociation, ok := filters["bar_association"].(string); ok && barAssociation != "" {
		query = query.Where("bar_association = ?", barAssociation)
	}

	if minExperience, ok := filters["experience"].(string); ok && minExperience != "" {
		if exp, err := strconv.Atoi(minExperience); err == nil && exp > 0 {
			query = query.Where("experience_years >= ?", exp)
		}
	}

	if language, ok := filters["language"].(string); ok && language != "" {
		query = query.Where("? = ANY(languages)", language)
	}

	// Advanced filters
	if name, ok := filters["name"].(string); ok && name != "" {
		query = query.Where(
			"full_name LIKE ? OR lawyers.address ILIKE ?",
			"%"+name+"%", "%"+name+"%",
		)
	}

	if prefecture, ok := filters["prefecture"].(string); ok && prefecture != "" {
		// Get the Japanese name of the prefecture from the map
		prefectureMap := NewUtilService().PrefectureMap()
		japanesePrefecture, exists := prefectureMap[prefecture]
		if exists {
			query = query.Where("lawyers.address ILIKE ?", "%"+japanesePrefecture+"%")
		}
	}

	if minRatingStr, ok := filters["min_rating"].(string); ok && minRatingStr != "" {
		if stars, err := strconv.Atoi(minRatingStr); err == nil {
			// build subquery tính avg_rating
			reviewSubQuery := s.DB.
				Model(&models.Review{}).
				Select("lawyer_id, AVG(rating) as avg_rating").
				Where("approved_status = ?", "approved").
				Where("is_hidden = false").
				Group("lawyer_id")

			// join vào review_stats
			query = query.Joins(
				"LEFT JOIN (?) as review_stats ON review_stats.lawyer_id = lawyers.id",
				reviewSubQuery,
			)

			// lọc theo số sao
			switch stars {
			case 1, 2, 3, 4:
				// 1★以上 = >=1.0, 2★以上 = >=2.0, ...
				query = query.Where(
					"COALESCE(review_stats.avg_rating,0) >= ?", float64(stars),
				)
			case 5:
				// chỉ lấy đúng 5.0 (hoặc >=5.0 là đủ)
				query = query.Where(
					"COALESCE(review_stats.avg_rating,0) = ?", 5.0,
				)
			default:
				// không filter
			}

			query = query.Group("lawyers.id")
		}
	}

	// Count total before pagination
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination
	page := 1
	pageSize := 10

	if pageVal, ok := filters["page"].(int); ok && pageVal > 0 {
		page = pageVal
	}

	if pageSizeVal, ok := filters["page_size"].(int); ok && pageSizeVal > 0 {
		pageSize = pageSizeVal
	}

	offset := (page - 1) * pageSize

	// Execute final query with pagination and ordering
	result := query.Order("id").Offset(offset).Limit(pageSize).Find(&lawyers)

	if result.Error != nil {
		return nil, 0, result.Error
	}

	// Enrich results with additional calculated fields
	for i := range lawyers {
		// Calculate average rating and review count if needed
		if err := s.EnrichLawyerWithReviewStats(&lawyers[i]); err != nil {
			// Log the error but continue processing
			fmt.Printf("Error enriching lawyer with review stats: %v\n", err)
		}
	}

	return lawyers, total, nil
}

// EnrichLawyerWithReviewStats adds review statistics to a lawyer
func (s *LawyerService) EnrichLawyerWithReviewStats(lawyer *models.Lawyer) error {
	// Skip if already populated
	if lawyer.ReviewCount != nil && lawyer.AverageRating != nil {
		return nil
	}

	var count int64
	var avgRating float64

	// Count reviews
	if err := s.DB.Model(&models.Review{}).Where("lawyer_id = ? AND is_hidden = false AND approved_status = ?", lawyer.ID, "approved").Count(&count).Error; err != nil {
		return err
	}

	// Calculate average rating if there are reviews
	if count > 0 {
		var result struct {
			AvgRating float64
		}

		if err := s.DB.Model(&models.Review{}).
			Select("AVG(rating) as avg_rating").
			Where("lawyer_id = ? AND is_hidden = false", lawyer.ID).
			Where("approved_status = ?", "approved").
			Scan(&result).Error; err != nil {
			return err
		}

		avgRating = result.AvgRating
	}

	// Set the values
	countInt := int(count)
	lawyer.ReviewCount = &countInt
	lawyer.AverageRating = &avgRating

	return nil
}

// UpdateLawyerVerificationStatus updates the verification status of a lawyer
// When a lawyer is verified, it sends them an email notification
func (s *LawyerService) UpdateLawyerVerificationStatus(lawyerID uint, isVerified bool) error {
	if lawyerID <= 0 {
		return errors.New("invalid lawyer ID")
	}

	// Check if lawyer exists and preload their data
	var existingLawyer models.Lawyer
	if err := s.DB.First(&existingLawyer, lawyerID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("lawyer not found")
		}
		return err
	}

	// Update the verification status
	result := s.DB.Model(&models.Lawyer{}).Where("id = ?", lawyerID).Update("is_verified", isVerified)
	if result.Error != nil {
		return result.Error
	}

	// If no rows were affected, return an error
	if result.RowsAffected == 0 {
		return errors.New("lawyer verification status update failed: no rows affected")
	}

	// Send email notification if the lawyer is being verified (not when unverified)
	if isVerified {
		// Reload the lawyer with the User relation to get the most up-to-date information
		if err := s.DB.Preload("User").First(&existingLawyer, lawyerID).Error; err != nil {
			// Log the error but don't fail the verification update
			fmt.Printf("Error reloading lawyer for email notification: %v\n", err)
		} else {
			// Send verification success email
			emailService := NewEmailService()
			if err := emailService.SendLawyerVerificationSuccessEmail(existingLawyer); err != nil {
				// Log the error but don't fail the verification update
				fmt.Printf("Error sending verification success email to lawyer: %v\n", err)
			}
		}
	}

	return nil
}

// GetLawyers retrieves lawyers with pagination, filtering, search and sorting
func (s *LawyerService) GetLawyers(page, limit int, search string, sortField string, sortDir string) ([]models.Lawyer, int64, error) {
	var lawyers []models.Lawyer
	var total int64

	// Base query
	query := s.DB.Model(&models.Lawyer{}).Preload("User")

	// Apply search if provided
	if search != "" {
		// Search in multiple fields using ILIKE for case-insensitive search
		query = query.Where(
			"full_name ILIKE ? OR office_name ILIKE ? OR email ILIKE ? OR bar_association ILIKE ? OR bar_number ILIKE ? OR address ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%",
		)
	}

	// Get total count with search applied
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	// Apply pagination
	offset := (page - 1) * limit

	// Define allowed sort fields
	allowedSortFields := map[string]bool{
		"id": true, "full_name": true, "email": true, "office_name": true,
		"bar_association": true, "rating": true, "active": true, "created_at": true,
		"experience_years": true,
	}

	// Get order clause from utility service
	orderClause := utilService.BuildOrderClause(sortField, sortDir, allowedSortFields)

	// Get paginated results with search and sorting applied
	err = query.Order(orderClause).Offset(offset).Limit(limit).Preload("User").Find(&lawyers).Error
	if err != nil {
		return nil, 0, err
	}

	// Enrich results with additional calculated fields
	for i := range lawyers {
		// Calculate average rating and review count if needed
		if err := s.EnrichLawyerWithReviewStats(&lawyers[i]); err != nil {
			// Log the error but continue processing
			fmt.Printf("Error enriching lawyer with review stats: %v\n", err)
		}
	}

	return lawyers, total, nil
}
