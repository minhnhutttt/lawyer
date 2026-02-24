package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	File     FileConfig
	Email    *EmailConfig
	AWS      AWSConfig
}

// ServerConfig holds all server-related configuration
type ServerConfig struct {
	Port         string
	GinMode      string
	FrontendURLs []string
}

// DatabaseConfig holds all database-related configuration
type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
	SSLMode  string
}

// JWTConfig holds all JWT-related configuration
type JWTConfig struct {
	Secret          string
	Expiration      time.Duration
	ExpirationHours int
}

// FileConfig holds all file-related configuration
type FileConfig struct {
	UploadDir    string
	MaxSizeMB    int
	AllowedTypes []string
}

// EmailConfig holds all email-related configuration
type EmailConfig struct {
	Host        string
	Port        int
	Username    string
	Password    string
	FromEmail   string
	FrontendURL string
}

type AWSConfig struct {
	Region   string
	S3Bucket string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		fmt.Println("Warning: .env file not found, using environment variables")
	}

	// Server configuration
	port := getEnv("PORT", "8080")
	ginMode := getEnv("GIN_MODE", "debug")
	frontendURLsStr := getEnv("FRONTEND_URLS", "http://localhost:3000")
	frontendURLs := strings.Split(frontendURLsStr, ",")

	// Database configuration
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "password")
	dbName := getEnv("DB_NAME", "lawyer")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	// JWT configuration
	jwtSecret := getEnv("JWT_SECRET", "your_jwt_secret_key")
	jwtExpStr := getEnv("JWT_EXPIRATION", "24h")
	jwtExp, err := time.ParseDuration(jwtExpStr)
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRATION format: %v", err)
	}

	// Convert duration to hours for ExpirationHours
	jwtExpHours := int(jwtExp.Hours())

	// File configuration
	uploadDir := getEnv("FILE_UPLOAD_DIR", "./uploads")
	maxSizeMB, _ := strconv.Atoi(getEnv("FILE_MAX_SIZE_MB", "10"))
	allowedTypesStr := getEnv("FILE_ALLOWED_TYPES", ".pdf,.doc,.docx,.jpg,.jpeg,.png")
	allowedTypes := strings.Split(allowedTypesStr, ",")

	// Email configuration
	emailHost := getEnv("EMAIL_HOST", "")
	emailPortStr := getEnv("EMAIL_PORT", "587")
	emailPort, _ := strconv.Atoi(emailPortStr)
	emailUsername := getEnv("EMAIL_USERNAME", "")
	emailPassword := getEnv("EMAIL_PASSWORD", "")
	emailFromEmail := getEnv("EMAIL_FROM", "")
	frontendURL := getEnv("FRONTEND_URL", frontendURLs[0])

	// Initialize email config only if all required fields are provided
	var emailConfig *EmailConfig
	if emailHost != "" && emailUsername != "" && emailPassword != "" && emailFromEmail != "" {
		emailConfig = &EmailConfig{
			Host:        emailHost,
			Port:        emailPort,
			Username:    emailUsername,
			Password:    emailPassword,
			FromEmail:   emailFromEmail,
			FrontendURL: frontendURL,
		}
	}

	awsRegion := getEnv("AWS_REGION", "ap-southeast-1")
	s3Bucket := getEnv("AWS_S3_BUCKET", "")
	if s3Bucket == "" {
		return nil, fmt.Errorf("missing AWS_S3_BUCKET in env")
	}

	return &Config{
		Server: ServerConfig{
			Port:         port,
			GinMode:      ginMode,
			FrontendURLs: frontendURLs,
		},
		Database: DatabaseConfig{
			Host:     dbHost,
			Port:     dbPort,
			User:     dbUser,
			Password: dbPassword,
			Name:     dbName,
			SSLMode:  dbSSLMode,
		},
		JWT: JWTConfig{
			Secret:          jwtSecret,
			Expiration:      jwtExp,
			ExpirationHours: jwtExpHours,
		},
		File: FileConfig{
			UploadDir:    uploadDir,
			MaxSizeMB:    maxSizeMB,
			AllowedTypes: allowedTypes,
		},
		Email: emailConfig,
		AWS: AWSConfig{
			Region:   awsRegion,
			S3Bucket: s3Bucket,
		},
	}, nil
}

// GetDSN returns the database connection string
func (cfg *DatabaseConfig) GetDSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Host,
		cfg.Port,
		cfg.User,
		cfg.Password,
		cfg.Name,
		cfg.SSLMode,
	)
}

// getEnv returns the value of the environment variable or a default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
