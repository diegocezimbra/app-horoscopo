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

# Database Configuration
variable "db_host" {
  description = "PostgreSQL database host"
  type        = string
}

variable "db_port" {
  description = "PostgreSQL database port"
  type        = number
  default     = 5432
}

variable "db_user" {
  description = "PostgreSQL database user"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "horoscopo"
}

variable "db_ssl" {
  description = "Enable SSL for database connection"
  type        = string
  default     = "false"
}

# JWT Configuration
variable "jwt_secret" {
  description = "JWT secret for token validation"
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT token expiration time in seconds"
  type        = number
  default     = 3600
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
