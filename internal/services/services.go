package services

import (
	"github.com/kotolino/lawyer/config"
	"github.com/kotolino/lawyer/internal/repository"
)

var (
	appConfig         *config.Config
	chatService       *ChatService
	questionService   *QuestionService
	userService       *UserService
	answerService     *AnswerService
	attachmentService *AttachmentService
	emailService      *EmailService
	utilService       *UtilService
	supportService    *SupportService
)

// InitServices initializes all services with the provided configuration
func InitServices(cfg *config.Config) {
	appConfig = cfg

	// Initialize new services
	chatService = &ChatService{
		db: repository.GetDB(),
	}

	questionService = &QuestionService{
		db: repository.GetDB(),
	}

	userService = &UserService{
		DB: repository.GetDB(),
	}

	answerService = &AnswerService{
		db: repository.GetDB(),
	}

	attachmentService = &AttachmentService{
		db:     repository.GetDB(),
		config: cfg,
	}

	// Initialize email service if email configuration is provided
	if cfg.Email != nil {
		emailService = &EmailService{
			Config: cfg.Email,
		}
	} else {
		// Initialize with empty config to avoid nil pointers
		emailService = &EmailService{
			Config: &config.EmailConfig{},
		}
	}

	utilService = NewUtilService()
	
	// Initialize support service
	supportService = NewSupportService()
}

// GetConfig returns the application configuration
func GetConfig() *config.Config {
	return appConfig
}

// GetChatService returns the chat service instance
func GetChatService() *ChatService {
	return chatService
}

// GetQuestionService returns the question service instance
func GetQuestionService() *QuestionService {
	return questionService
}

// GetUserService returns the user service instance
func GetUserService() *UserService {
	return userService
}

// GetAnswerService returns the answer service instance
func GetAnswerService() *AnswerService {
	return answerService
}

// GetAttachmentService returns the attachment service instance
func GetAttachmentService() *AttachmentService {
	return attachmentService
}

// GetEmailService returns the email service instance
func GetEmailService() *EmailService {
	return emailService
}

// GetSupportService returns the support service instance
func GetSupportService() *SupportService {
	return supportService
}
