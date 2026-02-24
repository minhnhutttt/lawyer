package services

import (
	"bytes"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"net/smtp"
	"os"
	"path/filepath"
	"text/template"
	"time"

	"github.com/kotolino/lawyer/config"
	"github.com/kotolino/lawyer/internal/models"
	"github.com/kotolino/lawyer/internal/repository"
)

// Template paths
const (
	EmailTemplatesDir                  = "internal/templates/email"
	VerificationTemplateFile           = "verification.html"
	ResetPasswordTemplateFile          = "reset_password.html"
	AppointmentReminderFile            = "appointment_reminder.html"
	AppointmentStatusUpdateFile        = "appointment_status_update.html"
	LawyerAppointmentStatusUpdateFile  = "lawyer_appointment_status_update.html"
	NewAppointmentFile                 = "new_appointment.html"
	AppointmentCancelledFile           = "appointment_cancelled.html"
	AccountLockedFile                  = "account_locked.html"
	AccountUnlockedFile                = "account_unlocked.html"
	NewAnswerNotificationFile          = "new_answer_notification.html"
	LawyerVerificationNotificationFile = "lawyer_verification_notification.html"
	LawyerVerificationSuccessFile      = "lawyer_verification_success.html"
)

// EmailService handles sending emails
type EmailService struct {
	Config *config.EmailConfig
}

// NewEmailService creates a new email service
func NewEmailService() *EmailService {
	cfg := GetConfig()
	if cfg == nil || cfg.Email == nil {
		// Return a dummy service with empty config when email is not configured
		return &EmailService{
			Config: &config.EmailConfig{},
		}
	}
	return &EmailService{
		Config: cfg.Email,
	}
}

// GenerateVerificationToken generates a random token for email verification
func (s *EmailService) GenerateVerificationToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

// SendVerificationEmail sends an email verification link to the user
func (s *EmailService) SendVerificationEmail(user *models.User, token string) error {
	// Check if email is properly configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" ||
		s.Config.Password == "" || s.Config.FromEmail == "" {
		// Email not configured, return nil to allow registration to continue
		return nil
	}

	// Set up authentication information
	auth := smtp.PlainAuth(
		"",
		s.Config.Username,
		s.Config.Password,
		s.Config.Host,
	)

	var displayName string
	if user.FirstName != nil && user.LastName != nil {
		displayName = fmt.Sprintf("%s %s", *user.FirstName, *user.LastName)
	} else if user.Nickname != nil {
		displayName = *user.Nickname
	} else {
		displayName = user.Email
	}

	// Set up email template data
	templateData := struct {
		Name            string
		VerificationURL string
		CompanyName     string
	}{
		Name:            displayName,
		VerificationURL: fmt.Sprintf("%s/auth/verify-email?token=%s", s.Config.FrontendURL, token),
		CompanyName:     "べんごしっち",
	}

	// Load HTML email template from file
	var body bytes.Buffer
	tmpl, err := s.loadTemplate(VerificationTemplateFile)
	if err != nil {
		return fmt.Errorf("failed to load email template: %w", err)
	}

	err = tmpl.Execute(&body, templateData)
	if err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	// Set email headers
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           user.Email,
		"Subject":      "【べんごしっち】メールアドレスのご確認をお願いいたします",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	// Construct email message
	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + body.String()

	// Send email
	err = smtp.SendMail(
		fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port),
		auth,
		s.Config.FromEmail,
		[]string{user.Email},
		[]byte(message),
	)

	return err
}

// loadTemplate loads an email template from a file
func (s *EmailService) loadTemplate(filename string) (*template.Template, error) {
	templatePath := filepath.Join(EmailTemplatesDir, filename)

	// Read the template file
	templateContent, err := os.ReadFile(templatePath)
	if err != nil {
		return nil, fmt.Errorf("error reading template file %s: %w", templatePath, err)
	}

	// Parse the template
	tmpl, err := template.New(filename).Parse(string(templateContent))
	if err != nil {
		return nil, fmt.Errorf("error parsing template %s: %w", templatePath, err)
	}

	return tmpl, nil
}

// SetVerificationToken sets the email verification token for a user
func (s *EmailService) SetVerificationToken(user *models.User) (string, error) {
	// Generate token
	token, err := s.GenerateVerificationToken()
	if err != nil {
		return "", err
	}

	// Set token and expiry (24 hours)
	user.VerificationToken = &token
	expiry := time.Now().Add(24 * time.Hour)
	user.VerificationExpiry = &expiry

	return token, nil
}

// SetResetPasswordToken generates & assigns a one-time reset token on the user (expires in 1h)
func (s *EmailService) SetResetPasswordToken(user *models.User) (string, error) {
	// reuse your random token gen
	token, err := s.GenerateVerificationToken()
	if err != nil {
		return "", err
	}

	// stash it on the user struct with a 1-hour expiry
	user.ResetPasswordToken = &token
	expiry := time.Now().Add(1 * time.Hour)
	user.ResetPasswordExpiry = &expiry

	return token, nil
}

// SendResetPasswordEmail sends the “reset your password” email using HTML template
func (s *EmailService) SendResetPasswordEmail(user *models.User, token string) error {
	// noop if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" ||
		s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth(
		"",
		s.Config.Username,
		s.Config.Password,
		s.Config.Host,
	)

	// build reset URL
	resetURL := fmt.Sprintf("%s/auth/reset-password?token=%s", s.Config.FrontendURL, token)

	var name string
	if user.Role == "lawyer" {
		if user.FirstName != nil && user.LastName != nil {
			name = fmt.Sprintf("%s %s", *user.LastName, *user.FirstName)
		} else {
			name = user.Email
		}
	} else { // assume client
		if user.Nickname != nil {
			name = *user.Nickname
		} else {
			name = user.Email
		}
	}

	data := struct {
		Name     string
		ResetURL string
		Company  string
	}{
		Name:     name,
		ResetURL: resetURL,
		Company:  "べんごしっち",
	}

	// render template
	var body bytes.Buffer
	tmpl, err := s.loadTemplate(ResetPasswordTemplateFile)
	if err != nil {
		return fmt.Errorf("load reset template: %w", err)
	}
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("exec reset template: %w", err)
	}

	// headers + body
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", data.Company, s.Config.FromEmail),
		"To":           user.Email,
		"Subject":      "パスワード再設定のご案内",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// send it
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{user.Email}, []byte(msg))
}

// SendAppointmentStatusUpdateEmail sends notification emails when an appointment status is updated by an admin
func (s *EmailService) SendAppointmentStatusUpdateEmail(recipient models.User, appointment models.Appointment, otherPartyName, updatedStatusName string) error {
	// noop if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" ||
		s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth(
		"",
		s.Config.Username,
		s.Config.Password,
		s.Config.Host,
	)

	// Get user's display name
	// Get user's display name
	var userName string
	if recipient.Role == "lawyer" {
		if recipient.FirstName != nil && recipient.LastName != nil {
			userName = fmt.Sprintf("%s %s", *recipient.FirstName, *recipient.LastName)
		} else {
			// Fallback nếu thiếu FirstName/LastName
			userName = recipient.Email
		}
	} else {
		if recipient.Nickname != nil {
			userName = *recipient.Nickname
		} else {
			userName = recipient.Email
		}
	}

	// Format appointment date and time for display
	appointmentDate := appointment.StartTime.Format("2006年01月02日")
	appointmentTime := appointment.StartTime.Format("15:04")

	// Create template data
	data := struct {
		UserName        string
		AppointmentDate string
		AppointmentTime string
		OtherPartyName  string
		UpdatedStatus   string
		AdminReason     string
		Year            int
	}{
		UserName:        userName,
		AppointmentDate: appointmentDate,
		AppointmentTime: appointmentTime,
		OtherPartyName:  otherPartyName,
		UpdatedStatus:   updatedStatusName,
		AdminReason:     *appointment.AdminReason,
		Year:            time.Now().Year(),
	}

	// Render template
	var body bytes.Buffer
	tmpl, err := s.loadTemplate(AppointmentStatusUpdateFile)
	if err != nil {
		return fmt.Errorf("load appointment status update template: %w", err)
	}

	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("exec appointment status update template: %w", err)
	}

	// Set email subject (Japanese only)
	subject := "【通知】予約のステータスが変更されました"

	// Set headers + body
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           recipient.Email,
		"Subject":      subject,
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// Send email
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{recipient.Email}, []byte(msg))
}

// SendLawyerAppointmentStatusUpdateEmail sends a notification email to the client when a lawyer updates the appointment status
// Subject: 【予約更新】予約ステータスが変更されました
func (s *EmailService) SendLawyerAppointmentStatusUpdateEmail(client models.User, lawyer models.Lawyer, appointment models.Appointment, newStatus string) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Format date/time in JST
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		// Fallback to fixed offset if LoadLocation fails (e.g. timezone data missing)
		loc = time.FixedZone("JST", 9*60*60)
	}

	startJST := appointment.StartTime.In(loc)
	appointmentDate := startJST.Format("2006年01月02日")
	appointmentTime := startJST.Format("15:04")

	// Get client nickname or fallback to email
	clientName := client.Email
	if client.Nickname != nil {
		clientName = *client.Nickname
	}

	// Get lawyer full name or fallback to email
	lawyerName := lawyer.FullName
	if lawyerName == "" {
		lawyerName = lawyer.User.Email
	}

	// Determine if we should show reject reason based on status
	showRejectReason := appointment.Status == "rejected" && appointment.RejectReason != nil
	rejectReason := ""
	if showRejectReason && appointment.RejectReason != nil {
		rejectReason = *appointment.RejectReason
	}

	// Prepare data for template rendering
	data := struct {
		ClientName       string
		LawyerName       string
		AppointmentDate  string
		AppointmentTime  string
		NewStatus        string
		ShowRejectReason bool
		RejectReason     string
		Year             int
	}{
		ClientName:       clientName,
		LawyerName:       lawyerName,
		AppointmentDate:  appointmentDate,
		AppointmentTime:  appointmentTime,
		NewStatus:        newStatus,
		ShowRejectReason: showRejectReason,
		RejectReason:     rejectReason,
		Year:             time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(LawyerAppointmentStatusUpdateFile)
	if err != nil {
		return fmt.Errorf("load lawyer appointment status update template: %w", err)
	}

	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute lawyer appointment status update template: %w", err)
	}

	// Set email headers
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           client.Email,
		"Subject":      "【予約更新】予約ステータスが変更されました",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// Send email
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{client.Email}, []byte(msg))
}

// SendNewAnswerNotificationEmail sends a notification email when a lawyer answers a user's question
func (s *EmailService) SendNewAnswerNotificationEmail(user models.User, lawyer models.Lawyer, question models.Question, answerID int) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Get user nickname for personalization
	var userNickname string
	if user.Nickname != nil {
		userNickname = *user.Nickname
	} else {
		userNickname = user.Email // Fallback to email
	}

	// Format lawyer name
	var lawyerName string
	if lawyer.User.LastName != nil && lawyer.User.FirstName != nil {
		lawyerName = fmt.Sprintf("%s %s", *lawyer.User.LastName, *lawyer.User.FirstName)
	} else {
		lawyerName = lawyer.User.Email // Fallback to email
	}

	// Create answer URL using the configured frontend URL
	baseURL := "http://localhost:3000" // Default fallback
	cfg := GetConfig()
	if cfg != nil && len(cfg.Server.FrontendURLs) > 0 {
		baseURL = cfg.Server.FrontendURLs[0]
	}
	answerURL := fmt.Sprintf("%s/questions/%d", baseURL, question.ID)

	// Prepare data for template rendering
	data := struct {
		UserNickname  string
		QuestionTitle string
		LawyerName    string
		AnswerURL     string
		Year          int
	}{
		UserNickname:  userNickname,
		QuestionTitle: question.Title,
		LawyerName:    lawyerName,
		AnswerURL:     answerURL,
		Year:          time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(NewAnswerNotificationFile)
	if err != nil {
		return fmt.Errorf("load new answer notification template: %w", err)
	}

	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute new answer notification template: %w", err)
	}

	// Set email headers
	subject := "【新しい回答】弁護士があなたの法律相談に回答しました"
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           user.Email,
		"Subject":      subject,
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// Send email
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{user.Email}, []byte(msg))
}

// SendAccountStatusNotificationEmail sends a notification email when an admin locks or unlocks a user account
func (s *EmailService) SendAccountStatusNotificationEmail(user models.User, isLocked bool) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Determine user display name based on role
	var userDisplayName string
	if user.Role == "lawyer" {
		// For lawyers, use Last Name + First Name if available
		if user.LastName != nil && user.FirstName != nil {
			userDisplayName = fmt.Sprintf("%s %s", *user.LastName, *user.FirstName)
		} else {
			userDisplayName = user.Email // Fallback to email
		}
	} else {
		// For clients, use nickname if available
		if user.Nickname != nil {
			userDisplayName = *user.Nickname
		} else {
			userDisplayName = user.Email // Fallback to email
		}
	}

	// Choose template and subject based on lock status
	templateFile := AccountUnlockedFile
	subject := "あなたのアカウントがロック解除されました" // Account unlocked

	if isLocked {
		templateFile = AccountLockedFile
		subject = "あなたのアカウントがロックされました" // Account locked
	}

	// Prepare data for template rendering
	data := struct {
		UserDisplayName string
		Year            int
	}{
		UserDisplayName: userDisplayName,
		Year:            time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(templateFile)
	if err != nil {
		return fmt.Errorf("load account status template: %w", err)
	}

	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute account status template: %w", err)
	}

	// Set email headers
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           user.Email,
		"Subject":      subject,
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// Send email
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{user.Email}, []byte(msg))
}

// SendNewAppointmentEmail sends a notification email to the lawyer when a new appointment is created.
// It is currently a simple inlined HTML email (Japanese only).
// Subject: 【新規予約】新しい予約が入りました
func (s *EmailService) SendNewAppointmentEmail(lawyer models.Lawyer, appointment models.Appointment, clientNickname string) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Format date/time in JST
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		// Fallback to fixed offset if LoadLocation fails (e.g. timezone data missing)
		loc = time.FixedZone("JST", 9*60*60)
	}

	startJST := appointment.StartTime.In(loc)
	appointmentDate := startJST.Format("2006年01月02日")
	appointmentTime := startJST.Format("15:04")

	lawyerName := lawyer.FullName

	// Prepare data for template rendering
	// placeholder removed, we will build body via template
	/* OLD inlined HTML below retained for reference
		// (old inlined HTML removed)<p><strong>%s</strong>様</p>
	<p>新たに予約が入りましたのでお知らせいたします。以下のご予約内容をご確認ください。</p>
	<p>🗓 <strong>予約の詳細:</strong></p>
	<ul>
	<li>日付: <strong>%s</strong></li>
	<li>時間: <strong>%s</strong></li>
	<li>クライアント: <strong>%s</strong></li>
	</ul>
	<p>チャット予約ページにログインして詳細をご確認ください。スケジュールの調整やクライアントへの連絡が必要な場合は、プラットフォーム内から行ってください。</p>
	<p>いつもご利用いただきありがとうございます。</p>
	<p>べんごしっちサポートチーム</p>`, lawyerName, appointmentDate, appointmentTime, clientNickname)
	*/// end old HTML comment block

	// --- use external template instead ---
	data := struct {
		LawyerName      string
		AppointmentDate string
		AppointmentTime string
		ClientName      string
		Year            int
	}{
		LawyerName:      lawyerName,
		AppointmentDate: appointmentDate,
		AppointmentTime: appointmentTime,
		ClientName:      clientNickname,
		Year:            time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(NewAppointmentFile)
	if err != nil {
		return fmt.Errorf("load new appointment template: %w", err)
	}
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute new appointment template: %w", err)
	}

	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           lawyer.User.Email,
		"Subject":      "【新規予約】新しい予約が入りました",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{lawyer.User.Email}, []byte(msg))
}

// SendAppointmentCancelledEmail sends a notification email to the lawyer when a client cancels an appointment
// Subject: 【予約キャンセル】クライアントが予約をキャンセルしました
func (s *EmailService) SendAppointmentCancelledEmail(lawyer models.Lawyer, appointment models.Appointment, clientNickname string, cancelReason string) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Format date/time in JST
	loc, err := time.LoadLocation("Asia/Tokyo")
	if err != nil {
		// Fallback to fixed offset if LoadLocation fails (e.g. timezone data missing)
		loc = time.FixedZone("JST", 9*60*60)
	}

	startJST := appointment.StartTime.In(loc)
	appointmentDate := startJST.Format("2006年01月02日")
	appointmentTime := startJST.Format("15:04")

	lawyerName := lawyer.FullName

	// Prepare data for template rendering
	data := struct {
		LawyerName      string
		AppointmentDate string
		AppointmentTime string
		ClientName      string
		CancelReason    string
		Year            int
	}{
		LawyerName:      lawyerName,
		AppointmentDate: appointmentDate,
		AppointmentTime: appointmentTime,
		ClientName:      clientNickname,
		CancelReason:    cancelReason,
		Year:            time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(AppointmentCancelledFile)
	if err != nil {
		return fmt.Errorf("load appointment cancelled template: %w", err)
	}
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute appointment cancelled template: %w", err)
	}

	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           lawyer.User.Email,
		"Subject":      "【予約キャンセル】クライアントが予約をキャンセルしました",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{lawyer.User.Email}, []byte(msg))
}

// SendLawyerVerificationNotificationEmail sends a notification to admins when a lawyer has completed their profile and is ready for verification
// Subject: 【要確認】新しい弁護士プロフィールが承認待ちです
func (s *EmailService) SendLawyerVerificationNotificationEmail(lawyer models.Lawyer) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	// Get admin emails from the database
	db := repository.GetDB()
	if db == nil {
		return fmt.Errorf("database not initialized")
	}

	// Query all users with admin role
	var adminUsers []models.User
	if err := db.Where("role = ?", "admin").Find(&adminUsers).Error; err != nil {
		return fmt.Errorf("error retrieving admin users: %w", err)
	}

	// Extract emails
	adminEmails := make([]string, 0, len(adminUsers))
	for _, admin := range adminUsers {
		adminEmails = append(adminEmails, admin.Email)
	}

	// If no admin emails found, we can't send notifications
	if len(adminEmails) == 0 {
		// Silently return - no recipients available
		return nil
	}

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Prepare lawyer information
	lawyerName := lawyer.FullName

	// Prepare data for template rendering
	data := struct {
		LawyerName    string
		LawyerEmail   string
		OfficeName    string
		OfficeAddress string
		AdminURL      string
		Year          int
	}{
		LawyerName:    lawyerName,
		LawyerEmail:   lawyer.User.Email,
		OfficeName:    lawyer.OfficeName,
		OfficeAddress: lawyer.Address,
		AdminURL:      fmt.Sprintf("%s/admin/lawyers", s.Config.FrontendURL),
		Year:          time.Now().Year(),
	}

	var body bytes.Buffer
	tmpl, err := s.loadTemplate(LawyerVerificationNotificationFile)
	if err != nil {
		return fmt.Errorf("load lawyer verification template: %w", err)
	}
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute lawyer verification template: %w", err)
	}

	// Use a comma-separated list of admin emails for the To field in mail headers
	adminEmailsStr := adminEmails[0]
	for i := 1; i < len(adminEmails); i++ {
		adminEmailsStr += ", " + adminEmails[i]
	}

	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           adminEmailsStr,
		"Subject":      "【要確認】新しい弁護士プロフィールが承認待ちです",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, adminEmails, []byte(msg))
}

// SendLawyerVerificationSuccessEmail sends a confirmation email to the lawyer when their account is verified by an admin
// Subject: 【認証完了】あなたの弁護士アカウントが認証されました
func (s *EmailService) SendLawyerVerificationSuccessEmail(lawyer models.Lawyer) error {
	// No-op if email not configured
	if s.Config == nil || s.Config.Host == "" || s.Config.Username == "" || s.Config.Password == "" || s.Config.FromEmail == "" {
		return nil
	}

	// Basic validation - ensure User relation is loaded
	if lawyer.User.Email == "" {
		return fmt.Errorf("lawyer user email is empty - User relation may not be loaded")
	}

	fmt.Printf(lawyer.User.Email)

	auth := smtp.PlainAuth("", s.Config.Username, s.Config.Password, s.Config.Host)

	// Prepare lawyer information - prefer full name if available, fall back to email
	lawyerName := lawyer.FullName
	if lawyerName == "" {
		lawyerName = lawyer.User.Email
	}

	// Prepare data for template rendering
	data := struct {
		LawyerName string
		LoginURL   string
		Year       int
	}{
		LawyerName: lawyerName,
		LoginURL:   fmt.Sprintf("%s/auth/login", s.Config.FrontendURL),
		Year:       time.Now().Year(),
	}

	// Load and render the template
	var body bytes.Buffer
	tmpl, err := s.loadTemplate(LawyerVerificationSuccessFile)
	if err != nil {
		return fmt.Errorf("load lawyer verification success template: %w", err)
	}
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("execute lawyer verification success template: %w", err)
	}

	// Set email headers
	headers := map[string]string{
		"From":         fmt.Sprintf("%s <%s>", "べんごしっち", s.Config.FromEmail),
		"To":           lawyer.User.Email,
		"Subject":      "【認証完了】あなたの弁護士アカウントが認証されました",
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	// Construct email message
	msg := ""
	for k, v := range headers {
		msg += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	msg += "\r\n" + body.String()

	// Send email
	addr := fmt.Sprintf("%s:%d", s.Config.Host, s.Config.Port)
	return smtp.SendMail(addr, auth, s.Config.FromEmail, []string{lawyer.User.Email}, []byte(msg))
}
