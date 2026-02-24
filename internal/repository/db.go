package repository

import (
	"log"

	"github.com/kotolino/lawyer/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB represents the database connection using GORM
var DB *gorm.DB

// InitDB initializes the database connection using environment variables
func InitDB() error {
	cfg, err := config.Load()
	if err != nil {
		return err
	}

	return InitDBWithConfig(&cfg.Database)
}

// InitDBWithConfig initializes the database connection using the provided configuration
func InitDBWithConfig(dbConfig *config.DatabaseConfig) error {
	dsn := dbConfig.GetDSN()

	// Configure GORM
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	}

	// Connect to the database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return err
	}

	// Get the underlying *sql.DB for backward compatibility if needed
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	// Verify connection works
	err = sqlDB.Ping()
	if err != nil {
		return err
	}

	log.Println("Successfully connected to database with GORM")
	return nil
}

// CloseDB closes the database connection
func CloseDB() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Printf("Error getting underlying DB connection: %v", err)
			return
		}
		sqlDB.Close()
	}
}

// GetDB returns the global database connection
func GetDB() *gorm.DB {
	return DB
}
