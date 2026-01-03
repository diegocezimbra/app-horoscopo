# =============================================================================
# CARDAPIO DIGITAL - Terraform Configuration
# =============================================================================

project_name = "app-cardapio-digital"
aws_region   = "us-east-1"
environment  = "prod"

# =============================================================================
# APP RUNNER CONFIGURATION
# =============================================================================
backend_port      = 3030
backend_cpu       = "512"
backend_memory    = "1024"
cors_origin       = "https://menu.ohanax.com,https://menu.ohanax.com,https://www.menu.ohanax.com"
health_check_path = "/health"

# =============================================================================
# AMPLIFY CONFIGURATION
# =============================================================================
github_repo  = "Metav-dev/cardapio-digital"
frontend_url = "https://www.menu.ohanax.com"

# =============================================================================
# DATABASE (PostgreSQL - Hetzner/Coolify)
# =============================================================================
database_url = "postgres://postgres:Emtpqwe46JQHwVeYidAtQ2eobr6QXqhf5IsSLFt89ktxRUD5Xybo2EC5T76qTlvb@5.161.213.157:5434/postgres"

# =============================================================================
# AUTH SERVICE INTEGRATION (Authify)
# =============================================================================
authify_url          = "https://p9mmmtfmim.us-east-1.awsapprunner.com"
authify_frontend_url = "https://auth.ohanax.com"
authify_api_key      = "ak_b6f9a4f48ebda4944a399c3ed0692f22aeeae1b7467a53d8"

# =============================================================================
# JWT (same as Auth service for token validation)
# =============================================================================
jwt_secret = "authify-jwt-secret-prod-change-me"

# =============================================================================
# BILLING SERVICE INTEGRATION
# =============================================================================
billing_api_url      = "https://fax3cspfgv.us-east-1.awsapprunner.com"
billing_frontend_url = "https://billing.ohanax.com"
billing_project_id   = "a76752e3-b598-44c6-8e2a-e0e8eca2dfc5"
billing_api_key      = "bk_71b1e7013487fa532e58376cc4dae8630a792ec8f8fd5944"
