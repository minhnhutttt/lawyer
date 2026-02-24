# Lawyer Infrastructure

This repository contains the Terraform configuration for the lawyer application infrastructure, using AWS Lightsail for compute, database, and object storage.

## Multi-Environment Setup

The infrastructure is set up with multiple environments to support the full development lifecycle:

- **Development (dev)**: For development and testing
- **Staging**: For pre-production testing
- **Production**: For the live application

Each environment has its own configuration, allowing for different resource sizes and settings appropriate to each stage.

## Directory Structure

```
infrastructure/
├── modules/              # Reusable Terraform modules
│   └── lightsail/        # AWS Lightsail module
├── environments/         # Environment-specific configurations
│   ├── dev/              # Development environment
│   ├── staging/          # Staging environment
│   └── production/       # Production environment
└── README.md             # This file
```

## How to Use

### Development Environment

To deploy the development environment:

```bash
cd infrastructure/environments/dev
terraform init
terraform plan
terraform apply
```

### Staging Environment

To deploy the staging environment:

```bash
cd infrastructure/environments/staging
terraform init
terraform plan
terraform apply
```

### Production Environment

To deploy the production environment:

```bash
cd infrastructure/environments/production
terraform init
terraform plan
terraform apply
```

## Environment Differences

### Development
- Smaller instance sizes
- No database backup retention
- Minimal resources for cost efficiency

### Staging
- Medium instance sizes
- Database backup retention enabled
- More resources for realistic testing

### Production
- Larger instance sizes
- Database backup retention enabled
- Maximum resources for production workloads

## Bucket-Instance Access

Each environment's Lightsail instance is automatically granted access to its corresponding Lightsail bucket using the `aws_lightsail_bucket_resource_access` resource, eliminating the need to manage credentials like access keys.

## Notes

- Sensitive values like database credentials should be managed using environment-specific variable files that are not committed to version control.
- Consider using a remote backend (S3) for state storage in team environments.

## Structure

```
infrastructure/
├── main.tf              # Main Terraform configuration
├── variables.tf         # Variable definitions
├── outputs.tf           # Output definitions
├── terraform.tfvars.example # Example variable values
├── modules/             # Reusable Terraform modules
│   └── lightsail/       # Lightsail infrastructure (instance, database, bucket)
└── README.md            # This file
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0+)
- AWS account with appropriate permissions
- AWS CLI configured with access credentials
- SSH key pair created in AWS Lightsail

## Getting Started

1. Copy the example variables file and customize it for your environment:

```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` to set your specific values:
   - Set proper database credentials
   - Configure Lightsail blueprint (OS) and bundle (plan)
   - Configure SSH key pair name
   - Set user data script for instance initialization
   - Configure bucket settings

3. Initialize Terraform:

```bash
terraform init
```

4. Plan the deployment:

```bash
terraform plan
```

5. Apply the configuration:

```bash
terraform apply
```

6. When finished, you can destroy the infrastructure:

```bash
terraform destroy
```

## Module Details

### Lightsail Module

The Lightsail module creates all necessary AWS Lightsail resources:

#### Lightsail Instance
- Linux instance with selectable blueprint (OS)
- Configurable bundle (plan) based on resource needs
- Static IP address
- SSH key pair configuration
- User data script for initialization
- Firewall configuration for ports 22, 80, 443, and application port

#### Lightsail Database
- PostgreSQL database with selectable version
- Configurable bundle (plan) based on resource needs
- Automated backups
- Secure access configuration

#### Lightsail Bucket
- Object storage similar to S3 but at lower cost
- Configurable bundle size
- Optional versioning
- Access rules configuration

## Notes

- The default configuration is optimized for a small to medium workload
- For production deployments, review and adjust:
  - Instance and database bundle sizes
  - Backup retention settings
  - Security settings
  - User data script for production environment

## Customization

- Edit `variables.tf` to add new variables or change defaults
- Modify module configurations in `main.tf` for specialized requirements
- Adjust Lightsail blueprint and bundle IDs based on region availability and performance needs

## AWS Lightsail Benefits

- Simplified management compared to traditional AWS services
- Predictable, fixed monthly pricing
- Lower cost for small to medium-sized applications
- Easier configuration with less complexity
- Still offers the reliability and security of AWS 