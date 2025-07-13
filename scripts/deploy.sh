#!/bin/bash

# KidsHiz Deployment Script
# This script handles the deployment of the KidsHiz application

set -e  # Exit on any error

# Configuration
APP_NAME="kidshiz"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Check if environment file exists
check_environment() {
    log_info "Checking environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Production environment file ($ENV_FILE) not found"
        log_info "Creating from .env.example..."
        
        if [ -f ".env.example" ]; then
            cp .env.example "$ENV_FILE"
            log_warning "Please edit $ENV_FILE with production values before continuing"
            exit 1
        else
            log_error ".env.example file not found"
            exit 1
        fi
    fi
    
    log_success "Environment configuration found"
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    
    # Create backups directory if it doesn't exist
    mkdir -p backups
    
    # Generate backup filename with timestamp
    BACKUP_FILE="backups/kidshiz_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    # Create backup if postgres container is running
    if docker-compose ps postgres | grep -q "Up"; then
        docker-compose exec -T postgres pg_dump -U kidshiz kidshiz > "$BACKUP_FILE"
        log_success "Database backup created: $BACKUP_FILE"
    else
        log_warning "Postgres container not running, skipping backup"
    fi
}

# Build and deploy
deploy() {
    log_info "Starting deployment..."
    
    # Pull latest changes (if this is a git deployment)
    if [ -d ".git" ]; then
        log_info "Pulling latest changes from git..."
        git pull origin main
    fi
    
    # Build new images
    log_info "Building Docker images..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Start services
    log_info "Starting services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    
    # Wait for services to be healthy
    log_info "Waiting for services to be healthy..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
        log_success "Services are running"
    else
        log_error "Some services failed to start"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs
        exit 1
    fi
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Wait for database to be ready
    sleep 5
    
    # Run Prisma migrations
    docker-compose -f "$DOCKER_COMPOSE_FILE" exec app npx prisma migrate deploy
    
    log_success "Database migrations completed"
}

# Seed database (optional)
seed_database() {
    if [ "$1" = "--seed" ]; then
        log_info "Seeding database..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" exec app npm run db:seed
        log_success "Database seeded"
    fi
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait a bit for services to fully start
    sleep 10
    
    # Check application health
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        log_success "Application is healthy"
    else
        log_error "Application health check failed"
        docker-compose -f "$DOCKER_COMPOSE_FILE" logs app
        exit 1
    fi
}

# Cleanup old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    log_success "Cleanup completed"
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --backup       Create database backup before deployment"
    echo "  --seed         Seed database after deployment"
    echo "  --no-build     Skip building new images"
    echo "  --no-migrate   Skip database migrations"
    echo "  --cleanup      Clean up old Docker images after deployment"
    echo "  --help         Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --backup --seed --cleanup"
}

# Main deployment function
main() {
    local backup=false
    local seed=false
    local build=true
    local migrate=true
    local cleanup_after=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backup)
                backup=true
                shift
                ;;
            --seed)
                seed=true
                shift
                ;;
            --no-build)
                build=false
                shift
                ;;
            --no-migrate)
                migrate=false
                shift
                ;;
            --cleanup)
                cleanup_after=true
                shift
                ;;
            --help)
                usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    log_info "Starting KidsHiz deployment..."
    
    # Run checks
    check_dependencies
    check_environment
    
    # Create backup if requested
    if [ "$backup" = true ]; then
        backup_database
    fi
    
    # Deploy application
    if [ "$build" = true ]; then
        deploy
    else
        log_info "Skipping build, restarting services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" up -d
    fi
    
    # Run migrations if requested
    if [ "$migrate" = true ]; then
        run_migrations
    fi
    
    # Seed database if requested
    if [ "$seed" = true ]; then
        seed_database --seed
    fi
    
    # Health check
    health_check
    
    # Cleanup if requested
    if [ "$cleanup_after" = true ]; then
        cleanup
    fi
    
    log_success "Deployment completed successfully!"
    log_info "Application is available at: http://localhost:3000"
    log_info "Admin panel: http://localhost:3000/admin"
    log_info "Health check: http://localhost:3000/api/health"
}

# Run main function with all arguments
main "$@"