#!/bin/bash

# Exit on error
set -e

# Function to display usage
function show_usage {
  echo "Usage: $0 <command> [options]"
  echo ""
  echo "Commands:"
  echo "  build <environment> [component]    Build Docker images for the specified environment and component"
  echo "  push <environment> [component]     Push Docker images to registry for the specified environment and component"
  echo "  deploy <environment> [component]   Deploy the application to the specified environment and component"
  echo "  all <environment> [component]      Build, push, and deploy in one go"
  echo ""
  echo "Available environments: staging, production"
  echo "Available components: frontend, backend, all (default)"
  echo ""
  echo "Options:"
  echo "  --skip-docker-login  Skip Docker registry login"
  echo "  --ssl                Enable SSL certificate setup (disabled by default)"
  exit 1
}

# Function to check environment variables
function check_env_vars {
  local env=$1
  
  # Check for Docker registry credentials if needed
  if [ "$PUSH_IMAGES" = true ]; then
    if [ -z "$DOCKER_REGISTRY_USERNAME" ] || [ -z "$DOCKER_REGISTRY_TOKEN" ] || [ -z "$DOCKER_REGISTRY_SERVER" ]; then
      echo "Error: DOCKER_REGISTRY_USERNAME, DOCKER_REGISTRY_TOKEN, and DOCKER_REGISTRY_SERVER environment variables must be set"
      exit 1
    fi
  fi
}

# Function to clean up Docker resources
function cleanup_docker {
  echo "Cleaning up Docker resources to free up space..."
  docker system prune -f
  docker volume prune -f
  docker builder prune -f
}

# Function to build Docker images
function build_images {
  local env=$1
  local component=$2
  echo "Building Docker images for $env environment..."
  
  # Clean up Docker resources before building
  cleanup_docker
  
  # Build for amd64 architecture
  echo "Building for amd64 architecture..."

  if [ "$component" = "frontend" ] || [ "$component" = "all" ]; then
    source "$(dirname "$0")/env/frontend/.env.$env" && \
      docker buildx build \
        --platform linux/amd64 \
        --build-arg "NODE_ENV=$NODE_ENV" \
        --build-arg "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" \
        -t lawyer-frontend:latest \
        -f "$(dirname "$0")/../Dockerfile.frontend" \
        "$(dirname "$0")/../" \
        --load

    # Tag image with registry and environment
    if [ -n "$DOCKER_REGISTRY_SERVER" ]; then
      docker tag lawyer-frontend:latest "$DOCKER_REGISTRY_SERVER/lawyer-frontend:$env-latest" 
    fi
  fi

  if [ "$component" = "backend" ] || [ "$component" = "all" ]; then
    docker buildx build \
      --platform linux/amd64 \
      -t lawyer-backend:latest \
      -f "$(dirname "$0")/../Dockerfile.backend" \
      "$(dirname "$0")/../" \
      --load

    # Tag image with registry and environment
    if [ -n "$DOCKER_REGISTRY_SERVER" ]; then
      docker tag lawyer-backend:latest "$DOCKER_REGISTRY_SERVER/lawyer-backend:$env-latest"
    fi
  fi
  
  echo "Docker images built successfully."
}

# Function to push Docker images
function push_images {
  local env=$1
  local component=$2
  echo "Pushing Docker images to registry for $env environment..."
  
  # Login to Docker registry
  echo "$DOCKER_REGISTRY_TOKEN" | docker login -u "$DOCKER_REGISTRY_USERNAME" --password-stdin "$DOCKER_REGISTRY_SERVER"
  
  # Push images
  if [ -n "$DOCKER_REGISTRY_SERVER" ]; then
    if [ "$component" = "frontend" ] || [ "$component" = "all" ]; then
      docker push "$DOCKER_REGISTRY_SERVER/lawyer-frontend:$env-latest"
    fi
    if [ "$component" = "backend" ] || [ "$component" = "all" ]; then
      docker push "$DOCKER_REGISTRY_SERVER/lawyer-backend:$env-latest"
    fi
  else
    echo "Error: DOCKER_REGISTRY_SERVER environment variable must be set to push images"
    exit 1
  fi
  
  echo "Docker images pushed successfully."
}

# Function to deploy the application
function deploy_app {
  local env=$1
  local component=$2
  echo "Deploying application to $env environment..."
  
  # Get the absolute path to the deploy directory
  local deploy_dir=$(cd "$(dirname "$0")" && pwd)
  
  # Set environment variables for Ansible
  export ANSIBLE_CONFIG="$deploy_dir/ansible/ansible.cfg"
  export ANSIBLE_INVENTORY="$deploy_dir/ansible/inventory.yml"
  export DEPLOY_ENV="$env"
  export DEPLOY_COMPONENT="$component"
  
  # Run Ansible playbook with debug output
  cd "$deploy_dir/ansible"
  echo "Running Ansible playbook for environment: $env, component: $component"
  echo "Inventory file: $ANSIBLE_INVENTORY"
  echo "Ansible config: $ANSIBLE_CONFIG"
  
  # Use -vvv for verbose output to debug issues
  ansible-playbook playbook.yml -e "deploy_env=$env" -e "deploy_component=$component" -e "skip_ssl=$SKIP_SSL"
  
  echo "Application deployed successfully."
}

# Check if command is provided
if [ -z "$1" ]; then
  show_usage
fi

COMMAND=$1
shift

# Check if environment is provided
if [ -z "$1" ]; then
  echo "Error: Environment must be specified"
  show_usage
fi

ENVIRONMENT=$1
shift

# Set default component to 'all' if not specified
COMPONENT=${1:-all}
shift

# Parse additional options
SKIP_SSL=true
PUSH_IMAGES=false

for arg in "$@"; do
  case $arg in
    --ssl) SKIP_SSL=false; shift ;;
    *) echo "Unknown option: $arg"; exit 1 ;;
  esac
done

# Validate component
if [ "$COMPONENT" != "frontend" ] && [ "$COMPONENT" != "backend" ] && [ "$COMPONENT" != "all" ]; then
  echo "Error: Invalid component. Must be 'frontend', 'backend', or 'all'"
  show_usage
fi

# Check environment variables
check_env_vars $ENVIRONMENT

# Execute the requested command
case $COMMAND in
  build)
    build_images $ENVIRONMENT $COMPONENT
    ;;
  push)
    PUSH_IMAGES=true
    push_images $ENVIRONMENT $COMPONENT
    ;;
  deploy)
    deploy_app $ENVIRONMENT $COMPONENT
    ;;
  all)
    build_images $ENVIRONMENT $COMPONENT
    PUSH_IMAGES=true
    push_images $ENVIRONMENT $COMPONENT
    deploy_app $ENVIRONMENT $COMPONENT
    ;;
  *)
    echo "Unknown command: $COMMAND"
    show_usage
    ;;
esac