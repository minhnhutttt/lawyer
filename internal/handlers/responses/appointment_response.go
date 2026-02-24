package responses

import (
	"time"
)

// AppointmentResponse represents the API response structure for an appointment
type AppointmentResponse struct {
	ID           int       `json:"id"`
	UserID       int       `json:"user_id"`
	Description  *string   `json:"description,omitempty"`
	StartTime    time.Time `json:"start_time"`
	EndTime      time.Time `json:"end_time"`
	Status       string    `json:"status"`
	Notes        *string   `json:"notes,omitempty"`
	ChatEnabled  bool      `json:"chat_enabled"`
	IsLawyerViewed bool      `json:"is_lawyer_viewed"`
	IsClientViewed bool      `json:"is_client_viewed"`
	RejectReason *string   `json:"reject_reason"`
	CancelReason *string   `json:"cancel_reason"`
	AdminReason  *string   `json:"admin_reason"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// Lawyer information
	Lawyer LawyerBrief `json:"lawyer"`
	Client UserProfile `json:"client"`
}
