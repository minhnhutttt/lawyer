package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"gorm.io/gorm"
)

// Availability represents a lawyer's availability schedule
type Availability map[string]interface{}

// Value implements the driver.Valuer interface for Availability
func (a Availability) Value() (driver.Value, error) {
	return json.Marshal(a)
}

// Scan implements the sql.Scanner interface for Availability
func (a *Availability) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &a)
}

// StringArray represents a string array type for PostgreSQL
type StringArray []string

// Value implements the driver.Valuer interface for StringArray
func (s StringArray) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "{}", nil
	}

	// Convert each element to quoted strings and join them with commas
	var quotedElems []string
	for _, elem := range s {
		quotedElems = append(quotedElems, fmt.Sprintf("%q", elem))
	}

	// Format as PostgreSQL array literal
	return fmt.Sprintf("{%s}", strings.Join(quotedElems, ",")), nil
}

// Scan implements the sql.Scanner interface for StringArray
func (s *StringArray) Scan(value interface{}) error {
	var bytes []byte
	switch v := value.(type) {
	case []byte:
		bytes = v
	case string:
		bytes = []byte(v)
	default:
		return errors.New("type assertion to []byte or string failed")
	}

	// Strip the curly braces
	trimmed := string(bytes)[1 : len(bytes)-1]

	// Split by comma and remove quotes
	parts := strings.Split(trimmed, ",")
	*s = make([]string, 0, len(parts))

	for _, part := range parts {
		// Skip empty string
		if part == "" {
			continue
		}

		// Remove quotes
		part = strings.Trim(part, "\"")
		*s = append(*s, part)
	}

	return nil
}

// Lawyer represents a lawyer in the system
type Lawyer struct {
	ID              int           `json:"id" gorm:"primaryKey"`
	UserID          int           `json:"user_id" gorm:"uniqueIndex;not null"`
	User            User          `json:"user"   gorm:"foreignKey:UserID"`
	FullName        string        `json:"full_name" gorm:"not null"`
	Phone           *string       `json:"phone,omitempty"`
	Email           string        `json:"email" gorm:"uniqueIndex;not null"`
	OfficeName      string        `json:"office_name" gorm:"not null"`
	Address         string        `json:"address" gorm:"not null"`
	BarAssociation  string        `json:"bar_association" gorm:"not null"`
	Specialties     StringArray   `json:"specialties" gorm:"type:text[];not null"`
	BarNumber       string        `json:"bar_number" gorm:"not null"`
	ExperienceYears *int          `json:"experience_years,omitempty"`
	Languages       StringArray   `json:"languages" gorm:"type:text[];not null"`
	Bio             *string       `json:"bio,omitempty"`
	Availability    *Availability `json:"availability,omitempty" gorm:"type:jsonb"`
	Rating          *int          `json:"rating,omitempty"`
	Certifications  *string       `json:"certifications,omitempty"`
	Achievements    *string       `json:"achievements,omitempty"`

	Affiliation               *string `json:"affiliation,omitempty" gorm:"column:affiliation"`
	LawyerRegistrationNumber  *string `json:"lawyer_registration_number,omitempty" gorm:"column:lawyer_registration_number"`
	CertificationDocumentPath *string `json:"certification_document_path,omitempty" gorm:"column:certification_document_path"`
	PhoneNumber               *string `json:"phone_number,omitempty" gorm:"column:phone_number"`
	FaxNumber                 *string `json:"fax_number,omitempty" gorm:"column:fax_number"`
	ProfileText               *string `json:"profile_text,omitempty" gorm:"type:text;column:profile_text"`
	AreasOfExpertise          *string `json:"areas_of_expertise,omitempty" gorm:"type:text;column:areas_of_expertise"`
	Notes                     *string `json:"notes,omitempty" gorm:"type:text;column:notes"`

	CreatedAt time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	IsVerified bool          `json:"is_verified" gorm:"default:false"`

	// Additional calculated fields that don't exist in the database
	ReviewCount   *int     `json:"review_count,omitempty" gorm:"-"`
	AverageRating *float64 `json:"average_rating,omitempty" gorm:"-"`
}

// TableName specifies the table name for the Lawyer model
func (Lawyer) TableName() string {
	return "lawyers"
}
