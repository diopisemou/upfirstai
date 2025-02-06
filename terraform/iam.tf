resource "aws_iam_role" "github_actions" {
  name = "GitHubActionsDeploymentRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        AWS = "arn:aws:iam::586794453336:root"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

