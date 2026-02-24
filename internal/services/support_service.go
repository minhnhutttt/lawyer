package services

import (
	"fmt"
	"gorm.io/gorm"
	"net/smtp"
	"strings"

	"github.com/kotolino/lawyer/internal/repository"
)

// SupportService handles support-related operations
type SupportService struct {
	db *gorm.DB
}

// NewSupportService creates a new support service
func NewSupportService() *SupportService {
	return &SupportService{
		db: repository.GetDB(),
	}
}

// SendSupportContactEmail sends an email notification when a support contact form is submitted
func (s *SupportService) SendSupportContactEmail(name, email, message, timestamp, userRole string) error {
	// Run asynchronously to avoid blocking API response
	go func() {
		// Get required service
		emailService := NewEmailService()

		// Skip if email configuration is not set
		if emailService.Config == nil || emailService.Config.Host == "" ||
			emailService.Config.Username == "" || emailService.Config.Password == "" ||
			emailService.Config.FromEmail == "" {
			fmt.Println("Email service not configured, skipping support email")
			return
		}

		// Configure SMTP authentication
		auth := smtp.PlainAuth("", emailService.Config.Username, emailService.Config.Password, emailService.Config.Host)
		addr := fmt.Sprintf("%s:%d", emailService.Config.Host, emailService.Config.Port)

		// Set up email headers
		headers := map[string]string{
			"From":         fmt.Sprintf("%s <%s>", "べんごしっち Support", emailService.Config.FromEmail),
			"To":           emailService.Config.FromEmail,  // Send to the system email
			"Subject":      "【べんごしっち】お問い合わせフォームからの新規メッセージ", // New message from contact form
			"MIME-Version": "1.0",
			"Content-Type": "text/html; charset=UTF-8",
		}

		// Build email header string
		headerStr := ""
		for k, v := range headers {
			headerStr += fmt.Sprintf("%s: %s\r\n", k, v)
		}

		// Determine user type from role for better context
		userTypeInfo := ""
		if userRole != "" {
			switch strings.ToLower(userRole) {
			case "lawyer":
				userTypeInfo = "登録弁護士"
			case "admin":
				userTypeInfo = "管理者"
			case "client":
				userTypeInfo = "クライアント"
			default:
				userTypeInfo = fmt.Sprintf("ユーザー（%s）", userRole)
			}
			userTypeInfo = fmt.Sprintf("<%s>からの問い合わせ", userTypeInfo)
		} else {
			userTypeInfo = "未ログインユーザーからの問い合わせ"
		}

		// Build the email body with the form submission details
		body := fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>お問い合わせフォームからの新規メッセージ</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            border-radius: 5px;
        }
        .header {
            background-color: #4A6FFF;
            color: white;
            padding: 15px;
            border-radius: 5px 5px 0 0;
            font-size: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #666;
        }
        .message-box {
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
            white-space: pre-wrap;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            お問い合わせフォームからの新規メッセージ
        </div>
        <div class="content">
            <p>べんごしっちのお問い合わせフォームから新しいメッセージが届きました。%s</p>
            
            <div class="field">
                <div class="label">送信日時:</div>
                <div>%s</div>
            </div>
            
            <div class="field">
                <div class="label">氏名:</div>
                <div>%s</div>
            </div>
            
            <div class="field">
                <div class="label">メールアドレス:</div>
                <div><a href="mailto:%s">%s</a></div>
            </div>
            
            <div class="field">
                <div class="label">メッセージ:</div>
                <div class="message-box">%s</div>
            </div>
        </div>
        <div class="footer">
            このメールはべんごしっちシステムから自動送信されています。
        </div>
    </div>
</body>
</html>
`, userTypeInfo, timestamp, name, email, email, message)

		// Combine header and body
		msg := headerStr + "\r\n" + body

		// Send the email
		err := smtp.SendMail(addr, auth, emailService.Config.FromEmail, []string{emailService.Config.FromEmail}, []byte(msg))
		if err != nil {
			fmt.Printf("Failed to send support contact email: %v\n", err)
		}
	}()

	return nil
}
