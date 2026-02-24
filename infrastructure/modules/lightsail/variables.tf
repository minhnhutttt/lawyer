variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, production)"
  type        = string
}

variable "availability_zone" {
  description = "The AWS availability zone to deploy resources in"
  type        = string
  default     = "us-east-1a"
}

# Instance variables
variable "blueprint_id" {
  description = "The ID for a virtual private server image"
  type        = string
  default     = "ubuntu_20_04"
}

variable "bundle_id" {
  description = "The bundle ID for the Lightsail instance (the plan)"
  type        = string
  default     = "medium_2_0"
}

variable "key_pair_name" {
  description = "The name of the key pair to use for SSH access"
  type        = string
  default     = null
}

variable "user_data" {
  description = "A string of initialization code to run on the instance"
  type        = string
  default     = ""
}

variable "additional_ports" {
  description = "Additional ports to open on the Lightsail instance"
  type        = list(object({
    protocol  = string
    from_port = number
    to_port   = number
  }))
  default     = []
}

# Database variables
variable "db_name" {
  description = "The name of the database"
  type        = string
}

variable "db_username" {
  description = "The username for the database"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The password for the database"
  type        = string
  sensitive   = true
}

variable "db_blueprint_id" {
  description = "The ID for the database blueprint"
  type        = string
  default     = "postgres_12"
}

variable "db_bundle_id" {
  description = "The bundle ID for the database (the plan)"
  type        = string
  default     = "medium_2_0"
}

variable "db_backup_retention" {
  description = "Whether to enable automated backups for the database"
  type        = bool
  default     = true
}

# Bucket variables
variable "bucket_name" {
  description = "The name of the Lightsail bucket"
  type        = string
  default     = ""
}

variable "bucket_bundle_id" {
  description = "The bundle ID for the Lightsail bucket"
  type        = string
  default     = "small_1_0"
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}
