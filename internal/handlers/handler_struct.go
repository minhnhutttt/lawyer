package handlers

import (
	"github.com/kotolino/lawyer/config"
)

// Handler contains all the dependencies for the API handlers
type Handler struct {
	config *config.Config
}

// NewHandler creates a new instance of the Handler struct
func NewHandler(cfg *config.Config) *Handler {
	return &Handler{
		config: cfg,
	}
}