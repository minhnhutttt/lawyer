package services

import (
	"errors"

	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

// NotificationService handles business logic related to notifications
type NotificationService struct {
	DB *gorm.DB
}

// NewNotificationService creates a new notification service
func NewNotificationService() *NotificationService {
	return &NotificationService{
		DB: repository.DB,
	}
}

// GetNotificationByID retrieves a notification by its ID
func (s *NotificationService) GetNotificationByID(id int) (*models.Notification, error) {
	if id <= 0 {
		return nil, errors.New("invalid notification ID")
	}

	var notification models.Notification
	result := s.DB.First(&notification, id)
	
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("notification not found")
		}
		return nil, result.Error
	}

	return &notification, nil
}

// GetNotificationsByUserID retrieves all notifications for a user
func (s *NotificationService) GetNotificationsByUserID(userID int, limit, offset int) ([]models.Notification, error) {
	if userID <= 0 {
		return nil, errors.New("invalid user ID")
	}

	if limit <= 0 {
		limit = 10 // Default limit
	}

	if offset < 0 {
		offset = 0
	}

	var notifications []models.Notification
	result := s.DB.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications)
	
	if result.Error != nil {
		return nil, result.Error
	}

	return notifications, nil
}

// GetUnreadNotificationCount returns the count of unread notifications for a user
func (s *NotificationService) GetUnreadNotificationCount(userID int) (int, error) {
	if userID <= 0 {
		return 0, errors.New("invalid user ID")
	}

	var count int64
	result := s.DB.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Count(&count)
	
	if result.Error != nil {
		return 0, result.Error
	}

	return int(count), nil
}

// CreateNotification creates a new notification
func (s *NotificationService) CreateNotification(notification *models.Notification) error {
	// IsRead will default to false based on the GORM model tags
	result := s.DB.Create(notification)
	return result.Error
}

// MarkNotificationAsRead marks a notification as read
func (s *NotificationService) MarkNotificationAsRead(notificationID int) error {
	if notificationID <= 0 {
		return errors.New("invalid notification ID")
	}

	result := s.DB.Model(&models.Notification{}).
		Where("id = ?", notificationID).
		Update("is_read", true)
	
	return result.Error
}

// MarkAllNotificationsAsRead marks all notifications for a user as read
func (s *NotificationService) MarkAllNotificationsAsRead(userID int) error {
	if userID <= 0 {
		return errors.New("invalid user ID")
	}

	result := s.DB.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Update("is_read", true)
	
	return result.Error
}

// DeleteNotification deletes a notification
func (s *NotificationService) DeleteNotification(notificationID int) error {
	if notificationID <= 0 {
		return errors.New("invalid notification ID")
	}

	result := s.DB.Delete(&models.Notification{}, notificationID)
	return result.Error
}

// DeleteAllNotifications deletes all notifications for a user
func (s *NotificationService) DeleteAllNotifications(userID int) error {
	if userID <= 0 {
		return errors.New("invalid user ID")
	}

	result := s.DB.Where("user_id = ?", userID).Delete(&models.Notification{})
	return result.Error
}

// GetNotificationsCount returns the total count of notifications for a user
func (s *NotificationService) GetNotificationsCount(userID int) (int, error) {
	if userID <= 0 {
		return 0, errors.New("invalid user ID")
	}

	var count int64
	result := s.DB.Model(&models.Notification{}).
		Where("user_id = ?", userID).
		Count(&count)
	
	if result.Error != nil {
		return 0, result.Error
	}

	return int(count), nil
}
