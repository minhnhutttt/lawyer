resource "aws_lightsail_instance" "server" {
  name              = "${var.project_name}-${var.environment}"
  availability_zone = var.availability_zone
  blueprint_id      = var.blueprint_id
  bundle_id         = var.bundle_id
  key_pair_name     = var.key_pair_name
  tags              = var.tags

  user_data = var.user_data
}

resource "aws_lightsail_static_ip" "static_ip" {
  name = "${var.project_name}-${var.environment}-static-ip"
}

resource "aws_lightsail_static_ip_attachment" "static_ip_attachment" {
  static_ip_name = aws_lightsail_static_ip.static_ip.name
  instance_name  = aws_lightsail_instance.server.name
}

resource "aws_lightsail_instance_public_ports" "server_ports" {
  instance_name = aws_lightsail_instance.server.name

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }

  dynamic "port_info" {
    for_each = var.additional_ports
    content {
      protocol  = port_info.value.protocol
      from_port = port_info.value.from_port
      to_port   = port_info.value.to_port
    }
  }
} 