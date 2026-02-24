package services

import (
	"errors"
	"fmt"

	"github.com/kotolino/lawyer/internal/models"
	"gorm.io/gorm"
)

// AnswerService handles business logic for answer related functionality
type AnswerService struct {
	db *gorm.DB
}

// CreateAnswer creates a new answer to a question
func (s *AnswerService) CreateAnswer(answer models.Answer) (*models.Answer, error) {
	if answer.QuestionID == 0 || answer.LawyerID == 0 {
		return nil, errors.New("question ID and lawyer ID are required")
	}

	if answer.Content == "" {
		return nil, errors.New("content is required")
	}

	// Check if question exists
	var question models.Question
	if err := s.db.Preload("User").First(&question, answer.QuestionID).Error; err != nil {
		return nil, errors.New("question not found")
	}

	// Check if lawyer exists
	var lawyer models.Lawyer
	if err := s.db.Preload("User").First(&lawyer, answer.LawyerID).Error; err != nil {
		return nil, errors.New("lawyer not found")
	}

	// Create answer
	if err := s.db.Create(&answer).Error; err != nil {
		return nil, err
	}

	// If the question was open, mark it as answered
	if question.Status == "open" {
		question.Status = "answered"
		if err := s.db.Save(&question).Error; err != nil {
			return nil, err
		}
	}

	if err := s.db.Preload("Lawyer.User").First(&answer, answer.ID).Error; err != nil {
		return nil, err
	}

	// Send email notification to the question author
	go s.SendNewAnswerNotification(question, lawyer, answer)

	return &answer, nil
}

// GetAnswersByQuestion gets all answers for a specific question
func (s *AnswerService) GetAnswersByQuestion(questionID int) ([]models.Answer, error) {
	var answers []models.Answer

	// Check if question exists
	var question models.Question
	if err := s.db.First(&question, questionID).Error; err != nil {
		return nil, errors.New("question not found")
	}

	// Get answers
	if err := s.db.Where("question_id = ?", questionID).
		Order("created_at ASC").
		Find(&answers).Error; err != nil {
		return nil, err
	}

	return answers, nil
}

// GetAnswerByID gets an answer by ID
func (s *AnswerService) GetAnswerByID(answerID int) (*models.Answer, error) {
	var answer models.Answer

	if err := s.db.First(&answer, answerID).Error; err != nil {
		return nil, errors.New("answer not found")
	}

	return &answer, nil
}

// GetLawyerAnswers gets all answers by a specific lawyer
func (s *AnswerService) GetLawyerAnswers(lawyerID int) ([]models.Answer, error) {
	var answers []models.Answer

	// Check if lawyer exists
	var lawyer models.Lawyer
	if err := s.db.First(&lawyer, lawyerID).Error; err != nil {
		return nil, errors.New("lawyer not found")
	}

	// Get answers
	if err := s.db.Where("lawyer_id = ?", lawyerID).
		Order("created_at DESC").
		Find(&answers).Error; err != nil {
		return nil, err
	}

	return answers, nil
}

// UpdateAnswer updates an answer
func (s *AnswerService) UpdateAnswer(answerID, lawyerID int, updatedAnswer models.Answer) (*models.Answer, error) {
	var answer models.Answer

	if err := s.db.First(&answer, answerID).Error; err != nil {
		return nil, errors.New("answer not found")
	}

	// Check if lawyer owns the answer
	if answer.LawyerID != lawyerID {
		return nil, errors.New("unauthorized to update this answer")
	}

	// Update content
	if updatedAnswer.Content != "" {
		answer.Content = updatedAnswer.Content
	}

	// Save changes
	if err := s.db.Save(&answer).Error; err != nil {
		return nil, err
	}
	if err := s.db.Preload("Lawyer.User").First(&answer, answer.ID).Error; err != nil {
		return nil, err
	}

	return &answer, nil
}

// AcceptAnswer marks an answer as accepted
func (s *AnswerService) AcceptAnswer(answerID, userID int) error {
	var answer models.Answer

	// Find the answer
	if err := s.db.First(&answer, answerID).Error; err != nil {
		return errors.New("answer not found")
	}

	// Get the question to verify the user owns it
	var question models.Question
	if err := s.db.First(&question, answer.QuestionID).Error; err != nil {
		return errors.New("question not found")
	}

	// Check if user owns the question
	if question.UserID != userID {
		return errors.New("unauthorized to accept this answer")
	}

	// Mark answer as accepted
	answer.IsAccepted = true

	// Update question status
	question.Status = "resolved"

	// Start a transaction
	tx := s.db.Begin()

	if err := tx.Save(&answer).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Save(&question).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return err
	}

	return nil
}

// DeleteAnswer deletes an answer
func (s *AnswerService) DeleteAnswer(answerID, lawyerID int) error {
	var answer models.Answer

	if err := s.db.First(&answer, answerID).Error; err != nil {
		return errors.New("answer not found")
	}

	// Check if lawyer owns the answer
	if answer.LawyerID != lawyerID {
		return errors.New("unauthorized to delete this answer")
	}

	// Delete answer
	if err := s.db.Delete(&answer).Error; err != nil {
		return err
	}

	return nil
}

// GetAnswersByQuestionWithPagination gets paginated answers for a specific question
func (s *AnswerService) GetAnswersByQuestionWithPagination(questionID int, page, pageSize int) ([]models.Answer, int64, error) {
	var answers []models.Answer
	var total int64

	// Check if question exists
	var question models.Question
	if err := s.db.First(&question, questionID).Error; err != nil {
		return nil, 0, errors.New("question not found")
	}

	// Get total count
	if err := s.db.Model(&models.Answer{}).Where("question_id = ?", questionID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated answers with the Lawyer object preloaded
	if err := s.db.Where("question_id = ?", questionID).
		Preload("Lawyer.User"). // This preloads the Lawyer relation for each answer
		Order("created_at ASC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&answers).Error; err != nil {
		return nil, 0, err
	}

	return answers, total, nil
}

// GetLawyerAnswersWithPagination gets paginated answers by a specific lawyer
func (s *AnswerService) GetLawyerAnswersWithPagination(lawyerID int, page, pageSize int) ([]models.Answer, int64, error) {
	var answers []models.Answer

	var total int64
	// Check if lawyer exists
	var lawyer models.Lawyer
	if err := s.db.First(&lawyer, lawyerID).Error; err != nil {
		return nil, 0, errors.New("lawyer not found")
	}

	// Get total count
	if err := s.db.Model(&models.Answer{}).Where("lawyer_id = ?", lawyerID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated answers
	if err := s.db.Where("lawyer_id = ?", lawyerID).
		Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&answers).Error; err != nil {
		return nil, 0, err
	}

	return answers, total, nil
}

// SendNewAnswerNotification sends an email notification to the question author when a lawyer answers their question
func (s *AnswerService) SendNewAnswerNotification(question models.Question, lawyer models.Lawyer, answer models.Answer) {

	// Get the email service
	emailService := NewEmailService()

	// Send notification email
	err := emailService.SendNewAnswerNotificationEmail(question.User, lawyer, question, answer.ID)
	if err != nil {
		// Just log the error, don't fail the whole process
		fmt.Printf("Error sending new answer notification email: %v\n", err)
	}
}
