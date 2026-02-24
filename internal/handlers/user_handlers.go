package handlers

import (
	"fmt"
	"github.com/kotolino/lawyer/internal/models"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
)

// UpdateUserStatusRequest represents the request to update a user's status
type UpdateUserStatusRequest struct {
	IsActive bool `json:"is_active"`
}

// UpdateUserRoleRequest represents the request to update a user's role
type UpdateUserRoleRequest struct {
	Role string `json:"role" binding:"required,oneof=client admin"`
}

// PasswordUpdateRequest represents the request to update a user's password
type PasswordUpdateRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
}

// @Summary Get all users
// @Description Returns a paginated list of users (admin only)
// @Tags users
// @Produce json
// @Security ApiKeyAuth
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Number of items per page" default(10)
// @Param search query string false "Search term"
// @Param sort query string false "Field to sort by" default(id)
// @Param order query string false "Sort direction ('asc' or 'desc')" default(asc)
// @Success 200 {object} responses.PaginatedResponse{data=[]models.User}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users [get]
// GetUsersHandler returns a list of users
func GetUsersHandler(c *gin.Context) {
	// Get the user role from the context
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only administrators can view user list", responses.ErrCodeForbidden)
		return
	}

	// Parse pagination parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.Query("search")               // Get search parameter
	sortField := c.DefaultQuery("sort", "id") // Default sort by id
	sortDir := c.DefaultQuery("order", "asc") // Default ascending order

	// Normalize sortDir
	if sortDir != "desc" {
		sortDir = "asc"
	}

	// Ensure valid pagination values
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	// Get the user service
	userService := services.NewUserService()

	// Get the users with pagination, search and sorting
	users, total, err := userService.GetUsers(page, limit, search, sortField, sortDir)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve users", responses.ErrCodeDatabaseError)
		return
	}

	// Calculate total pages
	totalPages := (int(total) + limit - 1) / limit

	// Return paginated response
	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		users,
		page,
		limit,
		int(total),
		totalPages,
	)
}

// @Summary Get user by ID
// @Description Returns a user by ID (admin or own user only)
// @Tags users
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Success 200 {object} models.User
// @Failure 400 {object} responses.APIErrorResponse "Invalid user ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Router /users/{id} [get]
// GetUserByIDHandler returns a user by ID
func GetUserByIDHandler(c *gin.Context) {
	// Get the user role from the context
	userRole, ok := middleware.GetUserRole(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the current user ID from the context
	currentUserID, _ := middleware.GetUserID(c)

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Check if the user has access to view this user
	if userRole != "admin" && currentUserID != id {
		responses.NewAPIResponse(c).Forbidden("You do not have access to view this user", responses.ErrCodeForbidden)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Get the user
	user, err := userService.GetUserByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("User not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Hide the password
	user.Password = ""

	// Return the user
	responses.NewAPIResponse(c).OK(user)
}

// @Summary Update user
// @Description Updates a user's profile information (admin or own user only)
// @Tags users
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Param user body models.User true "Updated user information"
// @Success 200 {object} models.User
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id} [put]
// UpdateUserHandler updates a user
func UpdateUserHandler(c *gin.Context) {
	// Get the user role from the context
	userRole, ok := middleware.GetUserRole(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the current user ID from the context
	currentUserID, _ := middleware.GetUserID(c)

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Check if the user has access to update this user
	if userRole != "admin" && currentUserID != id {
		responses.NewAPIResponse(c).Forbidden("You do not have access to update this user", responses.ErrCodeForbidden)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Check if the user exists
	_, err = userService.GetUserByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("User not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Parse the request body
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Restrict updating of some fields
	if userRole != "admin" {
		delete(req, "role")
		delete(req, "is_active")
	}

	// Delete fields that cannot be updated
	delete(req, "id")
	delete(req, "password")
	delete(req, "created_at")
	delete(req, "updated_at")

	// Add updated_at field
	req["updated_at"] = time.Now()

	// Update the user
	err = userService.UpdateUser(id, req)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update user", responses.ErrCodeDatabaseError)
		return
	}

	// Get the updated user
	updatedUser, err := userService.GetUserByID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve updated user", responses.ErrCodeDatabaseError)
		return
	}

	// Hide the password
	updatedUser.Password = ""

	// Return the updated user
	responses.NewAPIResponse(c).OK(updatedUser)
}

// @Summary Delete user
// @Description Deletes a user (admin only)
// @Tags users
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid user ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id} [delete]
// DeleteUserHandler deletes a user
func DeleteUserHandler(c *gin.Context) {
	// Get the user role from the context
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only administrators can delete users", responses.ErrCodeForbidden)
		return
	}

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Delete the user
	err = userService.DeleteUser(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete user", responses.ErrCodeDatabaseError)
		return
	}

	// Return success
	responses.NewAPIResponse(c).OK(gin.H{"message": "User deleted successfully"})
}

// @Summary Update password
// @Description Updates a user's password (admin or own user only)
// @Tags users
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Param password body PasswordUpdateRequest true "Password update details"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required or incorrect current password"
// @Failure 403 {object} responses.APIErrorResponse "Permission denied"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id}/password [put]
// UpdatePasswordHandler updates a user's password
func UpdatePasswordHandler(c *gin.Context) {
	// Get the current user ID from the context
	currentUserID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user role from the context
	userRole, _ := middleware.GetUserRole(c)

	// Check if the user has access to update this user's password
	if userRole != "admin" && currentUserID != id {
		responses.NewAPIResponse(c).Forbidden("You do not have access to update this user's password", responses.ErrCodeForbidden)
		return
	}

	// Parse the request body
	var req PasswordUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Update the password
	err = userService.UpdatePassword(id, req.CurrentPassword, req.NewPassword, userRole == "admin")
	if err != nil {
		if err.Error() == "current password is incorrect" {
			responses.NewAPIResponse(c).BadRequest("Current password is incorrect", responses.ErrCodeInvalidRequest)
		} else {
			responses.NewAPIResponse(c).InternalServerError("Failed to update password", responses.ErrCodeDatabaseError)
		}
		return
	}

	// Return success
	responses.NewAPIResponse(c).OK(gin.H{"message": "Password updated successfully"})
}

// @Summary Update user status
// @Description Updates a user's active status (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Param status body UpdateUserStatusRequest true "Status update details"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id}/status [put]
// UpdateUserStatusHandler updates a user's active status (admin only)
func UpdateUserStatusHandler(c *gin.Context) {
	// Check if the user is an admin
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only administrators can update user status", responses.ErrCodeForbidden)
		return
	}

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Parse the request body
	var req UpdateUserStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Update the user status
	err = userService.UpdateUserStatus(id, req.IsActive)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update user status", responses.ErrCodeDatabaseError)
		return
	}

	// Send notification email based on the account status (locked or unlocked)
	// !req.IsActive means the account is locked, req.IsActive means it's unlocked
	err = userService.SendAccountStatusNotificationEmail(id, !req.IsActive)
	if err != nil {
		// Just log the error, don't fail the API call
		fmt.Printf("Error sending account status notification email: %v\n", err)
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "User status updated successfully"})
}

// @Summary Update user role
// @Description Updates a user's role (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "User ID"
// @Param role body UpdateUserRoleRequest true "Role update details"
// @Success 200 {object} gin.H{message=string}
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 404 {object} responses.APIErrorResponse "User not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/{id}/role [put]
// UpdateUserRoleHandler updates a user's role (admin only)
func UpdateUserRoleHandler(c *gin.Context) {
	// Check if the user is an admin
	userRole, ok := middleware.GetUserRole(c)
	if !ok || userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only administrators can update user roles", responses.ErrCodeForbidden)
		return
	}

	// Get the user ID from the URL
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid user ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Parse the request body
	var req UpdateUserRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Get the user service
	userService := services.NewUserService()

	// Get the existing user
	user, err := userService.GetUserByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("User not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Update the user role
	user.Role = req.Role

	// Update the user
	err = userService.UpdateUser(id, map[string]interface{}{"role": req.Role})
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update user role", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "User role updated successfully"})
}

type CreateUserRequest struct {
	Email     string  `json:"email" binding:"required,email"`
	Password  string  `json:"password" binding:"required,min=6"`
	Role      string  `json:"role" binding:"required,oneof=client lawyer"`
	FirstName *string `json:"first_name,omitempty"`
	LastName  *string `json:"last_name,omitempty"`
}

// @Summary Create user
// @Description Creates a new user (admin only)
// @Tags users
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param user body CreateUserRequest true "User creation details"
// @Success 201 {object} models.User
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users [post]
// CreateUserHandler allows an admin to spin up a new user
func CreateUserHandler(c *gin.Context) {
	// 1) check admin
	if role, ok := middleware.GetUserRole(c); !ok || role != "admin" {
		responses.NewAPIResponse(c).
			Forbidden("Only administrators can create users", responses.ErrCodeForbidden)
		return
	}

	var req CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).
			BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	u := &models.User{
		Email:     req.Email,
		Password:  req.Password,
		Role:      req.Role,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		IsActive:  true,
	}

	userSvc := services.NewUserService()
	if err := userSvc.CreateUser(u); err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to create user", responses.ErrCodeDatabaseError)
		return
	}

	u.Password = ""

	// 6) return 201
	responses.NewAPIResponse(c).
		Created(u)
}

// @Summary Upload profile image
// @Description Uploads or updates a user's profile image
// @Tags users
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param image formData file true "Profile image file"
// @Success 200 {object} gin.H{profile_image=string}
// @Failure 400 {object} responses.APIErrorResponse "Missing or invalid image file"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /users/profile-image [post]
// UploadProfileImageHandler uploads a lawyer's profile pic (overwriting old one).
func UploadProfileImageHandler(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).
			Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	file, header, err := c.Request.FormFile("image")
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("No image uploaded: "+err.Error(), responses.ErrCodeInvalidRequest)
		return
	}
	defer file.Close()

	ext := filepath.Ext(header.Filename)
	key := fmt.Sprintf("lawyers/%d/profile_%d%s", userID, time.Now().UnixNano(), ext)

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
			InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	userSvc := services.NewUserService()
	if err := userSvc.UpdateUser(userID, map[string]interface{}{
		"profile_image": location,
	}); err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("DB update failed: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).
		OK(gin.H{"profile_image": location})
}
