resource "aws_lightsail_bucket_resource_access" "instance_bucket_access" {
  bucket_name = aws_lightsail_bucket.bucket.name
  resource_name = aws_lightsail_instance.server.name
} 