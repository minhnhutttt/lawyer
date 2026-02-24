# Lawyer Application Deployment

This directory contains the deployment configuration for the Lawyer application using Ansible and Docker Compose.

## Directory Structure

```
deploy/
├── ansible/              # Ansible configuration and playbooks
│   ├── ansible.cfg      # Ansible configuration file
│   ├── inventory.yml    # Inventory file for different environments
│   ├── playbook.yml     # Main Ansible playbook
│   ├── tasks/           # Task files for different environments
│   │   ├── common.yml   # Common tasks for all environments
│   │   ├── staging.yml  # Staging-specific tasks
│   │   └── production.yml # Production-specific tasks
│   ├── templates/       # Jinja2 templates for configuration files
│   │   └── nginx/       # Nginx configuration templates
│   │       ├── default.conf.j2 # Nginx configuration template
│   │       └── htpasswd.j2    # HTTP Basic Auth password file template
│   └── vars/            # Variable files for different environments
│       ├── main.yml     # Common variables
│       ├── staging.yml  # Staging-specific variables
│       └── production.yml # Production-specific variables
├── env/                 # Environment files
│   ├── frontend/        # Frontend environment files
│   │   ├── .env.staging # Staging environment variables for frontend
│   │   └── .env.production # Production environment variables for frontend
│   └── backend/         # Backend environment files
│       ├── .env.staging # Staging environment variables for backend
│       └── .env.production # Production environment variables for backend
├── keys/                # SSH keys for server access
│   ├── lawyer-staging.pem   # SSH key for staging environment
│   └── lawyer-production.pem # SSH key for production environment
├── docker-compose.yml    # Docker Compose configuration
└── deploy.sh             # Deployment script
```

## Prerequisites

- Ansible (v2.9+)
- Docker and Docker Compose
- SSH access to target servers
- Python 3.6+ (required for Ansible)


## Environment Variables

The deployment requires the following environment variables:

### Common Variables
- `DOCKER_REGISTRY_USERNAME`: Docker registry username
- `DOCKER_REGISTRY_TOKEN`: Docker registry password
- `DOCKER_REGISTRY_SERVER`: Docker registry URL (e.g., docker.io, ghcr.io) - defaults to `ghcr.io/linnoedge/lawyer` if not specified

## Deployment

The `deploy.sh` script provides a modular approach to building, pushing, and deploying the application. It supports the following commands:

### Build Docker Images

```bash
# Build Docker images for staging
./deploy.sh build staging [frontend|backend|all]

# Build Docker images for production
./deploy.sh build production [frontend|backend|all]
```

### Push Docker Images

```bash
# Push Docker images to registry for staging
./deploy.sh push staging [frontend|backend|all]

# Push Docker images to registry for production
./deploy.sh push production [frontend|backend|all]
```

### Deploy Application

```bash
# Deploy to staging
./deploy.sh deploy staging [frontend|backend|all]

# Deploy to production
./deploy.sh deploy production [frontend|backend|all]

# Deploy with SSL enabled (SSL is disabled by default)
./deploy.sh deploy staging [frontend|backend|all] --ssl
```

### Complete Workflow

```bash
# Build, push, and deploy to staging in one go
./deploy.sh all staging [frontend|backend|all]

# Build, push, and deploy to production with SSL enabled
./deploy.sh all production [frontend|backend|all] --ssl
```

## Deployment Process

1. **Docker Image Management**:
   - Build Docker images for frontend and backend
   - Tag images with registry and environment
   - Push images to Docker registry

2. **Environment Setup**:
   - Install required packages (Docker, Docker Compose, Python)
   - Create application directory
   - Set up Nginx directories

3. **Configuration**:
   - Copy environment files
   - Copy Docker Compose file
   - Process and copy Nginx configuration template

4. **Docker Setup**:
   - Add user to Docker group
   - Ensure Docker service is running
   - Login to Docker registry (if not skipped)

5. **Application Deployment**:
   - Pull and start containers
   - Wait for containers to be healthy

6. **SSL Setup** (if enabled with --ssl flag):
   - Obtain SSL certificates using Certbot
   - Copy SSL certificates to Nginx directory
   - Restart Nginx to apply SSL configuration

## Customization

### Adding a New Environment

1. Create a new task file in `ansible/tasks/`
2. Create a new vars file in `ansible/vars/`
3. Update the playbook to include the new environment

### Modifying Nginx Configuration

Edit the `ansible/templates/nginx/default.conf.j2` template file to customize the Nginx configuration. This template uses Jinja2 syntax for variable substitution.

### Modifying Docker Compose Configuration

Edit the `docker-compose.yml` file to customize the Docker Compose configuration.

## Troubleshooting

### Common Issues

- **Docker Login Failed**: Ensure `DOCKER_REGISTRY_USERNAME` and `DOCKER_REGISTRY_TOKEN` are set correctly.
- **Container Health Check Failed**: Check the container logs for errors.
- **Image Build Failed**: Check Docker build logs for errors.
- **Permission Denied**: Ensure SSH keys in the `keys/` directory have correct permissions (chmod 600).
- **Authentication Failed**: If using HTTP Basic Auth, check the htpasswd files in `nginx/htpasswd/`.

### Logs

- **Nginx Logs**: Located in `nginx/logs/`
- **Container Logs**: Use `docker-compose logs` to view container logs.
- **Build Logs**: Check Docker build output for errors.

## Security Considerations

- Environment files contain sensitive information and should be kept secure.
- SSL certificates are stored in `nginx/ssl/` and should be protected.
- Docker registry credentials should be kept secure.
- SSH keys in the `keys/` directory should have restricted permissions (chmod 600).
- HTTP Basic Auth credentials in `nginx/htpasswd/` should be kept secure. 