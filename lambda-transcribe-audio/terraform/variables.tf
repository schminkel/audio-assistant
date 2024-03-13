
# Setup environment variables with the following names to set the values.
# The prefix TF_VAR_ is required for Terraform to recognize them as variables.
# Keep in mind that the prefix is not used to name the variables in the Terraform code.
# TF_VAR_AWS_ACCESS_KEY
# TF_VAR_AWS_SECRET_KEY
# TF_VAR_OPENAI_API_KEY
# TF_VAR_OPENAI_ORG_ID
# set them manually with e.g. export TF_VAR_AWS_ACCESS_KEY="my-access-key"
# or define them in your shell profile
# or define them as Codespaces secrets

# Alternatively, you can set the values in a file called secret.tfvars
# Then run Terraform with the -var-file option to reference the file.
# e.g. terraform -var-file="secret.tfvars"

variable "AWS_ACCESS_KEY_ID" {
  description = "AWS access key"
  type        = string
  sensitive   = true
}

variable "AWS_SECRET_ACCESS_KEY" {
  description = "AWS secret key"
  type        = string
  sensitive   = true
}