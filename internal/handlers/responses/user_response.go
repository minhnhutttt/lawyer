package responses

import "time"

// UserResponse represents the API response structure for a user
type UserResponse struct {
	ID                int       `json:"id"`
	Email             string    `json:"email"`
	Nickname          *string   `json:"nickname"`
	FirstName         *string   `json:"first_name"`
	LastName          *string   `json:"last_name"`
	ProfileImage      *string   `json:"profile_image,omitempty"`
	Role              string    `json:"role"`
	HasNewAppointment bool      `json:"has_new_appointment"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// UserProfile represents a user's public profile
type UserProfile struct {
	ID           int     `json:"id"`
	Nickname     *string `json:"nickname"`
	Email        string  `json:"email"`
	ProfileImage *string `json:"profile_image,omitempty"`
	Role         string  `json:"role"`
	IsActive     bool    `json:"is_active"`
}
