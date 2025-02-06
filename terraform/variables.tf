variable "region" {
  description = "AWS region"
  default     = "us-west-2"
}


variable "ecr_repository_url" {
  description = "AWS Elastic Container Registery Url"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

resource "aws_ecr_repository" "upfirstai_api_ts" {
  name                 = "upfirstai_api_ts"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}


variable "subnets" {
  description = "Subnets for ECS service"
  type        = list(string)
}

variable "security_groups" {
  description = "Security groups for ECS service"
  type        = list(string)
}