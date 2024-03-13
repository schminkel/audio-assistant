
########################################## ↓↓↓ Variables ↓↓↓ ###########################################

locals {
  build_timestamp = file("../.build-timestamp")
}

####################################### ↓↓↓ Lambda Function ↓↓↓ #########################################

resource "aws_lambda_function" "ask_chatgpt_lambda" {
  provider      = aws
  function_name = "ask_chatgpt_lambda"
  role          = aws_iam_role.ask_chatgpt_lambda_role.arn
  handler       = "app.lambdaHandler"
  runtime       = "nodejs18.x"
  architectures = ["x86_64"]
  description   = "AWS Lambda function with Typescript"
  memory_size   = 128
  timeout       = 180
  filename      = "../${local.build_timestamp}-ask-chatgpt-lambda.zip"
  environment {
    variables = {
      OPENAI_ORG_ID  = var.OPENAI_ORG_ID
      OPENAI_API_KEY = var.OPENAI_API_KEY
    }
  }
}

############################################## ↓↓↓ Lambda Role/Policy ↓↓↓ ##############################################

resource "aws_iam_role" "ask_chatgpt_lambda_role" {
  provider = aws
  name     = "ask_chatgpt_lambda_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

# AWSLambdaExecute
# Provides Put, Get access to S3 and full access to CloudWatch Logs.
resource "aws_iam_role_policy_attachment" "ask_chatgpt_lambda_AWSLambdaExecute-attach" {
  provider   = aws
  role       = aws_iam_role.ask_chatgpt_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaExecute"
}

# AmazonDynamoDBFullAccess
# Provides full access to Amazon DynamoDB.
resource "aws_iam_role_policy_attachment" "ask_chatgpt_lambda_AmazonDynamoDBFullAccess-attach" {
  provider   = aws
  role       = aws_iam_role.ask_chatgpt_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# AmazonS3FullAccess
# Provides full access to all buckets via the AWS Management Console.
resource "aws_iam_role_policy_attachment" "ask_chatgpt_lambda_AmazonS3FullAccess-attach" {
  provider   = aws
  role       = aws_iam_role.ask_chatgpt_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

######################################### ↓↓↓ Cloud Watch Group for Lambda ↓↓↓ #########################################

resource "aws_cloudwatch_log_group" "ask_chatgpt_lambda_log_group" {
  provider          = aws
  name              = "/aws/lambda/${aws_lambda_function.ask_chatgpt_lambda.function_name}"
  retention_in_days = 30
}

################################################# ↓↓↓ S3 Trigger ↓↓↓ ###################################################

# S3 input trigger and permissions
resource "aws_s3_bucket_notification" "ask_chatgpt_trigger" {
  bucket = "schminkel-transcribe-audio-output-bucket"
  lambda_function {
    lambda_function_arn = aws_lambda_function.ask_chatgpt_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".json"
  }
}
resource "aws_lambda_permission" "s3-permission" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ask_chatgpt_lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::schminkel-transcribe-audio-output-bucket"
}
