package services

import (
	"errors"
	"time"

	"github.com/kotolino/lawyer/internal/models"
	"gorm.io/gorm"
)

// ChatService handles business logic for chat related functionality
type ChatService struct {
	db *gorm.DB
}

// NewChatMessage creates a new chat message
func (s *ChatService) NewChatMessage(message models.ChatMessage) (*models.ChatMessage, error) {
	if message.SenderID == 0 || message.ReceiverID == 0 || message.AppointmentID == 0 {
		return nil, errors.New("sender, receiver and appointment IDs are required")
	}

	if message.Content == "" {
		return nil, errors.New("message content is required")
	}

	// Check if appointment exists
	var appointment models.Appointment
	if err := s.db.First(&appointment, message.AppointmentID).Error; err != nil {
		return nil, errors.New("appointment not found")
	}

	// Check if sender and receiver exist
	var sender models.User
	if err := s.db.First(&sender, message.SenderID).Error; err != nil {
		return nil, errors.New("sender not found")
	}
	var receiver models.User
	if err := s.db.First(&receiver, message.ReceiverID).Error; err != nil {
		return nil, errors.New("receiver not found")
	}

	// Create message
	if err := s.db.Create(&message).Error; err != nil {
		return nil, err
	}

	return &message, nil
}

// GetMessagesByAppointment gets all chat messages for an appointment
func (s *ChatService) GetMessagesByAppointment(appointmentID, userID int) ([]models.ChatMessage, error) {
	var messages []models.ChatMessage

	// Check if appointment exists and user has access
	var appointment models.Appointment
	if err := s.db.Preload("Lawyer").First(&appointment, appointmentID).Error; err != nil {
		return nil, errors.New("appointment not found")
	}

	if appointment.UserID != userID && appointment.Lawyer.UserID != userID {
		return nil, errors.New("unauthorized to access these messages")
	}

	// Get messages
	if err := s.db.
		Where("appointment_id = ?", appointmentID).
		Preload("Attachment", func(db *gorm.DB) *gorm.DB {
			// bring back id + file metadata
			return db.Select("id", "file_path", "file_name", "file_size", "attachmentable_type", "attachmentable_id")
		}).
		Order("created_at ASC").
		Find(&messages).Error; err != nil {
		return nil, err
	}

	return messages, nil
}

// MarkMessageAsRead marks a message as read
func (s *ChatService) MarkMessageAsRead(messageID, userID int) error {
	var message models.ChatMessage

	if err := s.db.First(&message, messageID).Error; err != nil {
		return errors.New("message not found")
	}

	// Only receiver can mark a message as read
	if message.ReceiverID != userID {
		return errors.New("unauthorized to mark this message as read")
	}

	message.Read = true
	message.UpdatedAt = time.Now()

	if err := s.db.Save(&message).Error; err != nil {
		return err
	}

	return nil
}

// DeleteMessage deletes a chat message
func (s *ChatService) DeleteMessage(messageID, userID int) error {
	var message models.ChatMessage

	if err := s.db.First(&message, messageID).Error; err != nil {
		return errors.New("message not found")
	}

	// Only sender can delete their message
	if message.SenderID != userID {
		return errors.New("unauthorized to delete this message")
	}

	if err := s.db.Delete(&message).Error; err != nil {
		return err
	}

	return nil
}

// GetUnreadMessageCount gets the count of unread messages for a user
func (s *ChatService) GetUnreadMessageCount(userID int) (int64, error) {
	var count int64

	if err := s.db.Model(&models.ChatMessage{}).
		Where("receiver_id = ? AND read = ?", userID, false).
		Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

// SaveAttachment saves an Attachment record
func (s *ChatService) SaveAttachment(att models.Attachment) (*models.Attachment, error) {
	if att.AttachmentableType == "" || att.AttachmentableID == 0 {
		return nil, errors.New("attachmentable_type and attachmentable_id are required")
	}
	if att.UploadedBy == 0 {
		return nil, errors.New("uploaded_by is required")
	}
	if err := s.db.Create(&att).Error; err != nil {
		return nil, err
	}
	return &att, nil
}

// LinkAttachmentToMessage sets the ChatMessageID on an Attachment
func (s *ChatService) LinkAttachmentToMessage(attachmentID, messageID int) error {
	// polymorph that bad boy into ChatMessage
	return s.db.Model(&models.Attachment{}).
		Where("id = ?", attachmentID).
		Updates(map[string]interface{}{
			"attachmentable_type": "ChatMessage",
			"attachmentable_id":   messageID,
		}).Error
}

func (s *ChatService) GetChatMessageByID(id int) (*models.ChatMessage, error) {
	var msg models.ChatMessage
	if err := s.db.First(&msg, id).Error; err != nil {
		return nil, err
	}
	return &msg, nil
}
