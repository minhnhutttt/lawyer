package responses

// LawyerBrief represents a simplified lawyer structure for responses
type LawyerBrief struct {
	ID               int     `json:"id"`
	UserID           int     `json:"user_id"`
	FullName         string  `json:"full_name"`
	OfficeName       string  `json:"office_name"`
	AreasOfExpertise *string `json:"areas_of_expertise"`
	Affiliation      *string `json:"affiliation"`
	ProfileImage     *string `json:"profile_image"`
	ProfileText      *string `json:"profile_text"`
	UserActive       bool    `json:"user_active"`
}

// LawyerResponse represents the complete lawyer information for API responses
type LawyerResponse struct {
	ID              int      `json:"id"`
	UserID          int      `json:"user_id"`
	ProfileImage    *string  `json:"profile_image"`
	FullName        string   `json:"full_name"`
	Email           string   `json:"email"`
	OfficeName      string   `json:"office_name"`
	Address         string   `json:"address"`
	BarNumber       string   `json:"bar_number"`
	BarAssociation  string   `json:"bar_association"`
	Bio             *string  `json:"bio,omitempty"`
	Specialties     []string `json:"specialties"`
	Languages       []string `json:"languages"`
	ExperienceYears int      `json:"experience_years"`
	Rating          float64  `json:"rating"`
	ReviewCount     int      `json:"review_count"`
}
