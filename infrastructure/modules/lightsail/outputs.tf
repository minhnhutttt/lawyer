output "public_ip" {
  description = "The public IP address of the Lightsail instance"
  value       = aws_lightsail_instance.server.public_ip_address
}

output "static_ip" {
  description = "The static IP address assigned to the Lightsail instance"
  value       = aws_lightsail_static_ip.static_ip.ip_address
}

output "instance_name" {
  description = "The name of the Lightsail instance"
  value       = aws_lightsail_instance.server.name
}

output "bucket_name" {
  description = "The name of the Lightsail bucket"
  value       = aws_lightsail_bucket.bucket.name
}

output "bucket_url" {
  description = "The URL of the Lightsail bucket"
  value       = aws_lightsail_bucket.bucket.url
}

output "db_endpoint" {
  description = "The endpoint of the Lightsail database"
  value       = aws_lightsail_database.db.master_endpoint_address
}

output "db_port" {
  description = "The database port"
  value       = aws_lightsail_database.db.master_endpoint_port
}

output "bucket_instance_access" {
  description = "The instance with access to the bucket"
  value       = aws_lightsail_bucket_resource_access.instance_bucket_access.resource_name
} 