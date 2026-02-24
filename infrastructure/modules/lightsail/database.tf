resource "aws_lightsail_database" "db" {
  relational_database_name = "${var.project_name}-${var.environment}-db"
  availability_zone        = var.availability_zone
  master_database_name     = var.db_name
  master_username          = var.db_username
  master_password          = var.db_password
  blueprint_id             = var.db_blueprint_id
  bundle_id                = var.db_bundle_id
  backup_retention_enabled = var.db_backup_retention
  skip_final_snapshot      = var.environment != "production"
  final_snapshot_name      = var.environment == "production" ? "${var.project_name}-${var.environment}-final-snapshot" : null
  publicly_accessible      = false
  
  tags = var.tags
} 