package services

import (
	"errors"
	"fmt"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

// UserService handles business logic related to users
type UserService struct {
	DB *gorm.DB
}

// NewUserService creates a new user service
func NewUserService() *UserService {
	return &UserService{
		DB: repository.DB,
	}
}

// GetUserByID retrieves a user by their ID
func (s *UserService) GetUserByID(id int) (*models.User, error) {
	if id <= 0 {
		return nil, errors.New("invalid user ID")
	}

	var user models.User
	result := s.DB.First(&user, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByEmail retrieves a user by their email
func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	if email == "" {
		return nil, errors.New("email is required")
	}

	var user models.User
	result := s.DB.Where("email = ?", email).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, result.Error
	}

	return &user, nil
}

// GetUserByVerificationToken retrieves a user by their verification token
func (s *UserService) GetUserByVerificationToken(token string) (*models.User, error) {
	if token == "" {
		return nil, errors.New("verification token is required")
	}

	var user models.User
	result := s.DB.Where("verification_token = ?", token).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid verification token")
		}
		return nil, result.Error
	}

	return &user, nil
}

// GetAllUsers retrieves all users
func (s *UserService) GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := s.DB.Order("id").Find(&users)

	if result.Error != nil {
		return nil, result.Error
	}

	return users, nil
}

// GetUsers retrieves users with pagination, search and sorting
func (s *UserService) GetUsers(page, limit int, search string, sortField string, sortDir string) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	// Base query
	query := s.DB.Model(&models.User{})

	// Apply search if provided
	if search != "" {
		// Search in multiple fields using ILIKE for case-insensitive search
		query = query.Where(
			"email ILIKE ? OR first_name ILIKE ? OR last_name ILIKE ? OR address ILIKE ?",
			"%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%",
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
		"id": true, "email": true, "first_name": true,
		"last_name": true, "role": true, "created_at": true, "updated_at": true,
	}

	// Get order clause from utility service
	orderClause := utilService.BuildOrderClause(sortField, sortDir, allowedSortFields)

	// Get paginated results with search and sorting applied
	err = query.Order(orderClause).Offset(offset).Limit(limit).Find(&users).Error
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

// UpdateUser updates an existing user and, if they’re a lawyer, syncs their address.
func (s *UserService) UpdateUser(userID int, updates map[string]interface{}) error {
	if userID <= 0 {
		return errors.New("invalid user ID")
	}

	var existingUser models.User
	if err := s.DB.First(&existingUser, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	if raw, ok := updates["birth_date"]; ok {
		str := raw.(string)
		if str == "" {
			updates["birth_date"] = nil
		}
	}

	if err := s.DB.Model(&models.User{}).
		Where("id = ?", userID).
		Updates(updates).Error; err != nil {
		return err
	}

	var updatedUser models.User
	if err := s.DB.First(&updatedUser, userID).Error; err != nil {
		return err
	}
	country, prefecture, city, addr := "", "", "", ""
	if updatedUser.Country != nil {
		country = *updatedUser.Country
	}
	if updatedUser.Prefecture != nil {
		prefecture = *updatedUser.Prefecture
	}
	if updatedUser.City != nil {
		city = *updatedUser.City
	}
	if updatedUser.Address != nil {
		addr = *updatedUser.Address
	}
	fullAddress := country + " " + prefecture + " " + city + " " + addr

	var lawyer models.Lawyer
	err := s.DB.Where("user_id = ?", userID).First(&lawyer).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil
		}
		return err
	}

	lawyer.Address = fullAddress
	if err := s.DB.Save(&lawyer).Error; err != nil {
		return err
	}

	return nil
}

// UpdatePassword updates a user's password with current password validation
func (s *UserService) UpdatePassword(userID int, currentPassword, newPassword string, adminOverride bool) error {
	// Get the user
	var user models.User
	result := s.DB.First(&user, userID)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return result.Error
	}

	// If not admin override, validate current password
	if !adminOverride {
		// Compare passwords using the utility service
		if err := utilService.ComparePassword(user.Password, currentPassword); err != nil {
			return errors.New("current password is incorrect")
		}
	}

	// Hash the new password using the utility service
	hashedPassword, err := utilService.HashPassword(newPassword)
	if err != nil {
		return err
	}

	// Update the password
	result = s.DB.Model(&models.User{}).Where("id = ?", userID).Update("password", hashedPassword)
	return result.Error
}

// UpdateUserStatus updates a user's active status
func (s *UserService) UpdateUserStatus(userID int, isActive bool) error {
	result := s.DB.Model(&models.User{}).Where("id = ?", userID).Update("is_active", isActive)
	return result.Error
}

// SendAccountStatusNotificationEmail sends an email notification when a user account is locked or unlocked
func (s *UserService) SendAccountStatusNotificationEmail(userID int, isLocked bool) error {
	// Run in goroutine to avoid blocking the API response
	go func() {
		// Get the user information
		var user models.User
		result := s.DB.First(&user, userID)
		if result.Error != nil {
			fmt.Printf("Error fetching user for account status notification: %v\n", result.Error)
			return
		}
		
		// Create email service and send notification
		emailService := NewEmailService()
		err := emailService.SendAccountStatusNotificationEmail(user, isLocked)
		if err != nil {
			fmt.Printf("Error sending account status notification email: %v\n", err)
		}
	}()
	
	return nil
}

// DeleteUser deletes a user
func (s *UserService) DeleteUser(userID int) error {
	result := s.DB.Delete(&models.User{}, userID)
	return result.Error
}

func (s *UserService) CreateUser(user *models.User) error {
	// hash pw
	hashed, err := utilService.HashPassword(user.Password)
	if err != nil {
		return err
	}
	user.Password = hashed

	// GORM handles CreatedAt/UpdatedAt automatically
	return s.DB.Create(user).Error
}

func (s *UserService) GetUserByResetPasswordToken(token string) (*models.User, error) {
	var user models.User
	if err := repository.DB.
		Where("reset_password_token = ?", token).
		First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// CheckEmailExistsIncludingDeleted checks if an email exists including soft-deleted users
func (s *UserService) CheckEmailExistsIncludingDeleted(email string) (bool, error) {
	if email == "" {
		return false, errors.New("email is required")
	}

	var count int64
	// Use Unscoped to include soft-deleted records in the query
	result := s.DB.Unscoped().Model(&models.User{}).
		Where("email = ?", email).
		Count(&count)

	if result.Error != nil {
		return false, result.Error
	}

	return count > 0, nil
}
