package models

import (
	"time"

	"gorm.io/gorm"
)

// Appointment represents a scheduled meeting between a user and a lawyer
type Appointment struct {
	ID               int            `json:"id" gorm:"primaryKey"`
	UserID           int            `json:"user_id" gorm:"not null;index"`
	User             User           `gorm:"foreignKey:UserID"`
	LawyerID         int            `json:"lawyer_id" gorm:"not null;index"`
	Lawyer           Lawyer         `gorm:"foreignKey:LawyerID"`
	Description      *string        `json:"description,omitempty"`
	StartTime        time.Time      `json:"start_time" gorm:"not null;index"`
	EndTime          time.Time      `json:"end_time" gorm:"not null"`
	Status           string         `json:"status" gorm:"not null;default:pending"`
	MeetingLink      *string        `json:"meeting_link,omitempty"`
	Notes            *string        `json:"notes,omitempty"`
	ChatEnabled      bool           `json:"chat_enabled" gorm:"default:false"`
	RejectReason     *string        `json:"reject_reason,omitempty"`
	CancelReason     *string        `json:"cancel_reason,omitempty"`
	AdminReason      *string        `json:"admin_reason,omitempty"`
	DayReminderSent  bool           `json:"day_reminder_sent" gorm:"default:false"`
	HourReminderSent bool           `json:"hour_reminder_sent" gorm:"default:false"`
	IsLawyerViewed   bool           `json:"is_lawyer_viewed" gorm:"default:false"`
	IsClientViewed   bool           `json:"is_client_viewed" gorm:"default:false"`
	CreatedAt        time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt        time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt        gorm.DeletedAt `json:"-" gorm:"index"`
	LawyerName       string         `json:"lawyer_name" gorm:"-"`
}

// TableName specifies the table name for the Appointment model
func (Appointment) TableName() string {
	return "appointments"
}
