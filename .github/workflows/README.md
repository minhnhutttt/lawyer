# GitHub Actions Workflow for Lawyer Application

This directory contains GitHub Actions workflows for automatically building, testing, and deploying the Lawyer application.

## Available Workflows

### Build and Deploy (`build-and-deploy.yml`)

This workflow automatically builds Docker images for changed components (frontend or backend) and deploys them based on the branch:

- **`develop` branch**: Deploys changed components to the **staging** environment.
- **`main` branch**: Deploys changed components to the **production** environment.

The workflow includes:
- **Automatic Change Detection**: Identifies changes in the `front-end/` directory or relevant root-level backend files (like *.py, requirements.txt) to determine which components need to be built and deployed.
- **Conditional Deployment**: Deployment jobs only run if changes are detected in the respective components for the target branch.
- **Manual Trigger**: Allows manual deployment to staging or production via the GitHub Actions UI.

## Setup

To use these workflows, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

| Secret Name                | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `DOCKER_REGISTRY_SERVER`   | The URL of your Docker registry (e.g., ghcr.io)                   |
| `DOCKER_REGISTRY_USERNAME` | Your Docker registry username                                     |
| `DOCKER_REGISTRY_TOKEN`    | Your Docker registry token                                        |
| `SLACK_WEBHOOK_URL`        | The URL of your Slack webhook for notifications                   |
| `STAGING_SSH_PRIVATE_KEY`  | The SSH private key for authentication to the staging server      |
| `PRODUCTION_SSH_PRIVATE_KEY` | The SSH private key for authentication to the production server   |

## Usage

### Automatic Testing


### Automatic Deployment

The `Build and Deploy` workflow automatically runs when:
- Changes are pushed to the `main` branch (builds changed components and deploys to production).
- Changes are pushed to the `develop` branch (builds changed components and deploys to staging).
- Pull requests against `main` or `develop` trigger the `build` job but not the deployment jobs.

### Manual Deployment

You can manually trigger the `Build and Deploy` workflow:

1. Go to your GitHub repository.
2. Click on "Actions".
3. Select the "Build and Deploy" workflow.
4. Click "Run workflow".
5. Select the branch (`main` or `develop`).
6. Choose the environment (staging or production) - *Note: Manual trigger currently doesn't automatically determine changed components; it will likely attempt to build/deploy all components based on how the `workflow_dispatch` trigger interacts with the change detection logic.*
7. Click "Run workflow".

## Workflow Steps

### Build and Deploy Workflow (`build-and-deploy.yml`)

#### Build Job (`build`)

1.  **Checkout code**: Checks out the repository code (with full history for diffing).
2.  **Determine changed components**: Uses `git diff` to check for changes in `front-end/` directory (for frontend) and relevant root-level files (for backend) since the last commit. Outputs `frontend_changed` and `backend_changed` status.
3.  **Set up Docker Buildx**: Sets up Docker Buildx.
4.  **Login to Docker Registry**: Logs into the configured Docker registry.
5.  **Build and push frontend**: Conditionally builds and pushes the frontend Docker image if `frontend_changed` is true.
6.  **Build and push backend**: Conditionally builds and pushes the backend Docker image if `backend_changed` is true.

#### Deploy Job (`deploy-staging`)

*Runs only if `github.ref` is `refs/heads/develop` AND changes were detected in the build job.*

1.  **Checkout code**: Checks out the repository code.
2.  **Write down SSH key**: Writes the staging SSH key to a file.
3.  **Set up Python**: Sets up Python environment.
4.  **Install Ansible**: Installs Ansible.
5.  **Determine Components to Deploy**: Determines if `frontend`, `backend`, or `all` should be deployed based on the outputs from the `build` job.
6.  **Deploy to Staging Locally**: Executes `./deploy/deploy.sh deploy staging <components>` locally in the runner, which uses Ansible to deploy the specified components to the staging environment.

#### Deploy Job (`deploy-production`)

*Runs only if `github.ref` is `refs/heads/main` AND changes were detected in the build job.*

1.  **Checkout code**: Checks out the repository code.
2.  **Write down SSH key**: Writes the production SSH key to a file.
3.  **Set up Python**: Sets up Python environment.
4.  **Install Ansible**: Installs Ansible.
5.  **Determine Components to Deploy**: Determines if `frontend`, `backend`, or `all` should be deployed based on the outputs from the `build` job.
6.  **Deploy to Production Locally**: Executes `./deploy/deploy.sh deploy production <components>` locally in the runner, which uses Ansible to deploy the specified components to the production environment.

## Troubleshooting

If the workflows fail, check the following:

1.  **Secrets**: Ensure all required secrets are correctly configured in GitHub Actions settings.
2.  **Docker Registry**: Verify Docker registry credentials and server URL.
3.  **Ansible/SSH Access**: Ensure SSH keys are correct and the Ansible inventory (`deploy/ansible/inventory.yml`) points to the correct hosts. Check network connectivity and firewall rules if Ansible fails to connect.
4.  **Deployment Script**: Verify the `./deploy/deploy.sh` script and the Ansible playbook (`deploy/ansible/playbook.yml`) are correctly configured for your environments.
5.  **Change Detection**: If deployments aren't triggering as expected, check the logs of the "Determine changed components" step in the `build` job. Ensure the git diff patterns match your project structure (root-level backend, `front-end/` for frontend).
6.  **Tests**: Ensure all tests defined in the `Test` workflow are passing.

## Customization

You can customize the workflows by modifying the `.github/workflows/*.yml` files. For example, you can:

- Adjust the paths used for change detection.
- Modify the Ansible playbook for different deployment tasks.
- Add more steps for notifications, database migrations, etc.
- Change the branches that trigger the workflows. 