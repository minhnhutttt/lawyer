[![Build and Deploy](https://github.com/linnoedge/lawyer/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/linnoedge/lawyer/actions/workflows/build-and-deploy.yml)

# Lawyer Project

A web application for legal services built with:
- Gin Framework (Go)
- Tailwind CSS
- PostgreSQL

## Setup Instructions

### Prerequisites
- Go 1.24+
- PostgreSQL
- Node.js and npm (for Tailwind CSS)

### Installation
1. Clone the repository
2. Install Go dependencies: `go mod download`
3. Install npm dependencies: `npm install`
4. Set up the PostgreSQL database
5. Copy `.env.example` to `.env` and configure your environment variables
6. Run the application: `go run cmd/api/main.go`

### Development
- Run frontend: `cd web/frontend && npm start`
- Run in development mode: `go run cmd/api/main.go`

## Features

### Email Verification
The application includes email verification for new user registrations:

- User registration requires email verification before login
- Email templates are stored in `internal/templates/email/` directory
- Configure SMTP settings in the `.env` file to enable email sending
- If SMTP is not configured, users are auto-verified (for development purposes)

#### Customizing Email Templates
To modify email templates:
1. Edit the HTML files in the `internal/templates/email/` directory
2. No code changes or recompilation is needed
3. Templates use Go's standard template syntax with variables like `{{.Name}}`
