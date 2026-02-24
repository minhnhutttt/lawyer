package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// Pagination represents pagination information
type Pagination struct {
	Total       int `json:"total"`
	PerPage     int `json:"per_page"`
	CurrentPage int `json:"current_page"`
	TotalPages  int `json:"total_pages"`
}

// FieldChange represents a change in a lawyer field
type FieldChange struct {
	Field string      `json:"field"`
	Old   interface{} `json:"old"`
	New   interface{} `json:"new"`
}

// FieldChanges represents an array of field changes
type FieldChanges []FieldChange

// Value implements the driver.Valuer interface for FieldChanges
func (f FieldChanges) Value() (driver.Value, error) {
	return json.Marshal(f)
}

// Scan implements the sql.Scanner interface for FieldChanges
func (f *FieldChanges) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &f)
}

// LawyerHistory stores the history of changes made to a lawyer
type LawyerHistory struct {
	ID        int          `json:"id" gorm:"primaryKey"`
	LawyerID  int          `json:"lawyer_id" gorm:"not null"`
	UserID    int          `json:"user_id" gorm:"not null"`
	User      User         `json:"user" gorm:"foreignKey:UserID"`
	Changes   FieldChanges `json:"changes" gorm:"type:jsonb;not null"`
	CreatedAt time.Time    `json:"created_at" gorm:"autoCreateTime"`
}

// TableName specifies the table name for LawyerHistory
func (LawyerHistory) TableName() string {
	return "lawyer_histories"
}
