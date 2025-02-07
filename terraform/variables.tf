variable "region" {
  description = "AWS region"
  default     = "us-west-2"
}


variable "ecr_repository_url" {
  description = "AWS Elastic Container Registery Url"
  type = string
  sensitive = true
  default = "586794453336.dkr.ecr.us-west-2.amazonaws.com/"
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default = "mysecret"
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
  default = [
    "subnet-003398478c7b13c75",
    "subnet-0f1328fbee3eb3dca",
    "subnet-0faa1734d64eded50",
    "subnet-0f349344389d7c4c6"
  ]
}

variable "security_groups" {
  description = "Security groups for ECS service"
  type        = list(string)
  default = ["sg-006ba7e79867d12e5"]
}