provider "aws" {
  region = var.region
}

resource "aws_ecs_cluster" "oauth_cluster" {
  name = "upfirstai_api_cluster"
}

resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

resource "aws_iam_role" "github_oidc" {
  name = "GitHubOIDCRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow",
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      },
      Action = "sts:AssumeRoleWithWebIdentity",
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub" = "repo:diopisemou/*"
        }
      }
    }]
  })
}


resource "aws_ecs_task_definition" "oauth_task" {
  family                   = "upfirstai_api_ts_task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  
  container_definitions = jsonencode([{
    name  = "upfirstai_api_ts"
    image = "${aws_ecr_repository.upfirstai_api_ts.repository_url}:latest"
    portMappings = [{
      containerPort = 8080
      hostPort      = 8080
    }]
  }])
}


