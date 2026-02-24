package handlers

import (
	"errors"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kotolino/lawyer/internal/handlers/responses"
	"github.com/kotolino/lawyer/internal/middleware"
	"github.com/kotolino/lawyer/internal/services"
	"gorm.io/gorm"
)

// @Summary Get attachment download URL
// @Description Generates a presigned URL to download an attachment. Access control is applied based on the attachment type.
// @Tags attachments
// @Produce json
// @Security ApiKeyAuth
// @Param id path int true "Attachment ID"
// @Success 200 {string} string "Presigned URL to download the attachment"
// @Failure 400 {object} responses.APIErrorResponse "Invalid attachment ID"
// @Failure 401 {object} responses.APIErrorResponse "Authentication required or access denied"
// @Failure 404 {object} responses.APIErrorResponse "Attachment not found"
// @Failure 500 {object} responses.APIErrorResponse "Internal server error"
// @Router /attachments/{id}/url [get]
func GetAttachmentURLHandler(c *gin.Context) {
	// 1️⃣ auth & parse attachment ID
	userID, ok := middleware.GetUserID(c)
	if !ok {
		responses.NewAPIResponse(c).
			Unauthorized("Unauthorized", responses.ErrCodeUnauthorized)
		return
	}

	attID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		responses.NewAPIResponse(c).
			BadRequest("Invalid attachment ID", responses.ErrCodeInvalidRequest)
		return
	}

	// 2️⃣ fetch attachment record
	svc := services.GetAttachmentService()
	att, err := svc.GetAttachment(attID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			responses.NewAPIResponse(c).
				NotFound("Attachment not found", responses.ErrCodeResourceNotFound)
		} else {
			responses.NewAPIResponse(c).
				InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		}
		return
	}

	// 3️⃣ if it's a chat‐message attachment, ensure only sender/receiver can view
	if att.AttachmentableType == "ChatMessage" {
		msg, err := services.GetChatService().GetChatMessageByID(att.AttachmentableID)
		if err != nil {
			// if the message itself vanished, say not found
			if errors.Is(err, gorm.ErrRecordNotFound) {
				responses.NewAPIResponse(c).
					NotFound("Chat message not found", responses.ErrCodeResourceNotFound)
			} else {
				responses.NewAPIResponse(c).
					InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
			}
			return
		}
		if userID != msg.SenderID && userID != msg.ReceiverID {
			responses.NewAPIResponse(c).
				Unauthorized("Not allowed to access this file", responses.ErrCodeUnauthorized)
			return
		}
	}

	// 4️⃣ generate presigned URL
	url, err := services.NewUtilService().GetAttachmentURL(
		c.Request.Context(),
		att.FilePath,
		15*time.Minute,
	)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrAttachmentNotFound):
			responses.NewAPIResponse(c).
				NotFound("Attachment not found in storage", responses.ErrCodeResourceNotFound)
		case errors.Is(err, services.ErrAttachmentUnauthorized):
			responses.NewAPIResponse(c).
				Unauthorized("Not allowed to access this file", responses.ErrCodeUnauthorized)
		default:
			responses.NewAPIResponse(c).
				InternalServerError(err.Error(), responses.ErrCodeDatabaseError)
		}
		return
	}

	// 5️⃣ return it!
	responses.NewAPIResponse(c).
		OK(url)
}
