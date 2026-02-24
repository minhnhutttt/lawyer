package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

// Attachments represents a collection of file attachments
type Attachments map[string]interface{}

// Value implements the driver.Valuer interface for Attachments
func (a Attachments) Value() (driver.Value, error) {
	return json.Marshal(a)
}

// Scan implements the sql.Scanner interface for Attachments
func (a *Attachments) Scan(value interface{}) error {
	b, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(b, &a)
}

// ChatMessage represents a message in a chat between a user and a lawyer
type ChatMessage struct {
	ID            int            `json:"id" gorm:"primaryKey"`
	AppointmentID int            `json:"appointment_id" gorm:"not null;index"`
	SenderID      int            `json:"sender_id" gorm:"not null;index"`
	ReceiverID    int            `json:"receiver_id" gorm:"not null;index"`
	Content       string         `json:"content" gorm:"not null;type:text"`
	Read          bool           `json:"read" gorm:"not null;default:false"`
	CreatedAt     time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt     time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt     gorm.DeletedAt `json:"-" gorm:"index"`

	// polymorphic one-to-one attachment
	Attachment *Attachment `json:"attachment,omitempty" gorm:"polymorphic:Attachmentable;polymorphicValue:ChatMessage"`
}

// TableName specifies the table name for the ChatMessage model
func (ChatMessage) TableName() string {
	return "chat_messages"
}

// Attachment represents a file attachment in the system
type Attachment struct {
	ID       int    `json:"id" gorm:"primaryKey"`
	FileName string `json:"file_name" gorm:"not null"`
	FileSize int    `json:"file_size" gorm:"not null"`
	FileType string `json:"file_type" gorm:"not null;index"`
	FilePath string `json:"file_path" gorm:"not null"`

	AttachmentableType string `json:"attachmentable_type" gorm:"not null;index"`
	AttachmentableID   int    `json:"attachmentable_id" gorm:"not null;index"`

	UploadedBy int            `json:"uploaded_by" gorm:"not null;index"`
	CreatedAt  time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt  time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
	DeletedAt  gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName specifies the table name for the Attachment model
func (Attachment) TableName() string {
	return "attachments"
}
