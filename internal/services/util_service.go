package services

import (
	"context"
	"errors"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/kotolino/lawyer/config"
	"golang.org/x/crypto/bcrypt"
	"io"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	s3manager "github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

// UtilService provides utility functions that can be used across different services
type UtilService struct{}

// NewUtilService creates a new instance of UtilService
func NewUtilService() *UtilService {
	return &UtilService{}
}

// BuildOrderClause constructs a safe SQL ORDER BY clause based on the provided field and direction
// It validates the field against a whitelist to prevent SQL injection
func (s *UtilService) BuildOrderClause(sortField string, sortDir string, allowedFields map[string]bool) string {
	// Set default sort parameters if not provided
	if sortField == "" {
		sortField = "id"
	}

	// Validate the sort field to prevent SQL injection
	if !allowedFields[sortField] {
		sortField = "id" // Default to id if invalid field
	}

	// Cheating: when sorting by users.name
	if sortField == "users.name" {
		sortField = "CONCAT(users.first_name, ' ', users.last_name)"
	}

	// Set order direction
	orderClause := sortField
	if sortDir == "desc" {
		orderClause += " DESC"
	} else {
		orderClause += " ASC"
	}

	return orderClause
}

// HashPassword hashes a password using bcrypt
func (s *UtilService) HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// ComparePassword compares a plain text password with a hashed password
func (s *UtilService) ComparePassword(hashedPassword, plainPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword))
}

func (u *UtilService) UploadFileToS3(
	ctx context.Context,
	key string,
	body io.Reader,
	contentType string,
) (string, error) {
	cfg, err := config.Load()
	if err != nil {
		return "", fmt.Errorf("config load failed: %w", err)
	}

	bucket := cfg.AWS.S3Bucket
	region := cfg.AWS.Region

	awsCfg, err := awsConfig.LoadDefaultConfig(ctx,
		awsConfig.WithRegion(region),
	)
	if err != nil {
		return "", fmt.Errorf("aws config load failed: %w", err)
	}

	uploader := s3manager.NewUploader(s3.NewFromConfig(awsCfg))
	out, err := uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      &bucket,
		Key:         &key,
		Body:        body,
		ContentType: &contentType,
	})
	if err != nil {
		return "", fmt.Errorf("s3 upload failed: %w", err)
	}

	return out.Location, nil
}

type Presigner struct {
	PresignClient *s3.PresignClient
}

// GetObject makes a presigned GET request valid for lifetimeSecs seconds.
func (p Presigner) GetObject(
	ctx context.Context,
	bucketName string,
	objectKey string,
	lifetimeSecs int64,
) (*v4.PresignedHTTPRequest, error) {
	return p.PresignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(objectKey),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = time.Duration(lifetimeSecs) * time.Second
	})
}

// ErrAttachmentNotFound and ErrAttachmentUnauthorized are used by the handler.
var (
	ErrAttachmentNotFound     = errors.New("attachment not found")
	ErrAttachmentUnauthorized = errors.New("unauthorized to access attachment")
)

func (s *UtilService) GetAttachmentURL(
	ctx context.Context,
	key string,
	expiry time.Duration,
) (string, error) {
	// … your existing lookup + ACL code …

	// --- PRESIGN SECTION START ---
	// load AWS config
	cfg, err := config.Load()
	if err != nil {
		return "", fmt.Errorf("config load: %w", err)
	}
	awsCfg, err := awsConfig.LoadDefaultConfig(ctx,
		awsConfig.WithRegion(cfg.AWS.Region),
	)
	if err != nil {
		return "", fmt.Errorf("aws config load: %w", err)
	}

	// build presigner
	client := s3.NewFromConfig(awsCfg)
	presignClient := s3.NewPresignClient(client)
	presigner := Presigner{PresignClient: presignClient}

	// generate the URL
	req, err := presigner.GetObject(
		ctx,
		cfg.AWS.S3Bucket,
		key,
		int64(expiry.Seconds()),
	)
	if err != nil {
		return "", fmt.Errorf("presign failed: %w", err)
	}
	return req.URL, nil
	// --- PRESIGN SECTION END ---
}

func (s *UtilService) PrefectureMap() map[string]string {
	return map[string]string{
		"hokkaido":  "北海道",
		"aomori":    "青森県",
		"iwate":     "岩手県",
		"miyagi":    "宮城県",
		"akita":     "秋田県",
		"yamagata":  "山形県",
		"fukushima": "福島県",
		"ibaraki":   "茨城県",
		"tochigi":   "栃木県",
		"gunma":     "群馬県",
		"saitama":   "埼玉県",
		"chiba":     "千葉県",
		"tokyo":     "東京都",
		"kanagawa":  "神奈川県",
		"niigata":   "新潟県",
		"toyama":    "富山県",
		"ishikawa":  "石川県",
		"fukui":     "福井県",
		"yamanashi": "山梨県",
		"nagano":    "長野県",
		"gifu":      "岐阜県",
		"shizuoka":  "静岡県",
		"aichi":     "愛知県",
		"mie":       "三重県",
		"shiga":     "滋賀県",
		"kyoto":     "京都府",
		"osaka":     "大阪府",
		"hyogo":     "兵庫県",
		"nara":      "奈良県",
		"wakayama":  "和歌山県",
		"tottori":   "鳥取県",
		"shimane":   "島根県",
		"okayama":   "岡山県",
		"hiroshima": "広島県",
		"yamaguchi": "山口県",
		"tokushima": "徳島県",
		"kagawa":    "香川県",
		"ehime":     "愛媛県",
		"kochi":     "高知県",
		"fukuoka":   "福岡県",
		"saga":      "佐賀県",
		"nagasaki":  "長崎県",
		"kumamoto":  "熊本県",
		"oita":      "大分県",
		"miyazaki":  "宮崎県",
		"kagoshima": "鹿児島県",
		"okinawa":   "沖縄県",
	}
}
