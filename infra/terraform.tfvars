# =============================================================================
# HOROSCOPO APP - Terraform Configuration
# =============================================================================

project_name = "app-horoscopo"
aws_region   = "us-east-1"
environment  = "prod"

# =============================================================================
# APP RUNNER CONFIGURATION
# =============================================================================
backend_port      = 3030
backend_cpu       = "512"
backend_memory    = "1024"
cors_origin       = "https://horoscopo.ohanax.com,https://www.horoscopo.ohanax.com"
health_check_path = "/health"

# =============================================================================
# AMPLIFY CONFIGURATION
# =============================================================================
github_repo  = "Metav-dev/app-horoscopo"
frontend_url = "https://horoscopo.ohanax.com"

# =============================================================================
# DATABASE (PostgreSQL - Hetzner/Coolify)
# TODO: Criar database separado para horoscopo no Coolify
# =============================================================================
db_host     = "5.161.213.157"
db_port     = 5435
db_user     = "postgres"
db_password = "CHANGE_ME_HOROSCOPO_DB_PASSWORD"
db_name     = "horoscopo"
db_ssl      = "false"

# =============================================================================
# AUTH SERVICE INTEGRATION (Authify)
# =============================================================================
authify_url          = "https://p9mmmtfmim.us-east-1.awsapprunner.com"
authify_frontend_url = "https://auth.ohanax.com"
authify_api_key      = "CHANGE_ME_HOROSCOPO_AUTHIFY_API_KEY"

# =============================================================================
# JWT Configuration
# =============================================================================
jwt_secret     = "CHANGE_ME_JWT_SECRET_PROD"
jwt_expires_in = 86400

# =============================================================================
# BILLING SERVICE INTEGRATION
# =============================================================================
billing_api_url      = "https://fax3cspfgv.us-east-1.awsapprunner.com"
billing_frontend_url = "https://billing.ohanax.com"
billing_project_id   = "CHANGE_ME_HOROSCOPO_BILLING_PROJECT_ID"
billing_api_key      = "CHANGE_ME_HOROSCOPO_BILLING_API_KEY"
