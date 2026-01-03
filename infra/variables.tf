variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "backend_port" {
  description = "Backend container port"
  type        = number
  default     = 3030
}

variable "backend_cpu" {
  description = "Backend CPU units (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "256"
}

variable "backend_memory" {
  description = "Backend memory (512, 1024, 2048, 3072, 4096, etc)"
  type        = string
  default     = "512"
}

variable "cors_origin" {
  description = "CORS origin URL"
  type        = string
  default     = "*"
}

variable "health_check_path" {
  description = "Health check endpoint path"
  type        = string
  default     = "/health"
}

variable "github_repo" {
  description = "GitHub repository (owner/repo)"
  type        = string
  default     = ""
}

# Frontend URL
variable "frontend_url" {
  description = "Frontend URL"
  type        = string
}

# Backend secrets
variable "database_url" {
  description = "PostgreSQL database URL"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for token validation"
  type        = string
  sensitive   = true
}

# Authify Configuration
variable "authify_api_key" {
  description = "API Key for Authify"
  type        = string
  sensitive   = true
}

variable "authify_url" {
  description = "Authify Backend URL"
  type        = string
}

variable "authify_frontend_url" {
  description = "Authify Frontend URL (hosted login pages)"
  type        = string
}

# Billing Configuration
variable "billing_api_url" {
  description = "Billing API URL"
  type        = string
}

variable "billing_frontend_url" {
  description = "Billing Frontend URL (checkout pages)"
  type        = string
}

variable "billing_project_id" {
  description = "Billing Project ID"
  type        = string
}

variable "billing_api_key" {
  description = "Billing API Key"
  type        = string
  sensitive   = true
}
