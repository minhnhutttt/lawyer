package handlers

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/config"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
)

// HomeHandler handles the home page request
func HomeHandler(c *gin.Context) {
	responses.NewAPIResponse(c).OK(gin.H{
		"message":   "OK",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// SetupRoutes configures all the routes for our application
func SetupRoutes(router *gin.Engine, cfg *config.Config) {
	// Initialize services with configuration
	services.InitServices(cfg)

	// Public routes
	router.GET("/", HomeHandler)
	
	// Support form endpoint
	router.POST("/api/support/contact", ContactSupportHandler)

	// Public API routes (no authentication required)
	publicApi := router.Group("/api/public")
	{
		// Public lawyer search
		publicApi.GET("/lawyers", PublicSearchLawyersHandler)
		publicApi.GET("/questions", GetQuestionsHandler)
		publicApi.GET("/questions/:id", GetQuestionByIDHandler)              // Get question by ID
		publicApi.GET("/questions/:id/answers", GetAnswersByQuestionHandler) // Get answers for a question

		publicApi.GET("/articles", GetArticlesHandler)                 // List all articles
		publicApi.GET("/articles/:id", GetArticleByIDHandler)          // Get article by ID
		publicApi.GET("/articles/slug/:slug", GetArticleBySlugHandler) // Get article by slug

		// Get public lawyer profile by ID
		publicApi.GET("/lawyers/:id", PublicGetLawyerByIDHandler)
		publicApi.GET("/reviews/lawyer/:id", GetReviewsForLawyerHandler) // Get reviews for a specific lawyer

		// Get public reviews for a lawyer
		publicApi.GET("/reviews/pinned", GetPinnedReviewsHandler)
	}

	// Auth routes (no authentication required)
	router.POST("/api/auth/login", LoginHandler)
	router.POST("/api/auth/register", RegisterHandler)
	router.GET("/api/auth/verify-email/:token", VerifyEmailHandler)
	router.POST("/api/auth/resend-verification", ResendVerificationEmailHandler)
	router.POST("/api/auth/forgot-password", ForgotPasswordHandler)
	router.POST("/api/auth/reset-password", ResetPasswordHandler)

	// API routes (authentication required)
	api := router.Group("/api")
	api.Use(middleware.Auth(cfg))
	{
		// Current user route
		api.GET("/auth/me", GetCurrentUserHandler)
		api.POST("/auth/logout", LogoutHandler)

		// User routes
		users := api.Group("/users")
		{
			// Routes accessible by all authenticated users
			users.GET("", GetUsersHandler)        // List all users
			users.GET("/:id", GetUserByIDHandler) // Get user by ID
			users.POST("/profile/image", UploadProfileImageHandler)
			users.PUT("/:id", UpdateUserHandler)                // Update user profile
			users.PATCH("/:id/password", UpdatePasswordHandler) // Update user password

			// Admin-only routes
			admin := users.Group("/")
			admin.Use(middleware.RequireRole("admin"))
			{
				admin.GET("/stats", GetAdminStatsHandler)
				admin.POST("/create-user", CreateUserHandler)
				admin.PATCH("/:id/status", UpdateUserStatusHandler) // Update user status
				admin.PATCH("/:id/role", UpdateUserRoleHandler)     // Update user role
				admin.DELETE("/:id", DeleteUserHandler)             // Delete user
			}
		}

		admin := api.Group("/admin")
		admin.Use(middleware.RequireRole("admin"))
		{
			admin.GET("/stats", GetAdminStatsHandler)
			admin.GET("/chart", GetAdminChartDataHandler)
		}

		// Appointment routes
		appointments := api.Group("/appointments")
		{
			appointments.GET("", GetAppointmentsHandler)                  // List all appointments
			appointments.GET("/upcoming", GetUpcomingAppointmentsHandler) // Get upcoming appointments
			appointments.GET("/available-times", GetAvailableTimeSlotsHandler)
			appointments.GET("/:id", GetAppointmentByIDHandler)       // Get appointment by ID
			appointments.POST("", CreateAppointmentHandler)           // Create new appointment
			appointments.PUT("/reject/:id", RejectAppointmentHandler) // Lawyer/admin rejects appointment
			appointments.PUT("/:id", UpdateAppointmentHandler)        // Update appointment
			appointments.DELETE("/:id", DeleteAppointmentHandler)     // Delete appointment
		}

		// Review routes
		reviews := api.Group("/reviews")
		{
			reviews.GET("", GetReviewsHandler)                     // List all reviews
			reviews.GET("/my", GetUserReviewsHandler)              // Get current user's reviews
			reviews.GET("/lawyer/:id", GetReviewsForLawyerHandler) // Get reviews for a specific lawyer
			reviews.GET("/:id", GetReviewByIDHandler)              // Get review by ID
			reviews.POST("", CreateReviewHandler)                  // Create new review
			reviews.PUT("/:id", UpdateReviewHandler)               // Update review
			reviews.DELETE("/:id", DeleteReviewHandler)            // Delete review

			// Admin only route for updating review status
			adminReviews := reviews.Group("/")
			adminReviews.Use(middleware.RequireRole("admin"))
			{
				adminReviews.PATCH("/:id/pin", PinReviewHandler)             // pin/unpin review
				adminReviews.PATCH("/:id/status", UpdateReviewStatusHandler) // Update review status
			}
		}

		// Notification routes
		notifications := api.Group("/notifications")
		{
			notifications.GET("", GetNotificationsHandler)                      // List all notifications
			notifications.GET("/count", GetUnreadNotificationCountHandler)      // Get unread notification count
			notifications.GET("/:id", GetNotificationByIDHandler)               // Get notification by ID
			notifications.PATCH("/:id/read", MarkNotificationAsReadHandler)     // Mark notification as read
			notifications.PATCH("/read-all", MarkAllNotificationsAsReadHandler) // Mark all notifications as read
			notifications.DELETE("/:id", DeleteNotificationHandler)             // Delete notification
			notifications.DELETE("/all", DeleteAllNotificationsHandler)         // Delete all notifications
		}

		// Article routes
		articles := api.Group("/articles")
		{
			articles.POST("", CreateArticleHandler)       // Create new article
			articles.PUT("/:id", UpdateArticleHandler)    // Update article
			articles.DELETE("/:id", DeleteArticleHandler) // Delete article
		}

		// Lawyer routes
		lawyers := api.Group("/lawyers")
		{
			lawyers.GET("", GetLawyersHandler)                                      // List all lawyers
			lawyers.GET("/:id", GetLawyerByIDHandler)                               // Get lawyer by ID
			lawyers.GET("/profile", GetLawyerProfileHandler)                        // Get current user's lawyer profile
			lawyers.POST("/upload-certification", UploadLawyerCertificationHandler) // Create new lawyer profile
			lawyers.POST("", CreateLawyerHandler)                                   // Create new lawyer profile
			lawyers.PUT("/:id", UpdateLawyerHandler)                                // Update lawyer profile
			lawyers.DELETE("/:id", DeleteLawyerHandler)                             // Delete lawyer profile
			lawyers.GET("/:id/history", GetLawyerHistoryHandler)                    // Get lawyer change history

			// Admin-only lawyer routes
			adminLawyers := lawyers.Group("/")
			adminLawyers.Use(middleware.RequireRole("admin"))
			{
				adminLawyers.PATCH("/:id/verify", VerifyLawyerHandler) // Update lawyer verification status
			}
		}

		// Chat routes
		chats := api.Group("/chats")
		{
			chats.GET("/appointment/:id", GetChatMessagesHandler)    // Get chat messages for an appointment
			chats.POST("/appointment/:id", CreateChatMessageHandler) // Create a new chat message
			chats.POST("/appointment/:id/attachment", SendAttachmentHandler)
			chats.PATCH("/:id/read", MarkMessageAsReadHandler)       // Mark a message as read
			chats.DELETE("/:id", DeleteChatMessageHandler)           // Delete a chat message
			chats.GET("/unread-count", GetUnreadMessageCountHandler) // Get unread message count
		}

		// Question routes
		questions := api.Group("/questions")
		{
			// List all questions with filtering
			questions.GET("/my", GetMyQuestionsHandler) // Get current user's questions
			// Question answers routes
			questions.POST("", CreateQuestionHandler)                   // Create a new question
			questions.PUT("/:id", UpdateQuestionHandler)                // Update a question
			questions.PATCH("/:id/status", UpdateQuestionStatusHandler) // Update question status
			questions.DELETE("/:id", DeleteQuestionHandler)             // Delete a question

			adminQ := questions.Group("/")
			adminQ.Use(middleware.RequireRole("admin"))
			adminQ.PATCH("/:id/hidden", UpdateQuestionHiddenHandler)
		}

		// Answer routes
		answers := api.Group("/answers")
		{
			answers.GET("/my", GetMyAnswersHandler)           // Get current lawyer's answers
			answers.GET("/:id", GetAnswerByIDHandler)         // Get answer by ID
			answers.POST("", CreateAnswerHandler)             // Create a new answer
			answers.PUT("/:id", UpdateAnswerHandler)          // Update an answer
			answers.PATCH("/:id/accept", AcceptAnswerHandler) // Accept an answer
			answers.DELETE("/:id", DeleteAnswerHandler)       // Delete an answer
		}

		// Attachment routes
		attachments := api.Group("/attachments")
		{
			attachments.GET("/:id", GetAttachmentURLHandler)
		}
	}
}
