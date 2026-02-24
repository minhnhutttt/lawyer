package services

import (
	"errors"
	"github.com/kotolino/lawyer/internal/models"
	"gorm.io/gorm"
)

type QuestionService struct {
	db *gorm.DB
}

func (s *QuestionService) CreateQuestion(question models.Question) (*models.Question, error) {
	if question.UserID == 0 {
		return nil, errors.New("user ID is required")
	}

	if question.Title == "" || question.Content == "" {
		return nil, errors.New("title and content are required")
	}

	// Check if user exists
	var user models.User
	if err := s.db.First(&user, question.UserID).Error; err != nil {
		return nil, errors.New("user not found")
	}

	// Set default status if not provided
	if question.Status == "" {
		question.Status = "open"
	}

	// Create question
	if err := s.db.Create(&question).Error; err != nil {
		return nil, err
	}

	return &question, nil
}

func (s *QuestionService) GetQuestionByID(questionID int) (*models.Question, error) {
	var question models.Question

	// Preload the User relation so the user data is included in the question
	if err := s.db.Preload("User").First(&question, questionID).Error; err != nil {
		return nil, errors.New("question not found")
	}

	return &question, nil
}

func (s *QuestionService) GetUserQuestions(userID int) ([]models.Question, error) {
	var questions []models.Question

	// Check if user exists
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, errors.New("user not found")
	}

	// Get questions
	if err := s.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&questions).Error; err != nil {
		return nil, err
	}

	return questions, nil
}

func (s *QuestionService) UpdateQuestion(questionID, userID int, updatedQuestion models.Question) (*models.Question, error) {
	var question models.Question

	if err := s.db.First(&question, questionID).Error; err != nil {
		return nil, errors.New("question not found")
	}

	// Check if user owns the question
	if question.UserID != userID {
		return nil, errors.New("unauthorized to update this question")
	}

	// Update fields
	if updatedQuestion.Title != "" {
		question.Title = updatedQuestion.Title
	}

	if updatedQuestion.Content != "" {
		question.Content = updatedQuestion.Content
	}

	if updatedQuestion.Status != "" {
		question.Status = updatedQuestion.Status
	}

	// Save changes
	if err := s.db.Save(&question).Error; err != nil {
		return nil, err
	}

	if err := s.db.Preload("User").First(&question, questionID).Error; err != nil {
		return nil, err
	}

	return &question, nil
}

func (s *QuestionService) UpdateQuestionStatus(questionID int, status string) error {
	var question models.Question

	if err := s.db.First(&question, questionID).Error; err != nil {
		return errors.New("question not found")
	}

	// Update status
	question.Status = status

	if err := s.db.Save(&question).Error; err != nil {
		return err
	}

	return nil
}

func (s *QuestionService) DeleteQuestion(questionID, userID int) error {
	var question models.Question

	if err := s.db.First(&question, questionID).Error; err != nil {
		return errors.New("question not found")
	}

	// Check if user owns the question
	if question.UserID != userID {
		return errors.New("unauthorized to delete this question")
	}

	// Delete question
	if err := s.db.Delete(&question).Error; err != nil {
		return err
	}

	return nil
}

func (s *QuestionService) GetQuestionsWithPagination(title, status, isPublic string, page, pageSize int) ([]models.Question, map[int]int64, int64, error) {
	var questions []models.Question
	var total int64

	query := s.db.Model(&models.Question{}).Preload("User")

	if status != "" {
		query = query.Where("status = ?", status)
	}
	if title != "" {
		query = query.Where(
			"title LIKE ? OR content LIKE ?",
			"%"+title+"%",
			"%"+title+"%",
		)
	}
	if isPublic == "true" {
		query = query.Where("is_hidden = ?", false)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, nil, 0, err
	}

	if err := query.Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&questions).Error; err != nil {
		return nil, nil, 0, err
	}

	var counts []struct {
		QuestionID int
		Count      int64
	}
	ids := make([]int, 0, len(questions))
	for _, q := range questions {
		ids = append(ids, q.ID)
	}
	if err := s.db.
		Table("answers").
		Where("question_id IN ?", ids).
		Select("question_id, COUNT(*) as count").
		Group("question_id").
		Scan(&counts).Error; err != nil {
		return nil, nil, 0, err
	}

	answerCountMap := make(map[int]int64)
	for _, c := range counts {
		answerCountMap[c.QuestionID] = c.Count
	}

	return questions, answerCountMap, total, nil
}

func (s *QuestionService) GetUserQuestionsWithPagination(userID int, page, pageSize int) ([]models.Question, int64, error) {
	var questions []models.Question
	var total int64

	// Check if user exists
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return nil, 0, errors.New("user not found")
	}

	query := s.db.Model(&models.Question{}).
		Preload("User").
		Where("is_hidden = ?", false).
		Where("user_id = ?", userID)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated questions
	if err := s.db.Where("user_id = ?", userID).
		Where("is_hidden = ?", false).
		Order("created_at DESC").
		Offset((page - 1) * pageSize).
		Limit(pageSize).
		Find(&questions).Error; err != nil {
		return nil, 0, err
	}

	return questions, total, nil
}

func (s *QuestionService) UpdateQuestionHidden(q *models.Question) error {
	if q.ID <= 0 {
		return errors.New("invalid question ID")
	}

	tx := s.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// ensure it exists
	var existing models.Question
	if err := tx.First(&existing, q.ID).Error; err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("question not found")
		}
		return err
	}

	// only update is_hidden
	if err := tx.Model(&existing).Update("is_hidden", q.IsHidden).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
