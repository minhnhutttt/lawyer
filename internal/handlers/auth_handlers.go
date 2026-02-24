package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"github.com/kotolino/lawyer/internal/services"
)

var (
	utilService = services.NewUtilService()
)

// getEmailService provides a lazily loaded email service
func getEmailService() *services.EmailService {
	return services.GetEmailService()
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LawyerProfileRequest represents the lawyer profile data in registration
type LawyerProfileRequest struct {
	FirstName                string `json:"first_name" binding:"required"`
	LastName                 string `json:"last_name" binding:"required"`
	Affiliation              string `json:"affiliation" binding:"omitempty"`
	LawyerRegistrationNumber string `json:"lawyer_registration_number" binding:"required"`
}

// RegisterRequest represents the registration request body
type RegisterRequest struct {
	Email         string                `json:"email" binding:"required,email"`
	Password      string                `json:"password" binding:"required,min=8"`
	Role          models.UserRole       `json:"role" binding:"required"`
	Nickname      string                `json:"nickname" binding:"omitempty"`
	LawyerProfile *LawyerProfileRequest `json:"lawyer_profile,omitempty"`
}

// AuthResponse represents the response for authentication endpoints
type AuthResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

// VerifyEmailResponse represents the response for email verification
type VerifyEmailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// @Summary User login
// @Description Authenticates a user and returns a token
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body LoginRequest true "Login credentials"
// @Success 200 {object} AuthResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Invalid credentials or inactive account"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/login [post]
func LoginHandler(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Get the user by Email
	user, err := userService.GetUserByEmail(req.Email)
	if err != nil {
		responses.NewAPIResponse(c).Unauthorized("Invalid email or password", responses.ErrCodeInvalidCredentials)
		return
	}

	// Check if the user is active
	if !user.IsActive {
		responses.NewAPIResponse(c).Unauthorized("Account is inactive", responses.ErrCodeOperationFailed)
		return
	}

	// Check if email is verified
	if !user.EmailVerified {
		responses.NewAPIResponse(c).Unauthorized("Email not verified. Please check your email for verification instructions", responses.ErrCodeEmailNotVerified)
		return
	}

	// Compare the password using the utility service
	if err := utilService.ComparePassword(user.Password, req.Password); err != nil {
		responses.NewAPIResponse(c).Unauthorized("Invalid email or password", responses.ErrCodeInvalidCredentials)
		return
	}

	// Generate a token
	cfg := services.GetConfig()
	token, err := middleware.GenerateToken(user, cfg)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to generate token", responses.ErrCodeDatabaseError)
		return
	}

	// Hide the password
	user.Password = ""

	// Return the token and user
	responses.NewAPIResponse(c).OK(AuthResponse{
		Token: token,
		User:  user,
	})
}

// @Summary User registration
// @Description Registers a new user (client or lawyer)
// @Tags auth
// @Accept json
// @Produce json
// @Param user body RegisterRequest true "User registration details"
// @Success 201 {object} AuthResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or validation error"
// @Failure 409 {object} responses.APIErrorResponse "Email already exists"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/register [post]
func RegisterHandler(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Validate role
	if !req.Role.IsValid() {
		responses.NewAPIResponse(c).BadRequest("Invalid role", responses.ErrCodeInvalidRequest)
		return
	}
	if req.Role != models.RoleClient && req.Role != models.RoleLawyer {
		responses.NewAPIResponse(c).BadRequest("Only client and lawyer roles are allowed for registration", responses.ErrCodeInvalidRequest)
		return
	}

	// Check duplicate email
	userService := services.NewUserService()
	if _, err := userService.GetUserByEmail(req.Email); err == nil {
		responses.NewAPIResponse(c).BadRequest("Email already in use", responses.ErrCodeEmailIsAlreadyInUse)
		return
	}

	// Check if email belongs to a previously deleted user
	existsIncludingDeleted, err := userService.CheckEmailExistsIncludingDeleted(req.Email)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to check email availability", responses.ErrCodeDatabaseError)
		return
	}

	if existsIncludingDeleted {
		responses.NewAPIResponse(c).BadRequest("This email cannot be used for registration", responses.ErrCodeEmailIsAlreadyInUse)
		return
	}

	// Begin transaction
	tx := repository.DB.Begin()
	if tx.Error != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to begin transaction", responses.ErrCodeDatabaseError)
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	// Hash password
	hashedPassword, err := utilService.HashPassword(req.Password)
	if err != nil {
		tx.Rollback()
		responses.NewAPIResponse(c).InternalServerError("Failed to hash password", responses.ErrCodeDatabaseError)
		return
	}

	// Create user
	user := &models.User{
		Email:         req.Email,
		Password:      hashedPassword,
		Role:          req.Role.String(),
		Nickname:      &req.Nickname,
		FirstName:     nil,
		LastName:      nil,
		Gender:        nil,
		IsActive:      true,
		EmailVerified: false,
	}

	// Set name and gender if lawyer
	if req.Role == models.RoleLawyer && req.LawyerProfile != nil {
		user.FirstName = &req.LawyerProfile.FirstName
		user.LastName = &req.LawyerProfile.LastName
	}

	// Save user & send verification
	if cfg := services.GetConfig(); cfg.Email != nil {
		token, err := getEmailService().SetVerificationToken(user)
		if err != nil {
			tx.Rollback()
			responses.NewAPIResponse(c).InternalServerError("Failed to generate verification token", responses.ErrCodeDatabaseError)
			return
		}

		if err := tx.Create(user).Error; err != nil {
			tx.Rollback()
			responses.NewAPIResponse(c).InternalServerError("Failed to create user: "+err.Error(), responses.ErrCodeDatabaseError)
			return
		}

		if err := getEmailService().SendVerificationEmail(user, token); err != nil {
			tx.Rollback()
			responses.NewAPIResponse(c).InternalServerError("Failed to send verification email: "+err.Error(), responses.ErrCodeDatabaseError)
			return
		}
	} else {
		user.EmailVerified = true
		if err := tx.Create(user).Error; err != nil {
			tx.Rollback()
			responses.NewAPIResponse(c).InternalServerError("Failed to create user: "+err.Error(), responses.ErrCodeDatabaseError)
			return
		}
	}

	// If lawyer, create lawyer profile
	if req.Role == models.RoleLawyer && req.LawyerProfile != nil {
		lawyer := &models.Lawyer{
			UserID:                   user.ID,
			FullName:                 req.LawyerProfile.FirstName + " " + req.LawyerProfile.LastName,
			Affiliation:              &req.LawyerProfile.Affiliation,
			LawyerRegistrationNumber: &req.LawyerProfile.LawyerRegistrationNumber,
			Specialties:              models.StringArray{},
			Languages:                models.StringArray{},
		}

		if err := tx.Create(lawyer).Error; err != nil {
			tx.Rollback()
			responses.NewAPIResponse(c).InternalServerError("Failed to create lawyer profile: "+err.Error(), responses.ErrCodeDatabaseError)
			return
		}
	}

	// Commit
	if err := tx.Commit().Error; err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to commit transaction", responses.ErrCodeDatabaseError)
		return
	}

	// Return response
	user.Password = ""
	if user.EmailVerified {
		cfg := services.GetConfig()
		token, err := middleware.GenerateToken(user, cfg)
		if err != nil {
			responses.NewAPIResponse(c).InternalServerError("Failed to generate token", responses.ErrCodeDatabaseError)
			return
		}
		responses.NewAPIResponse(c).Created(AuthResponse{
			Token: token,
			User:  user,
		})
	} else {
		responses.NewAPIResponse(c).Created(gin.H{"user": user, "message": "Registration successful. Please check your email to verify your account."})
	}
}

// @Summary Verify email
// @Description Verifies a user's email using the token sent by email
// @Tags auth
// @Param token query string true "Verification token"
// @Success 200 {object} VerifyEmailResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid or expired token"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/verify-email [get]
func VerifyEmailHandler(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		responses.NewAPIResponse(c).BadRequest("Invalid verification token", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Find user by verification token
	user, err := userService.GetUserByVerificationToken(token)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid or expired verification token", responses.ErrCodeInvalidRequest)
		return
	}

	// Check if token is expired
	if user.VerificationExpiry == nil || user.VerificationExpiry.Before(time.Now()) {
		responses.NewAPIResponse(c).BadRequest("Verification token has expired", responses.ErrCodeInvalidRequest)
		return
	}

	// Mark email as verified and clear token
	updates := map[string]interface{}{
		"email_verified":      true,
		"verification_token":  nil,
		"verification_expiry": nil,
	}
	if err := userService.UpdateUser(user.ID, updates); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to verify email", responses.ErrCodeDatabaseError)
		return
	}

	// Return success response
	responses.NewAPIResponse(c).OK(VerifyEmailResponse{
		Success: true,
		Message: "Email successfully verified. You can now log in.",
	})
}

// @Summary Resend verification email
// @Description Resends the verification email to the user
// @Tags auth
// @Accept json
// @Produce json
// @Param email body ForgotPasswordRequest true "User email"
// @Success 200 {object} gin.H "Email sent message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/resend-verification-email [post]
func ResendVerificationEmailHandler(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()
	user, err := userService.GetUserByEmail(req.Email)
	if err != nil {
		responses.NewAPIResponse(c).OK(gin.H{
			"message": "Verification email has been sent. Please check your inbox.",
		})
		return
	}

	if user.EmailVerified {
		responses.NewAPIResponse(c).BadRequest("Email is already verified", responses.ErrCodeEmailIsAlreadyVerified)
		return
	}

	// Check if email service is configured
	if cfg := services.GetConfig(); cfg.Email == nil {
		// If email service is not configured, auto-verify the email
		updates := map[string]interface{}{
			"email_verified": true,
		}
		if err := userService.UpdateUser(user.ID, updates); err != nil {
			responses.NewAPIResponse(c).InternalServerError("Failed to verify email", responses.ErrCodeDatabaseError)
			return
		}

		responses.NewAPIResponse(c).OK(gin.H{
			"message": "Your email has been verified.",
		})
		return
	}

	// Generate new verification token
	token, err := getEmailService().SetVerificationToken(user)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to generate verification token", responses.ErrCodeDatabaseError)
		return
	}

	// Update user with new token
	updates := map[string]interface{}{
		"verification_token":  user.VerificationToken,
		"verification_expiry": user.VerificationExpiry,
	}
	if err := userService.UpdateUser(user.ID, updates); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update verification token", responses.ErrCodeDatabaseError)
		return
	}

	// Send verification email
	if err := getEmailService().SendVerificationEmail(user, token); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to send verification email", responses.ErrCodeOperationFailed)
		return
	}

	// Return success response
	responses.NewAPIResponse(c).OK(gin.H{
		"message": "Verification email has been sent. Please check your inbox.",
	})
}

// @Summary Get current user
// @Description Returns the profile of the currently authenticated user
// @Tags auth
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} responses.UserResponse
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/me [get]
func GetCurrentUserHandler(c *gin.Context) {
	// Get the user ID from the context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Get the user by ID
	user, err := userService.GetUserByID(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to get user", responses.ErrCodeDatabaseError)
		return
	}

	// Hide the password
	user.Password = ""

	// Create user response
	userResponse := responses.UserResponse{
		ID:                user.ID,
		Email:             user.Email,
		Nickname:          user.Nickname,
		FirstName:         user.FirstName,
		LastName:          user.LastName,
		ProfileImage:      user.ProfileImage,
		Role:              user.Role,
		CreatedAt:         user.CreatedAt,
		UpdatedAt:         user.UpdatedAt,
		HasNewAppointment: false, // Default to false
	}

	// Check for new appointments based on user role
	db := repository.DB
	var count int64

	// Check for new appointments if the user is a lawyer
	if user.Role == "lawyer" {
		// Find lawyer ID for this user
		lawyerService := services.NewLawyerService()
		lawyer, err := lawyerService.GetLawyerByUserID(user.ID)
		if err == nil && lawyer != nil {
			// Check if there are any unviewed appointments for the lawyer
			err := db.Model(&models.Appointment{}).Where("lawyer_id = ? AND is_lawyer_viewed = ?", lawyer.ID, false).Count(&count).Error
			if err == nil && count > 0 {
				userResponse.HasNewAppointment = true
			}
		}
	} else {
		// Check if there are any unviewed appointments for the client
		err := db.Model(&models.Appointment{}).Where("user_id = ? AND is_client_viewed = ?", user.ID, false).Count(&count).Error
		if err == nil && count > 0 {
			userResponse.HasNewAppointment = true
		}
	}

	// Return the user response
	responses.NewAPIResponse(c).OK(userResponse)
}

// @Summary User logout
// @Description Logs out the current user by invalidating their token
// @Tags auth
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H "Logged out successfully"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Router /auth/logout [post]
func LogoutHandler(c *gin.Context) {
	// Get current user ID from context
	_, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Clear the token from the context
	c.Set("token", "")

	responses.NewAPIResponse(c).OK(gin.H{"message": "Logged out successfully"})
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// @Summary Forgot password
// @Description Initiates the password reset process by sending an email with a reset token
// @Tags auth
// @Accept json
// @Produce json
// @Param email body ForgotPasswordRequest true "User email"
// @Success 200 {object} gin.H "Email sent message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/forgot-password [post]
func ForgotPasswordHandler(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	userService := services.NewUserService()
	user, err := userService.GetUserByEmail(req.Email)
	if err != nil {
		// always return 200 so clients can’t probe which emails exist
		responses.NewAPIResponse(c).OK(gin.H{
			"message": "If that email is in our system, you’ll get a reset link shortly.",
		})
		return
	}

	// generate a one-time reset token + expiry (e.g. 1h)
	token, err := services.GetEmailService().SetResetPasswordToken(user)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Couldn’t gen reset token", responses.ErrCodeDatabaseError)
		return
	}

	// persist token & expiry
	expiry := time.Now().Add(1 * time.Hour)
	updates := map[string]interface{}{
		"reset_password_token":  token,
		"reset_password_expiry": expiry,
	}
	if err := userService.UpdateUser(user.ID, updates); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Couldn’t save reset token", responses.ErrCodeDatabaseError)
		return
	}

	// send the email
	if err := services.GetEmailService().SendResetPasswordEmail(user, token); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Couldn’t send reset email", responses.ErrCodeOperationFailed)
		return
	}

	// done!
	responses.NewAPIResponse(c).OK(gin.H{
		"message": "If that email is in our system, you’ll get a reset link shortly.",
	})
}

type ResetPasswordRequest struct {
	Token    string `json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// @Summary Reset password
// @Description Resets user password using the token received via email
// @Tags auth
// @Accept json
// @Produce json
// @Param request body ResetPasswordRequest true "Reset password data"
// @Success 200 {object} gin.H "Password reset success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or expired token"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /auth/reset-password [post]
func ResetPasswordHandler(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	userService := services.NewUserService()
	user, err := userService.GetUserByResetPasswordToken(req.Token)
	if err != nil {
		// generic msg so attackers can’t enumerate tokens
		responses.NewAPIResponse(c).BadRequest("Invalid or expired token", responses.ErrCodeInvalidRequest)
		return
	}

	// check expiry
	if user.ResetPasswordExpiry == nil || user.ResetPasswordExpiry.Before(time.Now()) {
		responses.NewAPIResponse(c).BadRequest("Reset token has expired", responses.ErrCodeInvalidRequest)
		return
	}

	// hash the new password
	hashed, err := utilService.HashPassword(req.Password)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to hash password", responses.ErrCodeDatabaseError)
		return
	}

	// update the DB: set new pw + clear token & expiry
	updates := map[string]interface{}{
		"password":              hashed,
		"reset_password_token":  nil,
		"reset_password_expiry": nil,
	}
	if err := userService.UpdateUser(user.ID, updates); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to reset password", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{
		"message": "Your password has been reset successfully.",
	})
}
