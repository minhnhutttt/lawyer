package services

import (
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
	"time"
)

// AdminService handles admin‐level queries
type AdminService struct {
	DB *gorm.DB
}

func NewAdminService() *AdminService {
	return &AdminService{
		DB: repository.DB,
	}
}

// AdminStats holds all the counts we care about
type AdminStats struct {
	TotalUsers     int64
	TotalLawyers   int64
	TotalQuestions int64
	TotalChats     int64
}

// GetStats runs all four COUNT() queries in one go
func (s *AdminService) GetStats() (*AdminStats, error) {
	var stats AdminStats
	var err error

	// clients and admin only
	if err = s.DB.Model(&models.User{}).
		Where("role != ?", "lawyer").
		Count(&stats.TotalUsers).Error; err != nil {
		return nil, err
	}

	// lawyers table
	if err = s.DB.Model(&models.User{}).
		Where("role = ?", "lawyer").
		Count(&stats.TotalLawyers).Error; err != nil {
		return nil, err
	}

	// questions table
	if err = s.DB.Model(&models.Question{}).
		Count(&stats.TotalQuestions).Error; err != nil {
		return nil, err
	}

	// chat_messages table
	if err = s.DB.Model(&models.ChatMessage{}).
		Count(&stats.TotalChats).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

func (s *AdminService) GetDailyUserCounts(start, end time.Time) (map[string]int64, error) {
	type row struct {
		Date  time.Time
		Count int64
	}
	var rows []row
	if err := s.DB.
		Model(&models.User{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("created_at BETWEEN ? AND ?", start, end).
		Where("role = ?", "client").
		Group("date").
		Order("date").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	m := make(map[string]int64, len(rows))
	for _, r := range rows {
		m[r.Date.Format("2006-01-02")] = r.Count
	}
	return m, nil
}

// GetDailyLawyerCounts returns a map[YYYY-MM-DD]count for lawyers between start and end
func (s *AdminService) GetDailyLawyerCounts(start, end time.Time) (map[string]int64, error) {
	type row struct {
		Date  time.Time
		Count int64
	}
	var rows []row
	if err := s.DB.
		Model(&models.Lawyer{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("created_at BETWEEN ? AND ?", start, end).
		Group("date").
		Order("date").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	m := make(map[string]int64, len(rows))
	for _, r := range rows {
		m[r.Date.Format("2006-01-02")] = r.Count
	}
	return m, nil
}

// GetDailyQuestionCounts returns a map[YYYY-MM-DD]count for questions between start and end
func (s *AdminService) GetDailyQuestionCounts(start, end time.Time) (map[string]int64, error) {
	type row struct {
		Date  time.Time
		Count int64
	}
	var rows []row
	if err := s.DB.
		Model(&models.Question{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("created_at BETWEEN ? AND ?", start, end).
		Group("date").
		Order("date").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	m := make(map[string]int64, len(rows))
	for _, r := range rows {
		m[r.Date.Format("2006-01-02")] = r.Count
	}
	return m, nil
}

// GetDailyChatMessageCounts returns a map[YYYY-MM-DD]count for chat messages between start and end
func (s *AdminService) GetDailyChatMessageCounts(start, end time.Time) (map[string]int64, error) {
	type row struct {
		Date  time.Time
		Count int64
	}
	var rows []row
	if err := s.DB.
		Model(&models.ChatMessage{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("created_at BETWEEN ? AND ?", start, end).
		Group("date").
		Order("date").
		Scan(&rows).Error; err != nil {
		return nil, err
	}

	m := make(map[string]int64, len(rows))
	for _, r := range rows {
		m[r.Date.Format("2006-01-02")] = r.Count
	}
	return m, nil
}
