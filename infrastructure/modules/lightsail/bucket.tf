resource "aws_lightsail_bucket" "bucket" {
  name      = var.bucket_name != "" ? var.bucket_name : "${var.project_name}-${var.environment}-bucket"
  bundle_id = var.bucket_bundle_id
  tags      = var.tags
} 