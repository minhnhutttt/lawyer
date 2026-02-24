package models

import (
	"time"

	"gorm.io/gorm"
)

// Answer represents an answer to a question by a lawyer
type Answer struct {
	ID         int            `json:"id" gorm:"primaryKey"`
	QuestionID int            `json:"question_id" gorm:"not null;index"`
	LawyerID   int            `json:"lawyer_id" gorm:"not null;index"`
	Lawyer     Lawyer         `json:"lawyer" gorm:"foreignKey:LawyerID;references:ID"`
	Content    string         `json:"content" gorm:"not null;type:text"`
	IsAccepted bool           `json:"is_accepted" gorm:"not null;default:false"`
	IsHidden   bool           `json:"is_hidden" gorm:"not null;default:false"`
	CreatedAt  time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Answer model
func (Answer) TableName() string {
	return "answers"
}
