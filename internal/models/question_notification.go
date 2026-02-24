package models

import (
	"time"

	"gorm.io/gorm"
)

// QuestionNotification represents a notification for a question answer
type QuestionNotification struct {
	ID         int            `json:"id" gorm:"primaryKey"`
	UserID     int            `json:"user_id" gorm:"not null;index"`
	QuestionID int            `json:"question_id" gorm:"not null;index"`
	AnswerID   int            `json:"answer_id" gorm:"not null;index"`
	Read       bool           `json:"read" gorm:"not null;default:false"`
	CreatedAt  time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the QuestionNotification model
func (QuestionNotification) TableName() string {
	return "question_notifications"
}
