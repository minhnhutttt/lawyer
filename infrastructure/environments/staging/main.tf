terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Uncomment to use remote backend (e.g., S3)
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "lawyer/staging/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-lock"
  # }
}

provider "aws" {
  region = var.aws_region
}

module "lawyer_staging" {
  source = "../../modules/lightsail"

  project_name = var.project_name
  environment  = "staging"
  
  # Instance configuration
  availability_zone = "${var.aws_region}a"
  blueprint_id      = var.lightsail_blueprint_id
  bundle_id         = var.lightsail_bundle_id  # Medium instance for staging
  key_pair_name     = var.key_name
  user_data         = var.user_data
  
  # Database configuration
  db_name           = var.db_name
  db_username       = var.db_username
  db_password       = var.db_password
  db_blueprint_id   = var.lightsail_db_blueprint_id
  db_bundle_id      = var.lightsail_db_bundle_id  # Medium DB for staging
  db_backup_retention = true  # Enable backup retention for staging
  
  # Bucket configuration
  bucket_name       = var.s3_bucket_name != "" ? var.s3_bucket_name : "${var.project_name}-staging-bucket"
  bucket_bundle_id  = var.lightsail_bucket_bundle_id
  
  # Additional ports for the instance
  additional_ports = [
    {
      protocol  = "tcp"
      from_port = var.app_port
      to_port   = var.app_port
    }
  ]
  
  tags = {
    Application = var.project_name
    Environment = "staging"
  }
} 