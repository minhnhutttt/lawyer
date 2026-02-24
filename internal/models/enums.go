package models

// UserRole represents the possible roles a user can have
type UserRole string

const (
	RoleClient UserRole = "client"
	RoleLawyer UserRole = "lawyer"
	RoleAdmin  UserRole = "admin"
)

// IsValid checks if the role is valid
func (r UserRole) IsValid() bool {
	switch r {
	case RoleClient, RoleLawyer, RoleAdmin:
		return true
	default:
		return false
	}
}

// String returns the string representation of the role
func (r UserRole) String() string {
	return string(r)
} 