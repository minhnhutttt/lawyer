package repository

import (
	"errors"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file" // required for file:// source
	_ "github.com/lib/pq"                                // required for postgres driver
)

// RunMigrations runs database migrations
func RunMigrations() error {
	log.Println("Running database migrations...")

	// Ensure DB is initialized
	if DB == nil {
		return errors.New("database connection not initialized")
	}

	// Get the underlying *sql.DB connection for migrations
	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	// Get migration path from env or use default
	migrationPath := os.Getenv("MIGRATION_PATH")
	if migrationPath == "" {
		migrationPath = "file://db/migrations"
	}

	// Create a new migrate instance
	driver, err := postgres.WithInstance(sqlDB, &postgres.Config{})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithDatabaseInstance(
		migrationPath,
		"postgres", driver)
	if err != nil {
		return err
	}

	// Run migrations
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return err
	}

	log.Println("Migrations completed successfully")
	return nil
}
