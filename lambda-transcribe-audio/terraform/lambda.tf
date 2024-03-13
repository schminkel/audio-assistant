
########################################## ↓↓↓ Variables ↓↓↓ ###########################################

locals {
  build_timestamp = file("${path.module}/../.build-timestamp")
}

####################################### ↓↓↓ Lambda Function ↓↓↓ #########################################

resource "aws_lambda_function" "transcribe_audio_lambda" {
  provider      = aws
  function_name = "transcribe_audio_lambda"
  role          = aws_iam_role.transcribe_audio_lambda_role.arn
  handler       = "app.lambdaHandler"
  runtime       = "nodejs18.x"
  architectures = ["x86_64"]
  description   = "AWS Lambda function with Typescript"
  memory_size   = 128
  timeout       = 180
  filename      = "${path.module}/../${local.build_timestamp}-transcribe-audio-lambda.zip"

  environment {
    variables = {
    }
  }
}

############################################## ↓↓↓ Lambda Role/Policy ↓↓↓ ##############################################

resource "aws_iam_role" "transcribe_audio_lambda_role" {
  provider = aws
  name     = "transcribe_audio_lambda_role"

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
resource "aws_iam_role_policy_attachment" "transcribe_audio_lambda_AWSLambdaExecute-attach" {
  provider   = aws
  role       = aws_iam_role.transcribe_audio_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSLambdaExecute"
}

# AmazonTranscribeFullAccess
# Provides full access to Amazon Transcribe operations.
resource "aws_iam_role_policy_attachment" "transcribe_audio_lambda_AmazonTranscribeFullAccess-attach" {
  provider   = aws
  role       = aws_iam_role.transcribe_audio_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonTranscribeFullAccess"
}

# AmazonS3FullAccess
# Provides full access to all buckets via the AWS Management Console.
resource "aws_iam_role_policy_attachment" "transcribe_audio_lambda_AmazonS3FullAccess-attach" {
  provider   = aws
  role       = aws_iam_role.transcribe_audio_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

# AmazonDynamoDBFullAccess
# Provides full access to Amazon DynamoDB.
resource "aws_iam_role_policy_attachment" "ask_chatgpt_lambda_AmazonDynamoDBFullAccess-attach" {
  provider   = aws
  role       = aws_iam_role.transcribe_audio_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

######################################### ↓↓↓ Cloud Watch Group for Lambda ↓↓↓ #########################################

resource "aws_cloudwatch_log_group" "transcribe_audio_lambda_log_group" {
  provider          = aws
  name              = "/aws/lambda/${aws_lambda_function.transcribe_audio_lambda.function_name}"
  retention_in_days = 30
}

################################################# ↓↓↓ S3 Buckets ↓↓↓ ###################################################

# S3 input bucket
resource "aws_s3_bucket" "transcribe_audio_input_bucket" {
  bucket = "schminkel-transcribe-audio-input-bucket"
}
resource "aws_s3_bucket_cors_configuration" "transcribe_audio_input_bucket_cors" {
  bucket = aws_s3_bucket.transcribe_audio_input_bucket.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "PUT", "POST", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}
resource "aws_s3_bucket_public_access_block" "transcribe_audio_input_bucket_block" {
  bucket                  = aws_s3_bucket.transcribe_audio_input_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket Policy
resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.transcribe_audio_input_bucket.id
  policy = data.aws_iam_policy_document.transcribe_audio_input_bucket_policy.json
}
data "aws_iam_policy_document" "transcribe_audio_input_bucket_policy" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    actions = [
      "s3:PutObject",
    ]
    resources = [
      "${aws_s3_bucket.transcribe_audio_input_bucket.arn}/*",
    ]
  }
}

# Bucket Object Ownership
resource "aws_s3_bucket_ownership_controls" "transcribe_audio_input_bucket_ownership_controls" {
  bucket = aws_s3_bucket.transcribe_audio_input_bucket.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

# S3 input trigger and permissions
resource "aws_s3_bucket_notification" "transcribe_audio_trigger" {
  bucket = aws_s3_bucket.transcribe_audio_input_bucket.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.transcribe_audio_lambda.arn
    events              = ["s3:ObjectCreated:*"]
  }
}
resource "aws_lambda_permission" "s3-permission" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.transcribe_audio_lambda.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.transcribe_audio_input_bucket.id}"
}

# S3 output bucket
resource "aws_s3_bucket" "transcribe_audio_output_bucket" {
  bucket = "schminkel-transcribe-audio-output-bucket"
}

# TODO: CORS configuration for S3 input bucket
