package handlers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// LawyerWithProfileImage extends the Lawyer model to include the profile image
type LawyerWithProfileImage struct {
	models.Lawyer
	ProfileImage *string `json:"profile_image,omitempty"`
}

// PublicLawyerResponse represents a simplified lawyer response for public endpoints
type PublicLawyerResponse struct {
	ID               int                `json:"id"`
	FullName         string             `json:"full_name"`
	ProfileImage     *string            `json:"profile_image,omitempty"`
	OfficeName       string             `json:"office_name"`
	Address          string             `json:"address"`
	BarAssociation   string             `json:"bar_association"`
	Specialties      models.StringArray `json:"specialties"`
	ExperienceYears  *int               `json:"experience_years,omitempty"`
	Languages        models.StringArray `json:"languages"`
	Bio              *string            `json:"bio,omitempty"`
	Rating           *int               `json:"rating,omitempty"`
	ReviewCount      *int               `json:"review_count,omitempty"`
	AverageRating    *float64           `json:"average_rating,omitempty"`
	ProfileText      *string            `json:"profile_text,omitempty"`
	AreasOfExpertise *string            `json:"areas_of_expertise,omitempty"`
}

// @Summary Get all lawyers
// @Description Returns a paginated list of lawyers with search and sorting capabilities
// @Tags lawyers
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Param search query string false "Search term"
// @Param sort_by query string false "Field to sort by" default(id)
// @Param sort_order query string false "Sort direction ('asc' or 'desc')" default(asc)
// @Success 200 {object} responses.PaginatedResponse{data=[]LawyerWithProfileImage}
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers [get]
// GetLawyersHandler returns a list of lawyers
func GetLawyersHandler(c *gin.Context) {
	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get search and sort parameters
	search := c.Query("search")
	sortField := c.DefaultQuery("sort_by", "id")
	sortDir := c.DefaultQuery("sort_order", "asc")

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get lawyers with filtering, pagination, search and sorting
	lawyers, total, err := lawyerService.GetLawyers(page, limit, search, sortField, sortDir)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve lawyers", responses.ErrCodeDatabaseError)
		return
	}

	// Convert to LawyerWithProfileImage type

	lawyersWithProfileImage := make([]LawyerWithProfileImage, len(lawyers))
	for i, lawyer := range lawyers {
		lawyersWithProfileImage[i] = LawyerWithProfileImage{
			Lawyer:       lawyer,
			ProfileImage: lawyer.User.ProfileImage,
		}
	}

	// Calculate total pages
	totalPages := (int(total) + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		lawyersWithProfileImage,
		page,
		limit,
		int(total),
		totalPages,
	)
}

// @Summary Get lawyer by ID
// @Description Returns a specific lawyer's details by ID
// @Tags lawyers
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Lawyer ID"
// @Success 200 {object} models.Lawyer
// @Failure 400 {object} responses.APIErrorResponse "Invalid lawyer ID"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/{id} [get]
// GetLawyerByIDHandler returns a specific lawyer by ID
func GetLawyerByIDHandler(c *gin.Context) {
	// Get the lawyer ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get the lawyer
	lawyer, err := lawyerService.GetLawyerByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	if err := lawyerService.EnrichLawyerWithReviewStats(lawyer); err != nil {
		fmt.Printf("could not enrich lawyer with review stats: %v\n", err)
	}

	// Flatten selected user fields into the lawyer payload so the front-end doesn’t need to navigate a nested object
	user := lawyer.User
	merged := struct {
		models.Lawyer
		ProfileImage *string    `json:"profile_image,omitempty"`
		BirthDate    *time.Time `json:"birth_date,omitempty"`
		Gender       *string    `json:"gender,omitempty"`
	}{
		Lawyer:       *lawyer,
		ProfileImage: user.ProfileImage,
		BirthDate:    user.BirthDate,
		Gender:       user.Gender,
	}

	responses.NewAPIResponse(c).OK(merged)
}

// @Summary Get current lawyer profile
// @Description Returns the lawyer profile for the currently authenticated user
// @Tags lawyers
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} models.Lawyer
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer profile not found"
// @Router /lawyers/profile [get]
// GetLawyerProfileHandler returns the lawyer profile for the current user
func GetLawyerProfileHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get the lawyer by user ID
	lawyer, err := lawyerService.GetLawyerByUserID(userID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Enrich with review stats so AverageRating & ReviewCount get populated
	if err := lawyerService.EnrichLawyerWithReviewStats(lawyer); err != nil {
		// log but don’t block the response
		fmt.Printf("could not enrich lawyer profile with review stats: %v\n", err)
	}

	// Return the lawyer profile
	responses.NewAPIResponse(c).OK(lawyer)
}

// @Summary Create lawyer profile
// @Description Creates a new lawyer profile for a user
// @Tags lawyers
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param lawyer body models.Lawyer true "Lawyer profile data"
// @Success 201 {object} models.Lawyer
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 409 {object} responses.APIErrorResponse "Lawyer profile already exists"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers [post]
// CreateLawyerHandler creates a new lawyer profile
func CreateLawyerHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the user role
	userRole, _ := middleware.GetUserRole(c)
	if userRole != "lawyer" && userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only lawyers can create lawyer profiles", responses.ErrCodeForbidden)
		return
	}

	// Parse the request body
	var lawyer models.Lawyer
	if err := c.ShouldBindJSON(&lawyer); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Set the user ID
	lawyer.UserID = userID

	// Ensure Specialties and Languages are handled correctly
	if lawyer.Specialties == nil {
		lawyer.Specialties = models.StringArray{}
	}

	if lawyer.Languages == nil {
		lawyer.Languages = models.StringArray{}
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Check if the user already has a lawyer profile
	_, err := lawyerService.GetLawyerByUserID(userID)
	if err == nil {
		responses.NewAPIResponse(c).BadRequest("User already has a lawyer profile", responses.ErrCodeResourceAlreadyExists)
		return
	}

	// Create the lawyer
	err = lawyerService.CreateLawyer(&lawyer)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// Return the created lawyer profile
	responses.NewAPIResponse(c).Created(lawyer)
}

// @Summary Update lawyer profile
// @Description Updates an existing lawyer profile
// @Tags lawyers
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Lawyer ID"
// @Param lawyer body models.Lawyer true "Updated lawyer profile data"
// @Success 200 {object} models.Lawyer
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Not authorized to update this profile"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer profile not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/{id} [put]
// UpdateLawyerHandler updates an existing lawyer profile
func UpdateLawyerHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the user role
	userRole, _ := middleware.GetUserRole(c)

	// Get the lawyer ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get the original lawyer
	currentLawyer, err := lawyerService.GetLawyerByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	// If not admin and not updating own lawyer profile, return error
	if userRole != "admin" && currentLawyer.UserID != userID {
		responses.NewAPIResponse(c).Forbidden("You can only update your own lawyer profile", responses.ErrCodeForbidden)
		return
	}

	// Parse request body
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid request body", responses.ErrCodeInvalidRequest)
		return
	}

	// Create a copy of the current lawyer for history tracking
	originalLawyer := *currentLawyer

	// Update lawyer
	err = lawyerService.UpdateLawyer(id, req)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// Get the updated lawyer
	updatedLawyer, err := lawyerService.GetLawyerByID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve updated lawyer profile", responses.ErrCodeDatabaseError)
		return
	}

	// Track changes for history
	if err := services.CompareAndTrackLawyerChanges(lawyerService.DB, &originalLawyer, updatedLawyer, userID); err != nil {
		// Log the error but don't fail the request
		fmt.Printf("Failed to record lawyer history: %v\n", err)
	}

	// Check if verification notification email should be sent
	// Only send the notification if the lawyer is NOT verified, is updating their own profile (not admin update),
	// and has completed their required profile fields
	if !updatedLawyer.IsVerified && userRole != "admin" && isProfileComplete(updatedLawyer) {
		// Send verification notification email to admins
		// The email service will handle admin email retrieval and error handling internally
		if err := services.GetEmailService().SendLawyerVerificationNotificationEmail(*updatedLawyer); err != nil {
			// Just log the error, don't fail the profile update
			fmt.Printf("Failed to send lawyer verification notification email: %v\n", err)
		} else {
			fmt.Println("Sent verification notification email to admins for lawyer ID:", updatedLawyer.ID)
		}
	}

	// Return the updated lawyer
	responses.NewAPIResponse(c).OK(updatedLawyer)
}

// @Summary Delete lawyer profile
// @Description Deletes an existing lawyer profile
// @Tags lawyers
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Lawyer ID"
// @Success 200 {object} gin.H "Success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid lawyer ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Not authorized to delete this profile"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer profile not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/{id} [delete]
// DeleteLawyerHandler deletes a lawyer profile
func DeleteLawyerHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the user role
	userRole, _ := middleware.GetUserRole(c)

	// Get the lawyer ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get the existing lawyer
	existingLawyer, err := lawyerService.GetLawyerByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Check if the user has permission to delete this lawyer profile
	if userRole != "admin" && existingLawyer.UserID != userID {
		responses.NewAPIResponse(c).Forbidden("You can only delete your own lawyer profile", responses.ErrCodeForbidden)
		return
	}

	// Delete the lawyer
	err = lawyerService.DeleteLawyer(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// Return success
	responses.NewAPIResponse(c).OK(gin.H{"message": "Lawyer profile deleted successfully"})
}

// @Summary Public search for lawyers
// @Description Allows public users to search for lawyers without authentication
// @Tags public
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Param search query string false "Search term in name or expertise"
// @Param specialty query string false "Filter by specialty"
// @Param language query string false "Filter by language"
// @Param experience_min query int false "Minimum years of experience"
// @Param rating_min query int false "Minimum rating"
// @Param sort_by query string false "Field to sort by" Enums(name, experience, rating) default(id)
// @Param sort_order query string false "Sort direction ('asc' or 'desc')" default(asc)
// @Success 200 {object} responses.PaginatedResponse{data=[]PublicLawyerResponse}
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /public/lawyers [get]
// PublicSearchLawyersHandler allows public users to search for lawyers without authentication
func PublicSearchLawyersHandler(c *gin.Context) {
	// Get filters from query parameters
	filters := make(map[string]interface{})

	// Basic filters
	if specialty := c.Query("params[specialty]"); specialty != "" {
		filters["specialty"] = specialty
	}

	if language := c.Query("language"); language != "" {
		filters["language"] = language
	}

	if experience := c.Query("params[experience]"); experience != "" {
		filters["experience"] = experience
	}

	// Advanced filters
	if barAssociation := c.Query("bar_association"); barAssociation != "" {
		filters["bar_association"] = barAssociation
	}

	if name := c.Query("params[name]"); name != "" {
		filters["name"] = name
	}

	if prefecture := c.Query("params[prefecture]"); prefecture != "" {
		filters["prefecture"] = prefecture
	}

	if minRating := c.Query("params[min_rating]"); minRating != "" {
		filters["min_rating"] = minRating
	}

	// Pagination
	page := 1
	pageSize := 10

	if pageStr := c.Query("params[page]"); pageStr != "" {
		if pageNum, err := strconv.Atoi(pageStr); err == nil && pageNum > 0 {
			page = pageNum
		}
	}

	if pageSizeStr := c.Query("params[page_size]"); pageSizeStr != "" {
		if pageSizeNum, err := strconv.Atoi(pageSizeStr); err == nil && pageSizeNum > 0 && pageSizeNum <= 100 {
			pageSize = pageSizeNum
		}
	}

	filters["page"] = page
	filters["page_size"] = pageSize

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get all lawyers with filters
	lawyers, total, err := lawyerService.SearchLawyers(filters)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to search lawyers", responses.ErrCodeDatabaseError)
		return
	}

	// Create public lawyer responses

	userIDs := make([]int, len(lawyers))
	for i, lw := range lawyers {
		userIDs[i] = lw.UserID
	}
	var users []models.User
	if err := lawyerService.DB.
		Select("id", "profile_image").
		Where("id IN ?", userIDs).
		Find(&users).Error; err != nil {
		// log if you want, but we can still proceed
		fmt.Printf("couldn't load profile images: %v\n", err)
	}
	profileMap := make(map[int]*string, len(users))
	for _, u := range users {
		profileMap[u.ID] = u.ProfileImage
	}

	// Convert lawyers to public response
	publicLawyers := make([]PublicLawyerResponse, 0, len(lawyers))
	for _, lawyer := range lawyers {
		publicLawyer := PublicLawyerResponse{
			ID:               lawyer.ID,
			FullName:         lawyer.FullName,
			ProfileImage:     profileMap[lawyer.UserID],
			OfficeName:       lawyer.OfficeName,
			Address:          lawyer.Address,
			BarAssociation:   lawyer.BarAssociation,
			Specialties:      lawyer.Specialties,
			ExperienceYears:  lawyer.ExperienceYears,
			Languages:        lawyer.Languages,
			Bio:              lawyer.Bio,
			Rating:           lawyer.Rating,
			ReviewCount:      lawyer.ReviewCount,
			AverageRating:    lawyer.AverageRating,
			ProfileText:      lawyer.ProfileText,
			AreasOfExpertise: lawyer.AreasOfExpertise,
		}
		publicLawyers = append(publicLawyers, publicLawyer)
	}

	// Prepare the response with pagination
	totalPages := int((total + int64(pageSize) - 1) / int64(pageSize))
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		publicLawyers,
		page,
		pageSize,
		int(total),
		totalPages,
	)
}

// @Summary Public get lawyer by ID
// @Description Returns public information for a specific lawyer without requiring authentication
// @Tags public
// @Produce json
// @Param id path int true "Lawyer ID"
// @Success 200 {object} gin.H "Lawyer public profile"
// @Failure 400 {object} responses.APIErrorResponse "Invalid lawyer ID"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /public/lawyers/{id} [get]
// PublicGetLawyerByIDHandler returns public information for a specific lawyer without requiring authentication
func PublicGetLawyerByIDHandler(c *gin.Context) {
	// Get the lawyer ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid lawyer ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the lawyer service
	lawyerService := services.NewLawyerService()

	// Get the lawyer
	lawyer, err := lawyerService.GetLawyerByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Ensure we have review statistics
	if lawyer.ReviewCount == nil || lawyer.AverageRating == nil {
		if err := lawyerService.EnrichLawyerWithReviewStats(lawyer); err != nil {
			// Log the error but continue
			fmt.Printf("Error enriching lawyer with review stats: %v\n", err)
		}
	}

	var user models.User
	if err := lawyerService.DB.
		First(&user, lawyer.UserID).
		Error; err != nil {
		fmt.Printf("Couldn't load profile: %v\n", err)
	}

	// Prepare a simplified response that doesn't include sensitive information
	publicLawyer := struct {
		ID                       int                `json:"id"`
		FullName                 string             `json:"full_name"`
		Email                    string             `json:"email"`
		ProfileImage             *string            `json:"profile_image,omitempty"`
		BirthDate                *time.Time         `json:"birth_date,omitempty"`
		Gender                   *string            `json:"gender,omitempty"`
		ProfileText              *string            `json:"profile_text,omitempty"`
		Notes                    *string            `json:"notes,omitempty"`
		Affiliation              *string            `json:"affiliation,omitempty"`
		OfficeName               string             `json:"office_name"`
		Address                  string             `json:"address"`
		PhoneNumber              *string            `json:"phone_number,omitempty"`
		FaxNumber                *string            `json:"fax_number,omitempty"`
		LawyerRegistrationNumber *string            `json:"lawyer_registration_number,omitempty"`
		Specialties              models.StringArray `json:"specialties"`
		AreasOfExpertise         *string            `json:"areas_of_expertise,omitempty"`
		ExperienceYears          *int               `json:"experience_years,omitempty"`
		Languages                models.StringArray `json:"languages"`
		Bio                      *string            `json:"bio,omitempty"`
		Rating                   *int               `json:"rating,omitempty"`
		ReviewCount              *int               `json:"review_count,omitempty"`
		AverageRating            *float64           `json:"average_rating,omitempty"`
		IsVerified               bool               `json:"is_verified"`
		UserActive               bool               `json:"user_active"`
	}{
		ID:                       lawyer.ID,
		FullName:                 lawyer.FullName,
		Email:                    lawyer.Email,
		ProfileImage:             user.ProfileImage,
		BirthDate:                user.BirthDate,
		Gender:                   user.Gender,
		ProfileText:              lawyer.ProfileText,
		Notes:                    lawyer.Notes,
		Affiliation:              lawyer.Affiliation,
		OfficeName:               lawyer.OfficeName,
		Address:                  lawyer.Address,
		PhoneNumber:              lawyer.Phone,
		FaxNumber:                lawyer.FaxNumber,
		LawyerRegistrationNumber: lawyer.LawyerRegistrationNumber,
		Specialties:              lawyer.Specialties,
		AreasOfExpertise:         lawyer.AreasOfExpertise,
		ExperienceYears:          lawyer.ExperienceYears,
		Languages:                lawyer.Languages,
		Bio:                      lawyer.Bio,
		Rating:                   lawyer.Rating,
		ReviewCount:              lawyer.ReviewCount,
		AverageRating:            lawyer.AverageRating,
		IsVerified:               lawyer.IsVerified,
		UserActive:               user.IsActive,
	}

	// Return the public lawyer information
	responses.NewAPIResponse(c).OK(publicLawyer)
}

// Helper function to check if a lawyer profile is complete with all required fields
func isProfileComplete(lawyer *models.Lawyer) bool {
	// Check essential fields that should be filled for a complete profile
	return lawyer != nil &&
		lawyer.FullName != "" &&
		lawyer.Email != "" &&
		lawyer.OfficeName != "" &&
		lawyer.Address != "" &&
		lawyer.LawyerRegistrationNumber != nil &&
		*lawyer.LawyerRegistrationNumber != "" &&
		lawyer.Phone != nil &&
		*lawyer.Phone != "" &&
		len(lawyer.Specialties) > 0
}

// @Summary Upload lawyer certification
// @Description Uploads a certification document for a lawyer profile
// @Tags lawyers
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param lawyer_id formData int false "Lawyer ID (required for admin users only)"
// @Param certification formData file true "Certification document file"
// @Success 200 {object} gin.H "Success with certification path"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or missing file"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /lawyers/upload-certification [post]
func UploadLawyerCertificationHandler(c *gin.Context) {
	// auth check
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).
			Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// get role
	userRole, _ := middleware.GetUserRole(c)

	// determine which lawyer to attach to
	var targetLawyerID int
	lawyerSvc := services.NewLawyerService()

	if userRole == "admin" {
		// admin must supply lawyer_id
		idStr := c.PostForm("lawyer_id")
		if idStr == "" {
			responses.NewAPIResponse(c).
				BadRequest("lawyer_id is required for admin uploads", responses.ErrCodeInvalidRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil || id <= 0 {
			responses.NewAPIResponse(c).
				BadRequest("Invalid lawyer_id", responses.ErrCodeInvalidRequest)
			return
		}
		// verify it exists
		if _, err := lawyerSvc.GetLawyerByID(id); err != nil {
			responses.NewAPIResponse(c).
				NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
			return
		}
		targetLawyerID = id

	} else {
		// regular lawyer uploads to their own profile
		lawyer, err := lawyerSvc.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).
				InternalServerError("Failed to get your lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
			return
		}
		targetLawyerID = lawyer.ID
	}

	// file grab
	file, header, err := c.Request.FormFile("certification")
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("No certification file uploaded: "+err.Error(), responses.ErrCodeInvalidRequest)
		return
	}
	defer file.Close()

	// build S3 key
	ext := filepath.Ext(header.Filename)
	key := fmt.Sprintf("lawyers/%d/certification_%d%s", targetLawyerID, time.Now().UnixNano(), ext)

	// upload
	utilSvc := services.NewUtilService()
	contentType := header.Header.Get("Content-Type")
	location, err := utilSvc.UploadFileToS3(
		c.Request.Context(),
		key,
		file,
		contentType,
	)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to upload to S3: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// update record
	err = lawyerSvc.UpdateLawyer(targetLawyerID, map[string]interface{}{
		"certification_document_path": location,
		"updated_at":                  time.Now(),
	})
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to update lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// success
	responses.NewAPIResponse(c).
		OK(gin.H{"certification_document_path": location})
}
