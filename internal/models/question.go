package models

import (
	"time"

	"gorm.io/gorm"
)

// Question represents a question asked by a user
type Question struct {
	ID        int            `json:"id" gorm:"primaryKey"`
	UserID    int            `json:"user_id" gorm:"not null;index"`
	User      User           `gorm:"foreignKey:UserID"`
	Title     string         `json:"title" gorm:"not null"`
	Content   string         `json:"content" gorm:"not null;type:text"`
	Status    string         `json:"status" gorm:"not null;default:'open';index"`
	IsHidden  bool           `json:"is_hidden" gorm:"not null;default:false"`
	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Question model
func (Question) TableName() string {
	return "questions"
}
