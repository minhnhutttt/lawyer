package services

import (
	"reflect"

	"github.com/kotolino/lawyer/internal/models"
	"gorm.io/gorm"
)

// GetLawyerHistory retrieves the history of changes for a specific lawyer
func GetLawyerHistory(db *gorm.DB, lawyerID, page, limit int) ([]models.LawyerHistory, *models.Pagination, error) {
	var histories []models.LawyerHistory
	var total int64

	// Base query
	baseQuery := db.Model(&models.LawyerHistory{}).Where("lawyer_id = ?", lawyerID)

	// Count total records for pagination
	if err := baseQuery.Count(&total).Error; err != nil {
		return nil, nil, err
	}

	// Calculate pagination values
	totalPages := int64(0)
	if limit > 0 {
		totalPages = (total + int64(limit) - 1) / int64(limit)
	}

	if page < 1 {
		page = 1
	}

	offset := (page - 1) * limit

	// Create pagination object
	pagination := &models.Pagination{
		Total:       int(total),
		PerPage:     limit,
		CurrentPage: page,
		TotalPages:  int(totalPages),
	}

	// Query for records with pagination
	query := db.
		Preload("User").
		Where("lawyer_id = ?", lawyerID).
		Order("created_at DESC").
		Offset(offset).
		Limit(limit)

	if err := query.Find(&histories).Error; err != nil {
		return nil, nil, err
	}

	return histories, pagination, nil
}

// LogLawyerChange adds an entry to the lawyer history
func LogLawyerChange(db *gorm.DB, lawyerID, userID int, changes []models.FieldChange) error {
	// Create history record using our custom FieldChanges type
	history := models.LawyerHistory{
		LawyerID: lawyerID,
		UserID:   userID,
		Changes:  models.FieldChanges(changes),
	}

	// Save history record
	return db.Create(&history).Error
}

// CompareAndTrackLawyerChanges compares old and new lawyer data and tracks changes
func CompareAndTrackLawyerChanges(db *gorm.DB, oldLawyer, newLawyer *models.Lawyer, userID int) error {
	changes := []models.FieldChange{}

	// Compare fields to detect changes
	oldVal := reflect.ValueOf(oldLawyer).Elem()
	newVal := reflect.ValueOf(newLawyer).Elem()
	typeOfLawyer := oldVal.Type()

	// Fields to track changes for
	trackFields := map[string]bool{
		"FullName":                 true,
		"Email":                    true,
		"Phone":                    true,
		"OfficeName":               true,
		"Address":                  true,
		"Gender":                   true,
		"FaxNumber":                true,
		"Affiliation":              true,
		"LawyerRegistrationNumber": true,
		"ProfileText":              true,
		"Notes":                    true,
		"Status":                   true,
		"Rating":                   true,
	}

	// Iterate through fields and check for differences
	for i := 0; i < typeOfLawyer.NumField(); i++ {
		field := typeOfLawyer.Field(i)
		fieldName := field.Name

		// Skip fields we don't want to track
		if !trackFields[fieldName] {
			continue
		}

		oldField := oldVal.Field(i).Interface()
		newField := newVal.Field(i).Interface()

		// Compare values and record changes
		if !reflect.DeepEqual(oldField, newField) {
			changes = append(changes, models.FieldChange{
				Field: fieldName,
				Old:   oldField,
				New:   newField,
			})
		}
	}

	// Special handling for array fields like specialties
	if !reflect.DeepEqual(oldLawyer.Specialties, newLawyer.Specialties) {
		changes = append(changes, models.FieldChange{
			Field: "Specialties",
			Old:   oldLawyer.Specialties,
			New:   newLawyer.Specialties,
		})
	}

	// If there are changes, log them
	if len(changes) > 0 {
		return LogLawyerChange(db, oldLawyer.ID, userID, changes)
	}

	return nil
}
