package responses

import "time"

type ReviewResponse struct {
	ID             int            `json:"id"`
	Rating         int            `json:"rating"`
	AppointmentID  *int           `json:"appointment_id,omitempty"`
	ApprovedStatus *string        `json:"approved_status"`
	UserID         int            `json:"user_id"`
	LawyerID       int            `json:"lawyer_id"`
	Comment        *string        `json:"comment,omitempty"`
	IsHidden       bool           `json:"is_hidden"`
	IsPin          bool           `json:"is_pin"`
	HiddenReason   *string        `json:"hidden_reason,omitempty"`
	User           UserResponse   `json:"user"`
	Lawyer         LawyerResponse `json:"lawyer"`
	UpdatedAt      time.Time      `json:"updated_at"`
	CreatedAt      time.Time      `json:"created_at"`
}
