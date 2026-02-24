package repository

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

// RunSeeders chạy SQL seed trong folder db/seeds
func RunSeeders() error {
	log.Println("Running database seeders...")

	if DB == nil {
		return errors.New("database connection not initialized")
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("get raw DB: %w", err)
	}

	// Lấy path từ env, fallback
	raw := os.Getenv("SEED_PATH")
	if raw == "" {
		raw = "db/seeds"
	}
	seedPath := raw
	if !strings.HasPrefix(raw, "file://") {
		seedPath = "file://" + raw
	}

	// Dùng 1 bảng riêng cho state của seeds
	cfg := &postgres.Config{
		MigrationsTable: "schema_seeds",
	}
	driver, err := postgres.WithInstance(sqlDB, cfg)
	if err != nil {
		return fmt.Errorf("postgres.WithInstance: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		seedPath,
		"postgres", driver,
	)
	if err != nil {
		return fmt.Errorf("migrate.NewWithDatabaseInstance: %w", err)
	}

	// apply tất cả seeds, bỏ qua ErrNoChange
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("seed up failed: %w", err)
	}

	log.Println("Database seeders completed successfully")
	return nil
}
