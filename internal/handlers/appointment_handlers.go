package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

type CreateAppointmentRequest struct {
	LawyerID    int       `json:"lawyer_id" binding:"required"`
	Description *string   `json:"description,omitempty"`
	StartTime   time.Time `json:"start_time" binding:"required"`
	EndTime     time.Time `json:"end_time" binding:"required"`
	Notes       *string   `json:"notes,omitempty"`
}

type UpdateAppointmentRequest struct {
	Description  *string    `json:"description,omitempty"`
	StartTime    *time.Time `json:"start_time,omitempty"`
	EndTime      *time.Time `json:"end_time,omitempty"`
	Status       *string    `json:"status,omitempty" binding:"omitempty,oneof=pending confirmed cancelled completed rejected"`
	MeetingLink  *string    `json:"meeting_link,omitempty"`
	Notes        *string    `json:"notes,omitempty"`
	ChatEnabled  *bool      `json:"chat_enabled,omitempty"`
	CancelReason *string    `json:"cancel_reason,omitempty"`
	AdminReason  *string    `json:"admin_reason,omitempty"`
}

// @Summary Get appointments
// @Description Retrieves a paginated list of appointments with optional filtering
// @Tags appointments
// @Produce json
// @Security ApiKeyAuth
// @Param params[page] query int false "Page number" default(1)
// @Param params[limit] query int false "Number of items per page" default(10)
// @Param params[status] query string false "Filter by status (pending, confirmed, cancelled, completed, rejected)"
// @Param params[client_search] query string false "Search for client by name or email"
// @Param params[lawyer_search] query string false "Search for lawyer by name or email"
// @Param params[client_id] query int false "Filter by client ID"
// @Param params[start_date] query string false "Filter by start date (YYYY-MM-DD)"
// @Param params[end_date] query string false "Filter by end date (YYYY-MM-DD)"
// @Success 200 {object} responses.PaginatedResponse{data=[]responses.AppointmentResponse}
// @Failure 400 {object} responses.APIErrorResponse "Invalid request parameters"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments [get]
func GetAppointmentsHandler(c *gin.Context) {

	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	page, _ := strconv.Atoi(c.DefaultQuery("params[page]", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("params[limit]", "10"))

	statusFilter := c.Query("params[status]")
	clientSearch := c.Query("params[client_search]")

	var clientId int
	if clientIDStr, exists := c.GetQuery("params[client_id]"); exists {
		id, err := strconv.Atoi(clientIDStr)
		if err != nil {
			responses.NewAPIResponse(c).
				BadRequest("invalid client_id", responses.ErrCodeInvalidRequest)
			return
		}
		clientId = id
	}

	lawyerSearch := c.Query("params[lawyer_search]")

	const dateOnly = "2006-01-02"
	var startDate, endDate time.Time

	if s := c.Query("params[start_date]"); s != "" {
		t, err := time.Parse(dateOnly, s)
		if err != nil {
			responses.NewAPIResponse(c).
				BadRequest("invalid start_date, use YYYY-MM-DD", responses.ErrCodeInvalidRequest)
			return
		}
		startDate = t
	}

	if e := c.Query("params[end_date]"); e != "" {
		t, err := time.Parse(dateOnly, e)
		if err != nil {
			responses.NewAPIResponse(c).
				BadRequest("invalid end_date, use YYYY-MM-DD", responses.ErrCodeInvalidRequest)
			return
		}
		// include entire day
		endDate = t.Add(24*time.Hour - time.Nanosecond)
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	} else if limit > 100 {
		limit = 100
	}

	appointmentService := services.NewAppointmentService()

	var appointments []responses.AppointmentResponse
	var err error
	var totalItems int64

	if userRole == "lawyer" {
		lawyerService := services.NewLawyerService()
		lawyer, err := lawyerService.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
			return
		}

		appointments, totalItems, err = appointmentService.GetAppointmentsByLawyerID(lawyer.ID, statusFilter, page, limit)

	} else if userRole == "admin" {
		appointments, totalItems, err = appointmentService.GetAllAppointments(
			statusFilter,
			clientSearch,
			lawyerSearch,
			clientId,
			startDate,
			endDate,
			page,
			limit,
		)
	} else {

		appointments, totalItems, err = appointmentService.GetAppointmentsByUserID(userID, statusFilter, page, limit)
	}

	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve appointments", responses.ErrCodeDatabaseError)
		return
	}

	totalPages := (int(totalItems) + limit - 1) / limit

	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		appointments,
		page,
		limit,
		int(totalItems),
		totalPages,
	)
}

// @Summary Get appointment by ID
// @Description Retrieves details of a specific appointment by ID
// @Tags appointments
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Success 200 {object} responses.AppointmentResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid appointment ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - no access to this appointment"
// @Failure 404 {object} responses.APIErrorResponse "Appointment not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id} [get]
func GetAppointmentByIDHandler(c *gin.Context) {

	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}

	appointmentService := services.NewAppointmentService()

	appointment, err := appointmentService.GetAppointmentByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
		return
	}

	if userRole == "lawyer" {

		lawyerService := services.NewLawyerService()

		lawyer, err := lawyerService.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
			return
		}

		if appointment.LawyerID != lawyer.ID {
			responses.NewAPIResponse(c).Forbidden("You do not have access to this appointment", responses.ErrCodeForbidden)
			return
		}

		// Mark appointment as viewed by lawyer when a lawyer accesses it
		if !appointment.IsLawyerViewed {
			// Update IsLawyerViewed to true
			err = appointmentService.DB.Model(&appointment).Update("is_lawyer_viewed", true).Error
			if err != nil {
				// Log the error but don't break the flow, still show the appointment
				fmt.Printf("Failed to update appointment lawyer viewed status: %v\n", err)
			}
			// Update the local appointment object too
			appointment.IsLawyerViewed = true
		}
	} else {

		if appointment.UserID != userID {
			responses.NewAPIResponse(c).Forbidden("You do not have access to this appointment", responses.ErrCodeForbidden)
			return
		}

		// Mark appointment as viewed by client when a client accesses it
		if !appointment.IsClientViewed {
			// Update IsClientViewed to true
			err = appointmentService.DB.Model(&appointment).Update("is_client_viewed", true).Error
			if err != nil {
				// Log the error but don't break the flow, still show the appointment
				fmt.Printf("Failed to update appointment client viewed status: %v\n", err)
			}
			// Update the local appointment object too
			appointment.IsClientViewed = true
		}
	}

	appointmentResponse, err := appointmentService.GetAppointmentResponseByID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve appointment details", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(appointmentResponse)
}

// @Summary Create new appointment
// @Description Creates a new appointment
// @Tags appointments
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param appointment body CreateAppointmentRequest true "Appointment details"
// @Success 201 {object} responses.AppointmentResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or validation error"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer not found"
// @Failure 409 {object} responses.APIErrorResponse "Time slot not available"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments [post]
func CreateAppointmentHandler(c *gin.Context) {

	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	var req CreateAppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	req.StartTime = req.StartTime.UTC()
	req.EndTime = req.EndTime.UTC()
	if req.StartTime.After(req.EndTime) || req.StartTime.Equal(req.EndTime) {
		responses.NewAPIResponse(c).BadRequest("Start time must be before end time", responses.ErrCodeInvalidRequest)
		return
	}

	// Check if appointment is being booked at least 2 full days in advance
	now := time.Now().UTC()
	// Get tomorrow's date and reset to midnight
	tomorrow := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	// Add 2 more days to get the minimum booking time (2 full days from tomorrow)
	minBookingTime := tomorrow.AddDate(0, 0, 2)
	if req.StartTime.Before(minBookingTime) {
		responses.NewAPIResponse(c).BadRequest("Appointments must be booked at least 2 full days in advance", responses.ErrCodeInvalidRequest)
		return
	}

	lawyerService := services.NewLawyerService()
	lawyer, err := lawyerService.GetLawyerByID(req.LawyerID)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Lawyer not found", responses.ErrCodeResourceNotFound)
		return
	}

	appointmentService := services.NewAppointmentService()
	available, err := appointmentService.CheckAvailability(lawyer.ID, req.StartTime, req.EndTime)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to check lawyer availability", responses.ErrCodeDatabaseError)
		return
	}

	if !available {
		responses.NewAPIResponse(c).BadRequest("Lawyer is not available at the requested time", responses.ErrCodeInvalidRequest)
		return
	}

	appointment := models.Appointment{
		UserID:         userID,
		LawyerID:       req.LawyerID,
		Description:    req.Description,
		StartTime:      req.StartTime,
		EndTime:        req.EndTime,
		Status:         "pending",
		IsClientViewed: true,
		Notes:          req.Notes,
	}

	err = appointmentService.CreateAppointment(&appointment)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to create appointment", responses.ErrCodeDatabaseError)
		return
	}

	// fetch client info for nickname
	userService := services.NewUserService()
	clientUser, _ := userService.GetUserByID(userID)
	clientNickname := ""
	if clientUser != nil && clientUser.Nickname != nil {
		clientNickname = *clientUser.Nickname
	} else if clientUser != nil {
		clientNickname = clientUser.Email
	}

	// send notification email to lawyer (non-blocking error handling)
	if err := services.GetEmailService().SendNewAppointmentEmail(*lawyer, appointment, clientNickname); err != nil {
		fmt.Println("Failed to send new appointment email:", err)
	}

	responses.NewAPIResponse(c).Created(appointment)
}

// @Summary Update appointment
// @Description Updates an existing appointment
// @Tags appointments
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Param appointment body UpdateAppointmentRequest true "Updated appointment details"
// @Success 200 {object} responses.AppointmentResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or validation error"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - no access to update this appointment"
// @Failure 404 {object} responses.APIErrorResponse "Appointment not found"
// @Failure 409 {object} responses.APIErrorResponse "Time slot not available"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id} [put]
func UpdateAppointmentHandler(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}

	appointmentService := services.NewAppointmentService()

	existingAppointment, err := appointmentService.GetAppointmentByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
		return
	}

	if userRole == "lawyer" {
		lawyerService := services.NewLawyerService()

		lawyer, err := lawyerService.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
			return
		}

		if existingAppointment.LawyerID != lawyer.ID {
			responses.NewAPIResponse(c).Forbidden("You do not have access to update this appointment", responses.ErrCodeForbidden)
			return
		}
	} else if userRole != "admin" && userRole != "client" {
		responses.NewAPIResponse(c).Forbidden("You do not have access to update this appointment", responses.ErrCodeForbidden)
		return
	}

	var req UpdateAppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	if userRole == "client" {
		if req.Description != nil || req.StartTime != nil ||
			req.EndTime != nil || req.MeetingLink != nil || req.Notes != nil || req.ChatEnabled != nil {
			responses.NewAPIResponse(c).Forbidden("Clients can only update the status field", responses.ErrCodeForbidden)
			return
		}
		if req.Status == nil || *req.Status != "cancelled" {
			responses.NewAPIResponse(c).Forbidden("Clients can only cancel appointments by setting status to 'cancelled'", responses.ErrCodeForbidden)
			return
		}

		if req.CancelReason != nil {
			existingAppointment.CancelReason = req.CancelReason
		}

		// Check if cancellation is being done at least 2 days before the appointment
		now := time.Now().UTC()
		// Calculate the cutoff time (2 days before appointment)
		cutoffTime := existingAppointment.StartTime.AddDate(0, 0, -2)
		if now.After(cutoffTime) {
			responses.NewAPIResponse(c).BadRequest("Appointments can only be cancelled up to 2 days before the appointment date", responses.ErrCodeInvalidRequest)
			return
		}
	} else {
		newStartTime := existingAppointment.StartTime
		newEndTime := existingAppointment.EndTime
		if req.StartTime != nil {
			newStartTime = *req.StartTime
		}
		if req.EndTime != nil {
			newEndTime = *req.EndTime
		}

		if !newStartTime.Before(newEndTime) {
			responses.NewAPIResponse(c).BadRequest("Start time must be before end time", responses.ErrCodeInvalidRequest)
			return
		}

		newStatus := existingAppointment.Status
		if req.Status != nil {
			newStatus = *req.Status
		}

		if newStatus != "cancelled" &&
			((req.StartTime != nil && !req.StartTime.Equal(existingAppointment.StartTime)) ||
				(req.EndTime != nil && !req.EndTime.Equal(existingAppointment.EndTime))) {

			available, err := appointmentService.CheckAvailability(existingAppointment.LawyerID, newStartTime, newEndTime)
			if err != nil {
				responses.NewAPIResponse(c).InternalServerError("Failed to check lawyer availability", responses.ErrCodeDatabaseError)
				return
			}
			if !available {
				responses.NewAPIResponse(c).BadRequest("Lawyer is not available at the requested time", responses.ErrCodeInvalidRequest)
				return
			}
		}
	}

	if req.Description != nil {
		existingAppointment.Description = req.Description
	}
	if req.StartTime != nil {
		existingAppointment.StartTime = *req.StartTime
	}
	if req.EndTime != nil {
		existingAppointment.EndTime = *req.EndTime
	}
	if req.Status != nil {
		existingAppointment.Status = *req.Status
	}
	if req.MeetingLink != nil {
		existingAppointment.MeetingLink = req.MeetingLink
	}
	if req.Notes != nil {
		existingAppointment.Notes = req.Notes
	}
	if req.ChatEnabled != nil {
		existingAppointment.ChatEnabled = *req.ChatEnabled
	}
	if req.AdminReason != nil && userRole == "admin" && req.Status != nil {
		existingAppointment.AdminReason = req.AdminReason
	}
	// If the appointment is being cancelled, set the cancel reason
	if req.Status != nil && *req.Status == "cancelled" {
		existingAppointment.CancelReason = req.CancelReason
	}

	if err := appointmentService.UpdateAppointment(existingAppointment); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to update appointment", responses.ErrCodeDatabaseError)
		return
	}

	existingAppointment, _ = appointmentService.GetAppointmentByID(existingAppointment.ID)

	// Send email notifications if status was updated
	if req.Status != nil {
		if userRole == "lawyer" {
			// Use the appointment service to send email to client
			if err := appointmentService.SendLawyerAppointmentStatusUpdateEmail(existingAppointment, *req.Status); err != nil {
				// Just log the error, don't fail the request
				fmt.Printf("Failed to send appointment status update email: %v\n", err)
			}
		} else if (userRole == "client" || userRole == "admin") && *req.Status == "cancelled" {
			// Send notification to lawyer when client cancels an appointment
			if err := appointmentService.SendAppointmentCancelledEmail(existingAppointment); err != nil {
				// Just log the error, don't fail the request
				fmt.Printf("Failed to send appointment cancellation notification: %v\n", err)
			}
		} else if userRole == "admin" {
			// Use appointment service to notify both parties
			if err := appointmentService.SendAppointmentStatusUpdateEmails(existingAppointment, *req.Status); err != nil {
				// Just log the error, don't fail the request
				fmt.Printf("Failed to send appointment status update emails: %v\n", err)
			}
		}
	}

	updatedResponse, err := appointmentService.GetAppointmentResponseByID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve updated appointment", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(updatedResponse)
}

// @Summary Delete appointment
// @Description Deletes an appointment by ID
// @Tags appointments
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Success 200 {object} gin.H "Success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid appointment ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - no access to delete this appointment"
// @Failure 404 {object} responses.APIErrorResponse "Appointment not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id} [delete]
func DeleteAppointmentHandler(c *gin.Context) {

	_, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	if userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only administrators can delete appointments", responses.ErrCodeForbidden)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}

	appointmentService := services.NewAppointmentService()

	err = appointmentService.DeleteAppointment(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to delete appointment", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Appointment deleted successfully"})
}

// @Summary Get upcoming appointments
// @Description Retrieves a list of upcoming appointments for the current user
// @Tags appointments
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {array} responses.AppointmentResponse
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 404 {object} responses.APIErrorResponse "User profile not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/upcoming [get]
func GetUpcomingAppointmentsHandler(c *gin.Context) {

	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	appointmentService := services.NewAppointmentService()

	var appointments []responses.AppointmentResponse
	var err error

	if userRole == "lawyer" {

		lawyerService := services.NewLawyerService()

		lawyer, err := lawyerService.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
			return
		}

		appointments, err = appointmentService.GetUpcomingAppointments(lawyer.ID, true)
	} else {

		appointments, err = appointmentService.GetUpcomingAppointments(userID, false)
	}

	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to retrieve upcoming appointments", responses.ErrCodeDatabaseError)
		return
	}

	totalItems := len(appointments)
	totalPages := (totalItems + limit - 1) / limit

	start := (page - 1) * limit
	end := start + limit
	if start >= len(appointments) {
		appointments = []responses.AppointmentResponse{}
	} else if end > len(appointments) {
		appointments = appointments[start:]
	} else {
		appointments = appointments[start:end]
	}

	responses.NewAPIResponse(c).Paginated(
		http.StatusOK,
		appointments,
		page,
		limit,
		totalItems,
		totalPages,
	)
}

// @Summary Get available time slots
// @Description Gets available time slots for a lawyer on a specific date
// @Tags appointments
// @Produce json
// @Param lawyer_id query int true "Lawyer ID"
// @Param date query string true "Date in YYYY-MM-DD format"
// @Param timezone query string false "Timezone name (e.g. 'Asia/Tokyo')"
// @Success 200 {array} services.TimeSlot "List of available time slots"
// @Failure 400 {object} responses.APIErrorResponse "Invalid parameters"
// @Failure 404 {object} responses.APIErrorResponse "Lawyer not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/available-slots [get]
func GetAvailableTimeSlotsHandler(c *gin.Context) {
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to load location data", responses.ErrCodeInvalidRequest)
		return
	}

	lawyerIDStr := c.Query("lawyer_id")
	dateStr := c.Query("date") // Expected format: YYYY-MM-DD

	if lawyerIDStr == "" {
		responses.NewAPIResponse(c).
			BadRequest("Missing lawyer_id parameter", responses.ErrCodeInvalidRequest)
		return
	}
	if dateStr == "" {
		responses.NewAPIResponse(c).
			BadRequest("Missing date parameter", responses.ErrCodeInvalidRequest)
		return
	}

	lawyerID, err := strconv.Atoi(lawyerIDStr)
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid lawyer_id parameter: not a number", responses.ErrCodeInvalidRequest)
		return
	}

	// Parse the date string using the loaded location.
	// This ensures 'selectedDate' is a time.Time object representing the start of that day in 'loc'.
	selectedDate, err := time.ParseInLocation("2006-01-02", dateStr, loc)
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid date format, expected YYYY-MM-DD", responses.ErrCodeInvalidRequest)
		return
	}

	appointmentService := services.NewAppointmentService() // Assuming NewAppointmentService() initializes DB access correctly

	slots, err := appointmentService.GetAvailableTimeSlots(lawyerID, selectedDate)
	if err != nil {
		// Handle specific errors from the service if needed, e.g., lawyer not found
		if strings.Contains(err.Error(), "not found") {
			responses.NewAPIResponse(c).
				NotFound(err.Error(), responses.ErrCodeResourceNotFound)
			return
		}
		responses.NewAPIResponse(c).
			InternalServerError("Failed to retrieve available time slots: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	if slots == nil { // Should ideally return empty slice instead of nil from service for consistency
		slots = []services.TimeSlot{}
	}

	responses.NewAPIResponse(c).OK(slots)
}

type RejectAppointmentRequest struct {
	Reason string `json:"reason" binding:"required"`
}

// @Summary Reject appointment
// @Description Rejects an appointment with a reason (lawyer or admin only)
// @Tags appointments
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Param rejection body RejectAppointmentRequest true "Rejection details"
// @Success 200 {object} responses.AppointmentResponse
// @Failure 400 {object} responses.APIErrorResponse "Invalid request or already cancelled/rejected"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden - only lawyers or admins can reject"
// @Failure 404 {object} responses.APIErrorResponse "Appointment or profile not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id}/reject [post]
func RejectAppointmentHandler(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Authentication required", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)
	if userRole != "lawyer" && userRole != "admin" {
		responses.NewAPIResponse(c).Forbidden("Only lawyers or admins can reject appointments", responses.ErrCodeForbidden)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}

	var req RejectAppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil || strings.TrimSpace(req.Reason) == "" {
		responses.NewAPIResponse(c).BadRequest("Reason is required", responses.ErrCodeInvalidRequest)
		return
	}

	appointmentService := services.NewAppointmentService()
	appointment, err := appointmentService.GetAppointmentByID(id)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
		return
	}

	// If lawyer, check they own the appointment
	if userRole == "lawyer" {
		lawyerService := services.NewLawyerService()
		lawyer, err := lawyerService.GetLawyerByUserID(userID)
		if err != nil {
			responses.NewAPIResponse(c).NotFound("Lawyer profile not found", responses.ErrCodeResourceNotFound)
			return
		}
		if appointment.LawyerID != lawyer.ID {
			responses.NewAPIResponse(c).Forbidden("You do not have access to reject this appointment", responses.ErrCodeForbidden)
			return
		}
	}

	if appointment.Status == "cancelled" || appointment.Status == "rejected" {
		responses.NewAPIResponse(c).BadRequest("Appointment is already cancelled or rejected", responses.ErrCodeInvalidRequest)
		return
	}

	if err := appointmentService.RejectAppointment(id, req.Reason); err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to reject appointment", responses.ErrCodeDatabaseError)
		return
	}

	// Send email notification when lawyer rejects appointment
	if userRole == "lawyer" {
		appointment, _ := appointmentService.GetAppointmentByID(id)
		if err := appointmentService.SendLawyerAppointmentStatusUpdateEmail(appointment, "rejected"); err != nil {
			// Just log the error, don't fail the request
			fmt.Printf("Failed to send appointment rejection email: %v\n", err)
		}
	}

	updated, err := appointmentService.GetAppointmentResponseByID(id)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError("Failed to fetch updated appointment", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(updated)
}
