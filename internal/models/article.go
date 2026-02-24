package models

import (
	"time"

	"gorm.io/gorm"
)

// Article represents an article in the system
type Article struct {
	ID          int            `json:"id" gorm:"primaryKey"`
	Title       string         `json:"title" gorm:"not null"`
	Content     string         `json:"content" gorm:"not null;type:text"`
	Category    string         `json:"category" gorm:"not null;index"`
	Summary     *string        `json:"summary,omitempty"`
	Thumbnail   *string        `json:"thumbnail,omitempty"`
	AuthorID    int            `json:"author_id" gorm:"not null;index"`
	Author      User           `gorm:"foreignKey:AuthorID"`
	PublishedAt time.Time      `json:"published_at" gorm:"index"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	Status      string         `json:"status" gorm:"not null;default:'draft';index"`
	Slug        string         `json:"slug" gorm:"not null;uniqueIndex"`
	CreatedAt   time.Time      `json:"created_at" gorm:"autoCreateTime"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Article model
func (Article) TableName() string {
	return "articles"
}
