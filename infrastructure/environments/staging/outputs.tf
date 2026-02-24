output "staging_instance_public_ip" {
  description = "The public IP of the Lightsail instance"
  value       = module.lawyer_staging.public_ip
}

output "staging_instance_static_ip" {
  description = "The static IP of the Lightsail instance"
  value       = module.lawyer_staging.static_ip
}

output "staging_instance_name" {
  description = "The name of the Lightsail instance"
  value       = module.lawyer_staging.instance_name
}

output "staging_database_endpoint" {
  description = "The endpoint of the Lightsail database"
  value       = module.lawyer_staging.db_endpoint
}

output "staging_database_port" {
  description = "The port of the Lightsail database"
  value       = module.lawyer_staging.db_port
}

output "staging_bucket_name" {
  description = "The name of the Lightsail bucket"
  value       = module.lawyer_staging.bucket_name
}

output "staging_bucket_url" {
  description = "The URL of the Lightsail bucket"
  value       = module.lawyer_staging.bucket_url
}

output "staging_bucket_instance_access" {
  description = "The instance with access to the Lightsail bucket"
  value       = module.lawyer_staging.bucket_instance_access
} 