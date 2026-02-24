variable "aws_region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "lawyer"
}

variable "lightsail_blueprint_id" {
  description = "The ID for a virtual private server image"
  type        = string
  default     = "ubuntu_20_04"
}

variable "lightsail_bundle_id" {
  description = "The bundle ID for the Lightsail instance (the plan)"
  type        = string
  default     = "medium_2_0"  # Medium instance for staging
}

variable "key_name" {
  description = "The name of the key pair to use for SSH access"
  type        = string
  default     = null
}

variable "user_data" {
  description = "A string of initialization code to run on the instance"
  type        = string
  default     = ""
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "lawyerdb"
}

variable "db_username" {
  description = "The username for the database"
  type        = string
  sensitive   = true
  default     = "dbuser"  # Override this with a secure value
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
  default     = "dbpassword"  # Override this with a secure value
}

variable "lightsail_db_blueprint_id" {
  description = "The ID for the database blueprint"
  type        = string
  default     = "postgres_12"
}

variable "lightsail_db_bundle_id" {
  description = "The bundle ID for the database (the plan)"
  type        = string
  default     = "medium_2_0"  # Medium DB for staging
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket (optional, will be auto-generated if not provided)"
  type        = string
  default     = ""
}

variable "lightsail_bucket_bundle_id" {
  description = "The bundle ID for the Lightsail bucket"
  type        = string
  default     = "medium_1_0"  # Medium bucket for staging
}

variable "app_port" {
  description = "The port that the application runs on"
  type        = number
  default     = 3000
} 