package models

import (
	"time"

	"gorm.io/gorm"
)

// Review represents a review of a lawyer by a user
type Review struct {
	ID             int            `json:"id" gorm:"primaryKey"`
	UserID         int            `json:"user_id" gorm:"not null;index"`
	LawyerID       int            `json:"lawyer_id" gorm:"not null;index"`
	User           User           `json:"user"   gorm:"foreignKey:UserID"`
	Lawyer         Lawyer         `json:"lawyer" gorm:"foreignKey:LawyerID"`
	AppointmentID  *int           `json:"appointment_id,omitempty" gorm:"index"`
	Rating         int            `json:"rating" gorm:"not null"`
	Comment        *string        `json:"comment,omitempty"`
	CreatedAt      time.Time      `json:"created_at" gorm:"autoCreateTime"`
	IsHidden       bool           `json:"is_hidden" gorm:"not null;default:false"`
	IsPin          bool           `json:"is_pin" gorm:"not null;default:false"`
	HiddenReason   *string        `json:"hidden_reason,omitempty"`
	ApprovedStatus *string        `json:"approved_status,omitempty" gorm:"default:'pending'"`
	UpdatedAt      time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt      gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Review model
func (Review) TableName() string {
	return "reviews"
}
