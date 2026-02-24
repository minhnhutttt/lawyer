package models

import (
	"time"

	"gorm.io/gorm"
)

// Notification represents a notification for a user
type Notification struct {
	ID            int            `json:"id" gorm:"primaryKey"`
	UserID        int            `json:"user_id" gorm:"not null;index"`
	Type          string         `json:"type" gorm:"not null;index"`
	Content       string         `json:"content" gorm:"not null"`
	IsRead        bool           `json:"is_read" gorm:"not null;default:false"`
	CreatedAt     time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Notification model
func (Notification) TableName() string {
	return "notifications"
}
