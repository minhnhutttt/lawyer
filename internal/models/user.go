package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID                  int            `json:"id" gorm:"primaryKey"`
	Password            string         `json:"-" gorm:"not null"` // Password is not returned in JSON
	Role                string         `json:"role" gorm:"not null;default:'client'"`
	Email               string         `json:"email" gorm:"uniqueIndex;not null"`
	Nickname            *string        `json:"nickname,omitempty"`
	FirstName           *string        `json:"first_name,omitempty"`
	LastName            *string        `json:"last_name,omitempty"`
	ProfileImage        *string        `json:"profile_image,omitempty"`
	BirthDate           *time.Time     `json:"birth_date,omitempty"`
	PostalCode          *string        `json:"postal_code,omitempty"`
	Country             *string        `json:"country,omitempty"`
	Prefecture          *string        `json:"prefecture,omitempty"`
	City                *string        `json:"city,omitempty"`
	Gender              *string        `json:"gender,omitempty" gorm:"type:gender_enum;column:gender"`
	AgeGroup            *string        `json:"age_group,omitempty" gorm:"type:age_group_enum;column:age_group"`
	Address             *string        `json:"address,omitempty"`
	Phone               *string        `json:"phone,omitempty"`
	Notes               *string        `json:"notes,omitempty"`
	IsActive            bool           `json:"is_active" gorm:"not null;default:true"`
	EmailVerified       bool           `json:"email_verified" gorm:"not null;default:false"`
	VerificationToken   *string        `json:"-"`
	VerificationExpiry  *time.Time     `json:"-"`
	GoogleID            *string        `json:"-"`
	ResetPasswordToken  *string        `json:"-"`
	ResetPasswordExpiry *time.Time     `json:"-"`
	CreatedAt           time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt           time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt           gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for User
func (User) TableName() string {
	return "users"
}
