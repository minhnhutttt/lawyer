package services

import (
	"bytes"
	"errors"
	"fmt"
	"net/smtp"
	"strconv"
	"strings"
	"time"

	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
	"gorm.io/gorm"
)

type AppointmentService struct {
	DB *gorm.DB
}

func NewAppointmentService() *AppointmentService {
	return &AppointmentService{
		DB: repository.DB,
	}
}

func (s *AppointmentService) GetAppointmentByID(id int) (*models.Appointment, error) {
	if id <= 0 {
		return nil, errors.New("invalid appointment ID")
	}

	var appointment models.Appointment
	result := s.DB.First(&appointment, id)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errors.New("appointment not found")
		}
		return nil, result.Error
	}

	return &appointment, nil
}

func (s *AppointmentService) GetAppointmentResponseByID(id int) (*responses.AppointmentResponse, error) {
	appointment, err := s.GetAppointmentByID(id)
	if err != nil {
		return nil, err
	}

	var lawyer models.Lawyer
	if err := s.DB.Preload("User").First(&lawyer, appointment.LawyerID).Error; err != nil {
		return nil, err
	}

	var client models.User
	if err := s.DB.First(&client, appointment.UserID).Error; err != nil {
		return nil, err
	}

	response := &responses.AppointmentResponse{
		ID:           appointment.ID,
		UserID:       appointment.UserID,
		Description:  appointment.Description,
		StartTime:    appointment.StartTime,
		EndTime:      appointment.EndTime,
		Status:       appointment.Status,
		Notes:        appointment.Notes,
		ChatEnabled:  appointment.ChatEnabled,
		RejectReason: appointment.RejectReason,
		CancelReason: appointment.CancelReason,
		CreatedAt:    appointment.CreatedAt,
		UpdatedAt:    appointment.UpdatedAt,
		Lawyer: responses.LawyerBrief{
			ID:               lawyer.ID,
			UserID:           lawyer.UserID,
			FullName:         lawyer.FullName,
			OfficeName:       lawyer.OfficeName,
			AreasOfExpertise: lawyer.AreasOfExpertise,
			Affiliation:      lawyer.Affiliation,
			ProfileImage:     lawyer.User.ProfileImage,
			ProfileText:      lawyer.ProfileText,
			UserActive:       lawyer.User.IsActive,
		},
		Client: responses.UserProfile{
			ID:           client.ID,
			Nickname:     client.Nickname,
			Email:        client.Email,
			ProfileImage: client.ProfileImage,
			IsActive:     client.IsActive,
		},
	}

	return response, nil
}

func (s *AppointmentService) GetAppointmentsByUserID(userID int, statusFilter string, page, limit int) ([]responses.AppointmentResponse, int64, error) {
	if userID <= 0 {
		return nil, 0, errors.New("invalid user ID")
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	var appointments []models.Appointment
	var totalItems int64

	query := s.DB.Model(&models.Appointment{}).Where("appointments.user_id = ?", userID)

	if statusFilter != "" {

		query = query.Where("appointments.status = ?", statusFilter)
	}

	err := query.Count(&totalItems).Error
	if err != nil {

		return nil, 0, errors.New("failed to count appointments")
	}

	if totalItems == 0 {
		return []responses.AppointmentResponse{}, 0, nil
	}

	offset := (page - 1) * limit
	result := query.Order("appointments.start_time DESC").
		Offset(offset).
		Limit(limit).
		Find(&appointments)

	if result.Error != nil {

		return nil, 0, errors.New("failed to retrieve appointments")
	}

	lawyerIDs := make([]int, len(appointments))
	for i, app := range appointments {
		lawyerIDs[i] = app.LawyerID
	}

	var lawyers []models.Lawyer
	lawyerMap := make(map[int]models.Lawyer)
	if len(lawyerIDs) > 0 {
		if err := s.DB.Where("id IN ?", lawyerIDs).Find(&lawyers).Error; err != nil {

			return nil, 0, errors.New("failed to retrieve lawyer details")
		}
		for _, lawyer := range lawyers {
			lawyerMap[lawyer.ID] = lawyer
		}
	}

	responseList := make([]responses.AppointmentResponse, len(appointments))
	for i, appointment := range appointments {

		var lawyer models.Lawyer

		lawyer = lawyerMap[appointment.LawyerID]

		responseList[i] = responses.AppointmentResponse{
			ID:             appointment.ID,
			Description:    appointment.Description,
			StartTime:      appointment.StartTime,
			EndTime:        appointment.EndTime,
			Status:         appointment.Status,
			Notes:          appointment.Notes,
			ChatEnabled:    appointment.ChatEnabled,
			IsLawyerViewed: appointment.IsLawyerViewed,
			IsClientViewed: appointment.IsClientViewed,
			CreatedAt:      appointment.CreatedAt,
			UpdatedAt:      appointment.UpdatedAt,
			Lawyer: responses.LawyerBrief{
				ID:               lawyer.ID,
				UserID:           lawyer.UserID,
				FullName:         lawyer.FullName,
				OfficeName:       lawyer.OfficeName,
				AreasOfExpertise: lawyer.AreasOfExpertise,
				Affiliation:      lawyer.Affiliation,
			},
		}
	}

	return responseList, totalItems, nil
}

func (s *AppointmentService) GetAppointmentsByLawyerID(lawyerID int, statusFilter string, page, limit int) ([]responses.AppointmentResponse, int64, error) {
	if lawyerID <= 0 {
		return nil, 0, errors.New("invalid lawyer ID")
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	var appointments []models.Appointment
	var totalItems int64

	query := s.DB.Model(&models.Appointment{}).Where("appointments.lawyer_id = ?", lawyerID)

	if statusFilter != "" {
		query = query.Where("appointments.status = ?", statusFilter)
	}

	err := query.Count(&totalItems).Error
	if err != nil {

		return nil, 0, errors.New("failed to count appointments")
	}

	if totalItems == 0 {
		return []responses.AppointmentResponse{}, 0, nil
	}

	offset := (page - 1) * limit
	result := query.Order("appointments.start_time DESC").
		Offset(offset).
		Limit(limit).
		Find(&appointments)

	if result.Error != nil {

		return nil, 0, errors.New("failed to retrieve appointments")
	}

	var lawyer models.Lawyer
	if err := s.DB.First(&lawyer, lawyerID).Error; err != nil {

		return nil, 0, errors.New("failed to retrieve lawyer details")
	}

	// Collect UserIDs and load clients
	userIDs := make([]int, len(appointments))
	for i, a := range appointments {
		userIDs[i] = a.UserID
	}
	var clients []models.User
	if err := s.DB.Where("id IN ?", userIDs).Find(&clients).Error; err != nil {
		return nil, 0, errors.New("failed to load client details")
	}
	clientMap := make(map[int]models.User, len(clients))
	for _, u := range clients {
		clientMap[u.ID] = u
	}

	responseList := make([]responses.AppointmentResponse, len(appointments))
	for i, appointment := range appointments {
		client := clientMap[appointment.UserID]

		responseList[i] = responses.AppointmentResponse{
			ID:             appointment.ID,
			Description:    appointment.Description,
			StartTime:      appointment.StartTime,
			EndTime:        appointment.EndTime,
			Status:         appointment.Status,
			Notes:          appointment.Notes,
			ChatEnabled:    appointment.ChatEnabled,
			IsLawyerViewed: appointment.IsLawyerViewed,
			IsClientViewed: appointment.IsClientViewed,
			CreatedAt:      appointment.CreatedAt,
			UpdatedAt:      appointment.UpdatedAt,
			Lawyer: responses.LawyerBrief{
				ID:               lawyer.ID,
				UserID:           lawyer.UserID,
				FullName:         lawyer.FullName,
				OfficeName:       lawyer.OfficeName,
				AreasOfExpertise: lawyer.AreasOfExpertise,
				Affiliation:      lawyer.Affiliation,
			},
			Client: responses.UserProfile{
				ID:           client.ID,
				Nickname:     client.Nickname,
				Email:        client.Email,
				ProfileImage: client.ProfileImage,
			},
		}
	}

	return responseList, totalItems, nil
}

func (s *AppointmentService) GetAllAppointments(
	statusFilter, clientSearch, lawyerSearch string,
	clientId int,
	startDate, endDate time.Time,
	page, limit int,
) ([]responses.AppointmentResponse, int64, error) {
	var apps []models.Appointment
	var total int64

	// Base query
	q := s.DB.
		Model(&models.Appointment{}).
		Preload("User").
		Preload("Lawyer")
	if statusFilter != "" {
		q = q.Where("status = ?", statusFilter)
	}

	if !startDate.IsZero() {
		q = q.Where("start_time >= ?", startDate)
	}
	if !endDate.IsZero() {
		q = q.Where("end_time <= ?", endDate)
	}

	if clientSearch != "" {
		p := "%" + clientSearch + "%"
		q = q.Joins("JOIN users ON users.id = appointments.user_id").
			Where(
				"users.email ILIKE ? OR users.nickname ILIKE ? OR users.phone ILIKE ?",
				p, p, p,
			)
	}

	if clientId > 0 {
		q = q.Where("appointments.user_id = ?", clientId)
	}

	if lawyerSearch != "" {
		p := "%" + lawyerSearch + "%"
		q = q.Joins("JOIN lawyers ON lawyers.id = appointments.lawyer_id").
			Where(
				"lawyers.full_name ILIKE ? OR lawyers.email ILIKE ? OR lawyers.phone ILIKE ?",
				p, p, p,
			)
	}

	// Count total
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, errors.New("failed to count appointments")
	}
	if total == 0 {
		return []responses.AppointmentResponse{}, 0, nil
	}

	// Fetch page
	offset := (page - 1) * limit
	if err := q.
		Order("start_time DESC").
		Offset(offset).
		Limit(limit).
		Find(&apps).
		Error; err != nil {
		return nil, 0, errors.New("failed to retrieve appointments")
	}

	lawyerIDs := make([]int, len(apps))
	userIDs := make([]int, len(apps))
	for i, a := range apps {
		lawyerIDs[i] = a.LawyerID
		userIDs[i] = a.UserID
	}

	var lawyers []models.Lawyer
	if len(lawyerIDs) > 0 {
		if err := s.DB.Where("id IN ?", lawyerIDs).Find(&lawyers).Error; err != nil {
			return nil, 0, errors.New("failed to load lawyers")
		}
	}
	lmap := make(map[int]models.Lawyer, len(lawyers))
	for _, l := range lawyers {
		lmap[l.ID] = l
	}

	var users []models.User
	if len(userIDs) > 0 {
		if err := s.DB.
			Where("id IN ?", userIDs).
			Find(&users).Error; err != nil {
			return nil, 0, errors.New("failed to load users")
		}
	}
	umap := make(map[int]models.User, len(users))
	for _, u := range users {
		umap[u.ID] = u
	}

	// Build responses
	resp := make([]responses.AppointmentResponse, len(apps))
	for i, a := range apps {
		l := lmap[a.LawyerID]
		u := umap[a.UserID]
		resp[i] = responses.AppointmentResponse{
			ID:             a.ID,
			Description:    a.Description,
			StartTime:      a.StartTime,
			EndTime:        a.EndTime,
			Status:         a.Status,
			Notes:          a.Notes,
			ChatEnabled:    a.ChatEnabled,
			AdminReason:    a.AdminReason,
			CreatedAt:      a.CreatedAt,
			UpdatedAt:      a.UpdatedAt,
			IsClientViewed: a.IsClientViewed,
			IsLawyerViewed: a.IsLawyerViewed,
			Lawyer: responses.LawyerBrief{
				ID:               l.ID,
				UserID:           l.UserID,
				FullName:         l.FullName,
				OfficeName:       l.OfficeName,
				AreasOfExpertise: l.AreasOfExpertise,
			},
			Client: responses.UserProfile{
				ID:           u.ID,
				Nickname:     u.Nickname,
				Email:        u.Email,
				ProfileImage: u.ProfileImage,
			},
		}
	}

	return resp, total, nil
}

func (s *AppointmentService) CreateAppointment(appointment *models.Appointment) error {

	result := s.DB.Create(appointment)
	return result.Error
}

func (s *AppointmentService) UpdateAppointment(appointment *models.Appointment) error {
	if appointment.ID <= 0 {
		return errors.New("invalid appointment ID")
	}

	var existingAppointment models.Appointment
	if err := s.DB.First(&existingAppointment, appointment.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("appointment not found")
		}
		return err
	}

	result := s.DB.Model(&appointment).Updates(map[string]interface{}{
		"description":   appointment.Description,
		"start_time":    appointment.StartTime,
		"end_time":      appointment.EndTime,
		"status":        appointment.Status,
		"meeting_link":  appointment.MeetingLink,
		"notes":         appointment.Notes,
		"chat_enabled":  appointment.ChatEnabled,
		"cancel_reason": appointment.CancelReason,
		"admin_reason":  appointment.AdminReason,
	})

	return result.Error
}

// UpdateAppointmentViewedStatus updates the viewed status of an appointment based on user role
func (s *AppointmentService) UpdateAppointmentViewedStatus(appointmentID int, userRole string) (*models.Appointment, error) {
	appointment, err := s.GetAppointmentByID(appointmentID)
	if err != nil {
		return nil, err
	}

	// Update viewed status based on user role
	if userRole == "lawyer" {
		// Lawyer is sending a message, mark as unread for client
		err = s.DB.Model(&appointment).Update("is_client_viewed", false).Error
		if err != nil {
			// Log error but continue
			fmt.Printf("Failed to update client viewed status: %v\n", err)
		}
	} else {
		// Client is sending a message, mark as unread for lawyer
		err = s.DB.Model(&appointment).Update("is_lawyer_viewed", false).Error
		if err != nil {
			// Log error but continue
			fmt.Printf("Failed to update lawyer viewed status: %v\n", err)
		}
	}

	return appointment, nil
}

func (s *AppointmentService) DeleteAppointment(appointmentID int) error {
	result := s.DB.Delete(&models.Appointment{}, appointmentID)
	return result.Error
}

func (s *AppointmentService) CheckAvailability(
	lawyerID int,
	startTime, endTime time.Time,
) (bool, error) {
	if lawyerID <= 0 {
		return false, errors.New("invalid lawyer ID")
	}

	startUTC := startTime.UTC()
	endUTC := endTime.UTC()

	var count int64
	err := s.DB.
		Model(&models.Appointment{}).
		Where("lawyer_id = ? AND status NOT IN ('cancelled', 'rejected') "+
			"AND start_time < ? AND end_time > ?",
			lawyerID,
			endUTC,
			startUTC,
		).
		Count(&count).Error
	if err != nil {
		return false, err
	}

	return count == 0, nil
}

func (s *AppointmentService) GetUpcomingAppointments(userID int, isLawyer bool) ([]responses.AppointmentResponse, error) {
	if userID <= 0 {
		return nil, errors.New("invalid user ID")
	}

	var appointments []models.Appointment
	query := s.DB.Where("status != 'cancelled' AND end_time > ?", time.Now())

	if isLawyer {
		query = query.Where("lawyer_id = ?", userID)
	} else {
		query = query.Where("user_id = ?", userID)
	}

	result := query.Order("start_time ASC").Find(&appointments)

	if result.Error != nil {
		return nil, result.Error
	}

	if isLawyer {
		var lawyer models.Lawyer
		if err := s.DB.First(&lawyer, userID).Error; err != nil {
			return nil, err
		}

		responseList := make([]responses.AppointmentResponse, len(appointments))
		for i, appointment := range appointments {
			responseList[i] = responses.AppointmentResponse{
				ID:          appointment.ID,
				Description: appointment.Description,
				StartTime:   appointment.StartTime,
				EndTime:     appointment.EndTime,
				Status:      appointment.Status,
				Notes:       appointment.Notes,
				ChatEnabled: appointment.ChatEnabled,
				CreatedAt:   appointment.CreatedAt,
				UpdatedAt:   appointment.UpdatedAt,
				Lawyer: responses.LawyerBrief{
					ID:               lawyer.ID,
					UserID:           lawyer.UserID,
					FullName:         lawyer.FullName,
					OfficeName:       lawyer.OfficeName,
					AreasOfExpertise: lawyer.AreasOfExpertise,
					Affiliation:      lawyer.Affiliation,
				},
			}
		}
		return responseList, nil
	}

	return s.appointmentsToResponses(appointments)
}

func (s *AppointmentService) appointmentsToResponses(appointments []models.Appointment) ([]responses.AppointmentResponse, error) {
	if len(appointments) == 0 {
		return []responses.AppointmentResponse{}, nil
	}

	lawyerIDs := make([]int, len(appointments))
	for i, app := range appointments {
		lawyerIDs[i] = app.LawyerID
	}

	var lawyers []models.Lawyer
	if err := s.DB.Where("id IN ?", lawyerIDs).Find(&lawyers).Error; err != nil {
		return nil, err
	}

	lawyerMap := make(map[int]models.Lawyer)
	for _, lawyer := range lawyers {
		lawyerMap[lawyer.ID] = lawyer
	}

	responseList := make([]responses.AppointmentResponse, len(appointments))
	for i, appointment := range appointments {
		lawyer := lawyerMap[appointment.LawyerID]
		responseList[i] = responses.AppointmentResponse{
			ID:          appointment.ID,
			Description: appointment.Description,
			StartTime:   appointment.StartTime,
			EndTime:     appointment.EndTime,
			Status:      appointment.Status,
			Notes:       appointment.Notes,
			ChatEnabled: appointment.ChatEnabled,
			CreatedAt:   appointment.CreatedAt,
			UpdatedAt:   appointment.UpdatedAt,
			Lawyer: responses.LawyerBrief{
				ID:               lawyer.ID,
				UserID:           lawyer.UserID,
				FullName:         lawyer.FullName,
				OfficeName:       lawyer.OfficeName,
				AreasOfExpertise: lawyer.AreasOfExpertise,
				Affiliation:      lawyer.Affiliation,
			},
		}
	}

	return responseList, nil
}

type TimeSlot struct {
	Time      string `json:"time"`
	Available bool   `json:"available"`
}

func parseTimeSlotStr(date time.Time, timeStr string, loc *time.Location) (time.Time, error) {
	parts := strings.Split(timeStr, ":")
	if len(parts) != 2 {
		return time.Time{}, fmt.Errorf("invalid time format: %s, expected HH:MM", timeStr)
	}
	hour, err := strconv.Atoi(parts[0])
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid hour in time string '%s': %w", timeStr, err)
	}
	minute, err := strconv.Atoi(parts[1])
	if err != nil {
		return time.Time{}, fmt.Errorf("invalid minute in time string '%s': %w", timeStr, err)
	}

	if hour < 0 || hour > 23 || minute < 0 || minute > 59 {
		return time.Time{}, fmt.Errorf("hour (%d) or minute (%d) out of range in time string '%s'", hour, minute, timeStr)
	}

	return time.Date(date.Year(), date.Month(), date.Day(), hour, minute, 0, 0, loc), nil
}

func (s *AppointmentService) GetAvailableTimeSlots(lawyerID int, date time.Time) ([]TimeSlot, error) {
	var slots []TimeSlot
	loc := date.Location() // Location is passed from the handler (e.g., Asia/Tokyo)
	now := time.Now().In(loc)

	// dayStart is the beginning of the selected date in the specified location.
	dayStart := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, loc)
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)

	// General working hours for generating candidate slots
	generalWorkDayStartHour := 9 // 9 AM
	generalWorkDayEndHour := 17  // 5 PM (slots generated up to 16:30)

	// If the selected date is in the past, all slots are unavailable.
	if dayStart.Before(todayStart) {
		for h := generalWorkDayStartHour; h < generalWorkDayEndHour; h++ {
			for m := 0; m < 60; m += 30 {
				slotTime := time.Date(date.Year(), date.Month(), date.Day(), h, m, 0, 0, loc)
				slots = append(slots, TimeSlot{
					Time:      slotTime.Format("15:04"),
					Available: false,
				})
			}
		}
		return slots, nil
	}

	// Fetch lawyer details, including availability
	var lawyer models.Lawyer
	if err := s.DB.First(&lawyer, lawyerID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("lawyer with ID %d not found", lawyerID)
		}
		return nil, fmt.Errorf("failed to fetch lawyer: %w", err)
	}

	// Parse lawyer's defined work periods for the given day
	var parsedLawyerWorkPeriods []struct{ Start, End time.Time }
	if lawyer.Availability != nil {
		availabilityData := *lawyer.Availability // Dereference pointer to get the map
		if availabilityData != nil {             // Check if the map itself is not nil
			dayOfWeek := strings.ToLower(date.Weekday().String())
			dayScheduleUntyped, entryExists := availabilityData[dayOfWeek]

			if entryExists && dayScheduleUntyped != nil {
				if scheduleIntervals, ok := dayScheduleUntyped.([]interface{}); ok {
					for _, intervalEntry := range scheduleIntervals {
						if intervalMap, isMap := intervalEntry.(map[string]interface{}); isMap {
							startStr, startOk := intervalMap["start"].(string)
							endStr, endOk := intervalMap["end"].(string)

							if startOk && endOk {
								periodStart, errS := parseTimeSlotStr(date, startStr, loc)
								periodEnd, errE := parseTimeSlotStr(date, endStr, loc)

								// Validate: start must be before end, and times must be parsed correctly.
								if errS == nil && errE == nil && periodStart.Before(periodEnd) {
									parsedLawyerWorkPeriods = append(parsedLawyerWorkPeriods, struct{ Start, End time.Time }{periodStart, periodEnd})
								}
							}
						}
					}
				}
			}
		}
	}

	// If no valid work periods were parsed from the lawyer's schedule for this day,
	// all standard 09:00-17:00 slots are considered unavailable.
	if len(parsedLawyerWorkPeriods) == 0 {
		for h := generalWorkDayStartHour; h < generalWorkDayEndHour; h++ {
			for m := 0; m < 60; m += 30 {
				slotT := time.Date(date.Year(), date.Month(), date.Day(), h, m, 0, 0, loc)
				slots = append(slots, TimeSlot{Time: slotT.Format("15:04"), Available: false})
			}
		}
		return slots, nil
	}

	// Fetch existing appointments for the lawyer on the given date to check for booked slots.
	// dayEnd is the start of the next day, effectively covering the entire selected date.
	dayEnd := dayStart.Add(24 * time.Hour)
	var existingAppointments []models.Appointment
	if err := s.DB.
		Where(
			"lawyer_id = ? AND status NOT IN ? AND start_time < ? AND end_time > ?",
			lawyerID,
			[]string{"cancelled", "rejected"},
			dayEnd, dayStart,
		).
		Find(&existingAppointments).Error; err != nil {
		return nil, fmt.Errorf("failed to fetch existing appointments: %w", err)
	}

	// Generate candidate slots (e.g., 09:00, 09:30 ... 16:30) and check availability
	slotDuration := 30 * time.Minute
	for h := generalWorkDayStartHour; h < generalWorkDayEndHour; h++ { // h from 9 up to 16
		for m := 0; m < 60; m += 30 { // m is 0 or 30
			slotStart := time.Date(date.Year(), date.Month(), date.Day(), h, m, 0, 0, loc)
			slotEnd := slotStart.Add(slotDuration)

			// Check 1: Is this slot within any of the lawyer's parsed work periods?
			isWithinLawyerDefinedTime := false
			for _, lawyerPeriod := range parsedLawyerWorkPeriods {
				// A slot is within a lawyer's period if:
				// lawyerPeriod.Start <= slotStart AND slotEnd <= lawyerPeriod.End
				if (lawyerPeriod.Start.Before(slotStart) || lawyerPeriod.Start.Equal(slotStart)) &&
					(slotEnd.Before(lawyerPeriod.End) || slotEnd.Equal(lawyerPeriod.End)) {
					isWithinLawyerDefinedTime = true
					break
				}
			}

			if !isWithinLawyerDefinedTime {
				slots = append(slots, TimeSlot{Time: slotStart.Format("15:04"), Available: false})
				continue
			}

			// Check 2: If the selected date is today, is the slot in the future?
			if dayStart.Equal(todayStart) && slotStart.Before(now) {
				slots = append(slots, TimeSlot{Time: slotStart.Format("15:04"), Available: false})
				continue
			}

			// Check 3: Is the slot within the next 48 hours from now?
			fortyEightHoursFromNow := now.Add(48 * time.Hour)
			if slotStart.Before(fortyEightHoursFromNow) {
				slots = append(slots, TimeSlot{Time: slotStart.Format("15:04"), Available: false})
				continue
			}

			// Check 4: Is the slot already booked (overlaps with an existing appointment)?
			isBooked := false
			for _, appt := range existingAppointments {
				// Check for overlap: (SlotStart < ApptEnd) AND (SlotEnd > ApptStart)
				if slotStart.Before(appt.EndTime) && slotEnd.After(appt.StartTime) {
					isBooked = true
					break
				}
			}
			if isBooked {
				slots = append(slots, TimeSlot{Time: slotStart.Format("15:04"), Available: false})
				continue
			}

			// If all checks pass, the slot is available
			slots = append(slots, TimeSlot{Time: slotStart.Format("15:04"), Available: true})
		}
	}

	return slots, nil
}

func (s *AppointmentService) RejectAppointment(appointmentID int, reason string) error {
	if appointmentID <= 0 {
		return errors.New("invalid appointment ID")
	}
	reason = strings.TrimSpace(reason)
	if reason == "" {
		return errors.New("reason is required")
	}

	var appointment models.Appointment
	if err := s.DB.First(&appointment, appointmentID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("appointment not found")
		}
		return err
	}

	// Only allow rejecting pending/confirmed (not already completed/cancelled)
	if appointment.Status == "cancelled" || appointment.Status == "rejected" || appointment.Status == "completed" {
		return errors.New("cannot reject appointment with this status")
	}

	// Update status and reject_reason
	return s.DB.Model(&appointment).Updates(map[string]interface{}{
		"status":        "rejected",
		"reject_reason": reason,
		"updated_at":    time.Now(),
	}).Error
}

func (s *AppointmentService) AutoCancelPendingAppointments() error {
	now := time.Now()

	result := s.DB.Model(&models.Appointment{}).
		Where("status = ? AND start_time <= ?", "pending", now.Add(-5*time.Minute)).
		Updates(map[string]interface{}{
			"status": "cancelled",
		})

	return result.Error
}

func (s *AppointmentService) AutoCompleteConfirmedAppointments() error {
	now := time.Now()

	result := s.DB.Model(&models.Appointment{}).
		Where("status = ? AND start_time <= ?", "confirmed", now).
		Updates(map[string]interface{}{
			"status": "completed",
		})

	return result.Error
}

// SendAppointmentReminders sends email reminders to lawyers for upcoming appointments
// that are exactly 1 day or 1 hour away from the current time
// Each reminder is sent only once per appointment
func (s *AppointmentService) SendAppointmentReminders() error {
	now := time.Now()

	// Get all active appointments (not rejected, cancelled, or finished)
	var appointments []models.Appointment
	if err := s.DB.Where("status NOT IN (?, ?, ?)", "rejected", "cancelled", "completed").
		Find(&appointments).Error; err != nil {
		return fmt.Errorf("failed to fetch appointments: %w", err)
	}

	emailService := NewEmailService()

	for _, appointment := range appointments {
		// Skip appointments that have already passed
		if appointment.StartTime.Before(now) {
			continue
		}

		// Calculate time difference between now and appointment
		timeUntilAppointment := appointment.StartTime.Sub(now)

		// Check if appointment is exactly 1 day away (with 5-minute tolerance)
		oneDayAway := timeUntilAppointment > 23*time.Hour && timeUntilAppointment < 25*time.Hour

		// Check if appointment is exactly 1 hour away (with 5-minute tolerance)
		oneHourAway := timeUntilAppointment > 55*time.Minute && timeUntilAppointment < 65*time.Minute

		// Skip if neither condition is met or if both reminders have already been sent
		if (!oneDayAway || appointment.DayReminderSent) && (!oneHourAway || appointment.HourReminderSent) {
			continue
		}

		// Get lawyer details
		var lawyer models.Lawyer
		if err := s.DB.Preload("User").First(&lawyer, appointment.LawyerID).Error; err != nil {
			continue
		}

		// Get client details
		var client models.User
		if err := s.DB.First(&client, appointment.UserID).Error; err != nil {
			continue
		}

		// Format appointment date and time for display
		appointmentDate := appointment.StartTime.Format("2006年01月02日")
		appointmentTime := appointment.StartTime.Format("15:04")

		// Get client display name
		var clientName string
		if client.Nickname != nil {
			clientName = *client.Nickname
		} else {
			clientName = client.Email
		}

		// Prepare email data
		data := struct {
			LawyerName      string
			ClientName      string
			AppointmentDate string
			AppointmentTime string
			Year            int
		}{
			LawyerName:      lawyer.FullName,
			ClientName:      clientName,
			AppointmentDate: appointmentDate,
			AppointmentTime: appointmentTime,
			Year:            time.Now().Year(),
		}

		// Render template
		var body bytes.Buffer
		tmpl, err := emailService.loadTemplate("appointment_reminder.html")
		if err != nil {
			fmt.Printf("Failed to load reminder template for appointment %d: %v\n", appointment.ID, err)
			continue
		}

		if err := tmpl.Execute(&body, data); err != nil {
			fmt.Printf("Failed to execute reminder template for appointment %d: %v\n", appointment.ID, err)
			continue
		}

		// Headers + body
		headers := map[string]string{
			"From":         fmt.Sprintf("%s <%s>", "べんごしっち", emailService.Config.FromEmail),
			"To":           lawyer.User.Email,
			"Subject":      "【リマインダー】ご予約の予定があります",
			"MIME-Version": "1.0",
			"Content-Type": "text/html; charset=UTF-8",
		}

		msg := ""
		for k, v := range headers {
			msg += fmt.Sprintf("%s: %s\r\n", k, v)
		}
		msg += "\r\n" + body.String()

		// Send it
		addr := fmt.Sprintf("%s:%d", emailService.Config.Host, emailService.Config.Port)
		auth := smtp.PlainAuth(
			"",
			emailService.Config.Username,
			emailService.Config.Password,
			emailService.Config.Host,
		)

		sendErr := smtp.SendMail(addr, auth, emailService.Config.FromEmail, []string{lawyer.User.Email}, []byte(msg))
		if sendErr != nil {
			fmt.Printf("Failed to send reminder for appointment %d: %v\n", appointment.ID, sendErr)
			continue
		}

		// Update the reminder sent status in the database
		if oneDayAway && !appointment.DayReminderSent {
			if err := s.DB.Model(&appointment).Update("day_reminder_sent", true).Error; err != nil {
				fmt.Printf("Failed to update day reminder status for appointment %d: %v\n", appointment.ID, err)
			}
			fmt.Printf("Sent 1-day reminder for appointment %d\n", appointment.ID)
		}

		if oneHourAway && !appointment.HourReminderSent {
			if err := s.DB.Model(&appointment).Update("hour_reminder_sent", true).Error; err != nil {
				fmt.Printf("Failed to update hour reminder status for appointment %d: %v\n", appointment.ID, err)
			}
			fmt.Printf("Sent 1-hour reminder for appointment %d\n", appointment.ID)
		}
	}

	return nil
}

// SendLawyerAppointmentStatusUpdateEmail sends email notification to the client
// when a lawyer updates the status of an appointment
func (s *AppointmentService) SendLawyerAppointmentStatusUpdateEmail(appointment *models.Appointment, updatedStatus string) error {
	// Run asynchronously to avoid blocking API response
	go func() {
		// Get required services
		userService := NewUserService()
		lawyerService := NewLawyerService()
		emailService := NewEmailService()

		// Get client user
		client, err := userService.GetUserByID(appointment.UserID)
		if err != nil {
			fmt.Printf("Failed to get client user: %v\n", err)
			return
		}

		// Get lawyer and lawyer user
		lawyer, err := lawyerService.GetLawyerByID(appointment.LawyerID)
		if err != nil {
			fmt.Printf("Failed to get lawyer: %v\n", err)
			return
		}

		// Status names mapping for Japanese
		statusNamesJa := map[string]string{
			"pending":   "保留中",
			"confirmed": "確認済み",
			"rejected":  "拒否",
			"cancelled": "キャンセル",
			"completed": "完了",
		}

		// Get status name in Japanese
		statusName := statusNamesJa[updatedStatus]

		// Send email to client
		err = emailService.SendLawyerAppointmentStatusUpdateEmail(
			*client,
			*lawyer,
			*appointment,
			statusName,
		)
		if err != nil {
			fmt.Printf("Failed to send status update email to client: %v\n", err)
		}
	}()

	return nil
}

// SendAppointmentCancelledEmail sends a notification email to the lawyer when a client cancels an appointment
func (s *AppointmentService) SendAppointmentCancelledEmail(appointment *models.Appointment) error {
	// Run asynchronously to avoid blocking API response
	go func() {
		// Get required services
		userService := NewUserService()
		lawyerService := NewLawyerService()
		emailService := NewEmailService()

		// Get client user
		client, err := userService.GetUserByID(appointment.UserID)
		if err != nil {
			fmt.Printf("Failed to get client user: %v\n", err)
			return
		}

		// Get lawyer
		lawyer, err := lawyerService.GetLawyerByID(appointment.LawyerID)
		if err != nil {
			fmt.Printf("Failed to get lawyer: %v\n", err)
			return
		}

		// Determine client display name
		var clientName string
		if client.Nickname != nil {
			clientName = *client.Nickname
		} else if client.FirstName != nil && client.LastName != nil {
			clientName = fmt.Sprintf("%s %s", *client.FirstName, *client.LastName)
		} else {
			clientName = client.Email
		}

		// Get cancel reason, providing a default if empty
		cancelReason := "理由なし"
		if appointment.CancelReason != nil && *appointment.CancelReason != "" {
			cancelReason = *appointment.CancelReason
		}

		// Send email to lawyer
		err = emailService.SendAppointmentCancelledEmail(
			*lawyer,
			*appointment,
			clientName,
			cancelReason,
		)
		if err != nil {
			fmt.Printf("Failed to send appointment cancellation email to lawyer: %v\n", err)
		}
	}()

	return nil
}

// SendAppointmentStatusUpdateEmails sends email notifications to both lawyer and client
// when an admin updates the status of an appointment
func (s *AppointmentService) SendAppointmentStatusUpdateEmails(appointment *models.Appointment, updatedStatus string) error {
	// Run asynchronously to avoid blocking API response
	go func() {
		// Get required services
		userService := NewUserService()
		lawyerService := NewLawyerService()
		emailService := NewEmailService()

		// Get client user
		client, err := userService.GetUserByID(appointment.UserID)
		if err != nil {
			fmt.Printf("Failed to get client user: %v\n", err)
			return
		}

		// Get lawyer and lawyer user
		lawyer, err := lawyerService.GetLawyerByID(appointment.LawyerID)
		if err != nil {
			fmt.Printf("Failed to get lawyer: %v\n", err)
			return
		}

		lawyerUser, err := userService.GetUserByID(lawyer.UserID)
		if err != nil {
			fmt.Printf("Failed to get lawyer user: %v\n", err)
			return
		}

		// Status names mapping for Japanese
		statusNamesJa := map[string]string{
			"pending":   "保留中",
			"confirmed": "確認済み",
			"rejected":  "拒否",
			"cancelled": "キャンセル",
			"completed": "完了",
		}

		// Send email to client
		var clientDisplayName string
		if lawyer.FullName != "" {
			clientDisplayName = lawyer.FullName
		} else {
			clientDisplayName = lawyerUser.Email
		}

		// Get status name in Japanese
		statusNameForClient := statusNamesJa[updatedStatus]

		err = emailService.SendAppointmentStatusUpdateEmail(
			*client,
			*appointment,
			clientDisplayName,
			statusNameForClient,
		)
		if err != nil {
			fmt.Printf("Failed to send status update email to client: %v\n", err)
		}

		// Send email to lawyer
		var clientName string
		if client.Nickname != nil {
			clientName = *client.Nickname
		} else if client.FirstName != nil && client.LastName != nil {
			clientName = fmt.Sprintf("%s %s", *client.FirstName, *client.LastName)
		} else {
			clientName = client.Email
		}

		// Get status name in Japanese
		statusNameForLawyer := statusNamesJa[updatedStatus]

		err = emailService.SendAppointmentStatusUpdateEmail(
			*lawyerUser,
			*appointment,
			clientName,
			statusNameForLawyer,
		)
		if err != nil {
			fmt.Printf("Failed to send status update email to lawyer: %v\n", err)
		}
	}()

	return nil
}
