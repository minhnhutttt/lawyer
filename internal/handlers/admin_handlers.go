package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
	"time"
)

type AdminStatsResponse struct {
	TotalUsers     int64 `json:"total_users"`
	TotalLawyers   int64 `json:"total_lawyers"`
	TotalQuestions int64 `json:"total_questions"`
	TotalChats     int64 `json:"total_chats"`
}

// @Summary Get admin dashboard statistics
// @Description Returns aggregate statistics for the admin dashboard including total users, lawyers, questions, and chats
// @Tags admin
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} AdminStatsResponse
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /admin/stats [get]
func GetAdminStatsHandler(c *gin.Context) {

	if role, ok := middleware.GetUserRole(c); !ok || role != "admin" {
		responses.NewAPIResponse(c).
			Forbidden("Only administrators can view stats", responses.ErrCodeForbidden)
		return
	}

	adminSvc := services.NewAdminService()
	stats, err := adminSvc.GetStats()
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to retrieve stats", responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).
		OK(gin.H{
			"total_users":     stats.TotalUsers,
			"total_lawyers":   stats.TotalLawyers,
			"total_questions": stats.TotalQuestions,
			"total_chats":     stats.TotalChats,
		})
}

// @Summary Get admin chart data
// @Description Returns time-series data for the last 30 days for users, lawyers, questions, and chat messages
// @Tags admin
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H{labels=[]string,data=[][]int64}
// @Failure 401 {object} responses.APIErrorResponse "Authentication required"
// @Failure 403 {object} responses.APIErrorResponse "Admin access required"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /admin/chart-data [get]
func GetAdminChartDataHandler(c *gin.Context) {

	if role, ok := middleware.GetUserRole(c); !ok || role != "admin" {
		responses.NewAPIResponse(c).
			Forbidden("Only administrators can view chart data", responses.ErrCodeForbidden)
		return
	}

	now := time.Now()
	loc := now.Location()
	endDate := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 0, loc)
	startDate := endDate.AddDate(0, 0, -29).Add(time.Duration(-endDate.Hour()) * time.Hour).
		Add(time.Duration(-endDate.Minute()) * time.Minute).
		Add(time.Duration(-endDate.Second()) * time.Second)

	svc := services.NewAdminService()
	usersMap, err := svc.GetDailyUserCounts(startDate, endDate)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to fetch user chart data", responses.ErrCodeDatabaseError)
		return
	}
	lawyersMap, err := svc.GetDailyLawyerCounts(startDate, endDate)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to fetch lawyer chart data", responses.ErrCodeDatabaseError)
		return
	}
	questionsMap, err := svc.GetDailyQuestionCounts(startDate, endDate)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to fetch question chart data", responses.ErrCodeDatabaseError)
		return
	}
	messagesMap, err := svc.GetDailyChatMessageCounts(startDate, endDate)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to fetch chat-message chart data", responses.ErrCodeDatabaseError)
		return
	}

	labels := make([]string, 0, 30)
	usersData := make([]int64, 0, 30)
	lawyersData := make([]int64, 0, 30)
	questionsData := make([]int64, 0, 30)
	messagesData := make([]int64, 0, 30)

	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		key := d.Format("2006-01-02")
		labels = append(labels, d.Format("1/2/2006"))
		usersData = append(usersData, usersMap[key])
		lawyersData = append(lawyersData, lawyersMap[key])
		questionsData = append(questionsData, questionsMap[key])
		messagesData = append(messagesData, messagesMap[key])
	}

	responses.NewAPIResponse(c).
		OK(gin.H{
			"labels": labels,
			"data": [][]int64{
				usersData,
				lawyersData,
				questionsData,
				messagesData,
			},
		})
}
