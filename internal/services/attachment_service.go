package services

import (
	"errors"
	"github.com/kotolino/lawyer/config"
	"github.com/kotolino/lawyer/internal/models"
	"gorm.io/gorm"
)

// AttachmentService handles business logic for file attachment related functionality
type AttachmentService struct {
	db     *gorm.DB
	config *config.Config
}

// GetAttachment gets an attachment by ID
func (s *AttachmentService) GetAttachment(attachmentID int) (*models.Attachment, error) {
	var attachment models.Attachment

	if err := s.db.First(&attachment, attachmentID).Error; err != nil {
		return nil, errors.New("attachment not found")
	}

	return &attachment, nil
}
