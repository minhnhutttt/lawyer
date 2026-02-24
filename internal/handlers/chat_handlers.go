package handlers

import (
	"fmt"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/services"
)

// attachmentBrief represents a simplified attachment for chat responses
type attachmentBrief struct {
	ID       int    `json:"id"`
	FilePath string `json:"file_path"`
	FileName string `json:"file_name"`
	FileSize int    `json:"file_size"`
}

// chatResp represents a chat message response with attachment details
type chatResp struct {
	ID            int              `json:"id"`
	AppointmentID int              `json:"appointment_id"`
	SenderID      int              `json:"sender_id"`
	ReceiverID    int              `json:"receiver_id"`
	Content       string           `json:"content"`
	Read          bool             `json:"read"`
	CreatedAt     time.Time        `json:"created_at"`
	UpdatedAt     time.Time        `json:"updated_at"`
	Attachment    *attachmentBrief `json:"attachment,omitempty"`
}

// ChatMessageRequest represents a request to create a new chat message
type ChatMessageRequest struct {
	ReceiverID int    `json:"receiver_id" binding:"required"`
	Content    string `json:"content" binding:"required"`
}

// @Summary Get chat messages
// @Description Gets all chat messages for a specific appointment
// @Tags chat
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Success 200 {array} handlers.chatResp
// @Failure 400 {object} responses.APIErrorResponse "Invalid appointment ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id}/messages [get]
func GetChatMessagesHandler(c *gin.Context) {
	// parse appt
	apptID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}
	// auth
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).
			Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}
	// fetch raw msgs
	raws, err := services.GetChatService().GetMessagesByAppointment(apptID, userID)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}



	var out []chatResp
	for _, m := range raws {
		msg := chatResp{
			ID:            m.ID,
			AppointmentID: m.AppointmentID,
			SenderID:      m.SenderID,
			ReceiverID:    m.ReceiverID,
			Content:       m.Content,
			Read:          m.Read,
			CreatedAt:     m.CreatedAt,
			UpdatedAt:     m.UpdatedAt,
		}
		if m.Attachment != nil {
			msg.Attachment = &attachmentBrief{
				ID:       m.Attachment.ID,
				FilePath: m.Attachment.FilePath,
				FileName: m.Attachment.FileName,
				FileSize: m.Attachment.FileSize,
			}
		}
		out = append(out, msg)
	}

	responses.NewAPIResponse(c).OK(out)
}

// @Summary Create chat message
// @Description Creates a new chat message for a specific appointment
// @Tags chat
// @Accept json
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Param message body ChatMessageRequest true "Message details"
// @Success 201 {object} models.ChatMessage
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id}/messages [post]
func CreateChatMessageHandler(c *gin.Context) {
	// Get appointment ID from URL
	appointmentIDStr := c.Param("id")
	appointmentID, err := strconv.Atoi(appointmentIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID and role from context
	senderID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	userRole, _ := middleware.GetUserRole(c)

	// Bind request body
	var messageRequest struct {
		ReceiverID int    `json:"receiver_id" binding:"required"`
		Content    string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&messageRequest); err != nil {
		responses.NewAPIResponse(c).BadRequest(err.Error(), responses.ErrCodeInvalidRequest)
		return
	}

	// Update appointment viewed status using the service method
	appointmentService := services.NewAppointmentService()
	_, err = appointmentService.UpdateAppointmentViewedStatus(appointmentID, userRole)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
		return
	}

	// Create chat message
	message := models.ChatMessage{
		AppointmentID: appointmentID,
		SenderID:      senderID,
		ReceiverID:    messageRequest.ReceiverID,
		Content:       messageRequest.Content,
		Read:          false,
	}

	createdMessage, err := services.GetChatService().NewChatMessage(message)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).Created(createdMessage)
}

// @Summary Mark message as read
// @Description Marks a specific chat message as read
// @Tags chat
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Message ID"
// @Success 200 {object} gin.H "Success message"
// @Failure 400 {object} responses.APIErrorResponse "Invalid message ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /messages/{id}/read [post]
func MarkMessageAsReadHandler(c *gin.Context) {
	// Get message ID from URL
	messageIDStr := c.Param("id")
	messageID, err := strconv.Atoi(messageIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid message ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Mark message as read
	if err := services.GetChatService().MarkMessageAsRead(messageID, userID); err != nil {
		responses.NewAPIResponse(c).InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Message marked as read"})
}

// @Summary Delete chat message
// @Description Deletes a specific chat message
// @Tags chat
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Message ID"
// @Success 200 {object} gin.H "Message deleted"
// @Failure 400 {object} responses.APIErrorResponse "Invalid message ID"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 403 {object} responses.APIErrorResponse "Forbidden"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /messages/{id} [delete]
func DeleteChatMessageHandler(c *gin.Context) {
	// Get message ID from URL
	messageIDStr := c.Param("id")
	messageID, err := strconv.Atoi(messageIDStr)
	if err != nil {
		responses.NewAPIResponse(c).BadRequest("Invalid message ID", responses.ErrCodeInvalidRequest)
		return
	}

	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Delete message
	if err := services.GetChatService().DeleteMessage(messageID, userID); err != nil {
		responses.NewAPIResponse(c).InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"message": "Message deleted"})
}

// @Summary Get unread message count
// @Description Gets the count of unread messages for the current user
// @Tags chat
// @Produce json
// @Security ApiKeyAuth
// @Success 200 {object} gin.H "Count of unread messages"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /messages/unread/count [get]
func GetUnreadMessageCountHandler(c *gin.Context) {
	// Get current user ID from context
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// Get unread count
	count, err := services.GetChatService().GetUnreadMessageCount(userID)
	if err != nil {
		responses.NewAPIResponse(c).InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	responses.NewAPIResponse(c).OK(gin.H{"count": count})
}

// @Summary Send attachment
// @Description Uploads and sends an attachment in a chat message
// @Tags chat
// @Accept multipart/form-data
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Appointment ID"
// @Param receiver_id formData int true "Receiver ID"
// @Param file formData file true "Attachment file"
// @Success 201 {object} gin.H "Created message with attachment"
// @Failure 400 {object} responses.APIErrorResponse "Invalid request"
// @Failure 401 {object} responses.APIErrorResponse "Unauthorized"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /appointments/{id}/attachments [post]
func SendAttachmentHandler(c *gin.Context) {
	// parse & auth
	apptID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid appointment ID", responses.ErrCodeInvalidRequest)
		return
	}
	uploaderID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).
			Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	// require receiver
	recvStr := c.PostForm("receiver_id")
	if recvStr == "" {
		responses.NewAPIResponse(c).
			BadRequest("receiver_id is required", responses.ErrCodeInvalidRequest)
		return
	}
	receiverID, err := strconv.Atoi(recvStr)
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid receiver_id", responses.ErrCodeInvalidRequest)
		return
	}

	// grab file
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("File is required: "+err.Error(), responses.ErrCodeInvalidRequest)
		return
	}
	defer file.Close()

	// upload to S3
	ext := filepath.Ext(header.Filename)
	key := fmt.Sprintf("attachments/chat_message/%d/%d_%d%s",
		apptID, uploaderID, time.Now().UnixNano(), ext,
	)
	utilSvc := services.NewUtilService()
	_, err = utilSvc.UploadFileToS3(
		c.Request.Context(),
		key,
		file,
		header.Header.Get("Content-Type"),
	)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Upload failed: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// 1️⃣ create the chat message first
	chatMsg := models.ChatMessage{
		AppointmentID: apptID,
		SenderID:      uploaderID,
		ReceiverID:    receiverID,
		Content:       " ",
		Read:          false,
	}
	createdMsg, err := services.GetChatService().NewChatMessage(chatMsg)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("Failed to create chat message: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// 2️⃣ then save the attachment with polymorphic fields
	att := models.Attachment{
		FileName:           header.Filename,
		FileSize:           int(header.Size),
		FileType:           header.Header.Get("Content-Type"),
		FilePath:           key,
		AttachmentableType: "ChatMessage",
		AttachmentableID:   createdMsg.ID,
		UploadedBy:         uploaderID,
	}
	savedAtt, err := services.GetChatService().SaveAttachment(att)
	if err != nil {
		responses.NewAPIResponse(c).
			InternalServerError("DB save failed: "+err.Error(), responses.ErrCodeDatabaseError)
		return
	}

	// 3️⃣ optional: if you still wanna rock the LinkAttachmentToMessage helper
	_ = services.GetChatService().LinkAttachmentToMessage(savedAtt.ID, createdMsg.ID)

	userRole, _ := middleware.GetUserRole(c)
	appointmentService := services.NewAppointmentService()
	_, err = appointmentService.UpdateAppointmentViewedStatus(apptID, userRole)
	if err != nil {
		responses.NewAPIResponse(c).NotFound("Appointment not found", responses.ErrCodeResourceNotFound)
		return
	}

	// 4️⃣ return both so the client can update UI
	responses.NewAPIResponse(c).Created(gin.H{
		"id":             createdMsg.ID,
		"appointment_id": createdMsg.AppointmentID,
		"sender_id":      createdMsg.SenderID,
		"receiver_id":    createdMsg.ReceiverID,
		"content":        createdMsg.Content,
		"read":           createdMsg.Read,
		"created_at":     createdMsg.CreatedAt,
		"updated_at":     createdMsg.UpdatedAt,
		"attachment": gin.H{
			"id":        savedAtt.ID,
			"file_path": savedAtt.FilePath,
			"file_name": savedAtt.FileName,
			"file_size": savedAtt.FileSize,
		},
	})

}
