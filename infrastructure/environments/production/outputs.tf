output "production_instance_public_ip" {
  description = "The public IP of the Lightsail instance"
  value       = module.lawyer_production.public_ip
}

output "production_instance_static_ip" {
  description = "The static IP of the Lightsail instance"
  value       = module.lawyer_production.static_ip
}

output "production_instance_name" {
  description = "The name of the Lightsail instance"
  value       = module.lawyer_production.instance_name
}

output "production_database_endpoint" {
  description = "The endpoint of the Lightsail database"
  value       = module.lawyer_production.db_endpoint
}

output "production_database_port" {
  description = "The port of the Lightsail database"
  value       = module.lawyer_production.db_port
}

output "production_bucket_name" {
  description = "The name of the Lightsail bucket"
  value       = module.lawyer_production.bucket_name
}

output "production_bucket_url" {
  description = "The URL of the Lightsail bucket"
  value       = module.lawyer_production.bucket_url
}

output "production_bucket_instance_access" {
  description = "The instance with access to the Lightsail bucket"
  value       = module.lawyer_production.bucket_instance_access
} 