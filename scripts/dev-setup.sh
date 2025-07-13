#!/bin/bash

# KidsHiz Development Setup Script
# This script sets up the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check dependencies
check_dependencies() {
    log_info "Checking development dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 20+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version 18+ required. Current: $(node -v)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Setup environment file
setup_environment() {
    log_info "Setting up environment configuration..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            log_success "Created .env.local from .env.example"
            log_warning "Please review and update .env.local with your configuration"
        else
            log_error ".env.example file not found"
            exit 1
        fi
    else
        log_info ".env.local already exists"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing Node.js dependencies..."
    npm install
    log_success "Dependencies installed"
}

# Setup database
setup_database() {
    log_info "Setting up development database..."
    
    # Start PostgreSQL and Redis using Docker Compose
    log_info "Starting database services..."
    docker-compose -f docker-compose.dev.yml up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Check if database is ready
    until docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U kidshiz -d kidshiz; do
        log_info "Waiting for database..."
        sleep 2
    done
    
    log_success "Database is ready"
    
    # Generate Prisma client
    log_info "Generating Prisma client..."
    npx prisma generate
    
    # Run migrations
    log_info "Running database migrations..."
    npx prisma migrate dev --name init
    
    log_success "Database setup completed"
}

# Seed database
seed_database() {
    log_info "Seeding database with sample data..."
    npm run db:seed
    log_success "Database seeded"
}

# Setup additional tools
setup_tools() {
    if [ "$1" = "--with-tools" ]; then
        log_info "Starting additional development tools..."
        docker-compose -f docker-compose.dev.yml --profile tools up -d
        
        log_success "Development tools started:"
        log_info "  - pgAdmin: http://localhost:8080 (admin@kidshiz.local / admin)"
        log_info "  - Redis Commander: http://localhost:8081"
        log_info "  - MailHog: http://localhost:8025"
    fi
}

# Run tests
run_tests() {
    if [ "$1" = "--with-tests" ]; then
        log_info "Running initial tests..."
        npm run test
        log_success "Tests completed"
    fi
}

# Show development commands
show_commands() {
    log_success "Development environment setup completed!"
    echo ""
    echo -e "${GREEN}Available commands:${NC}"
    echo "  npm run dev              - Start development server"
    echo "  npm run db:studio        - Open Prisma Studio"
    echo "  npm run workers:dev      - Start background workers"
    echo "  npm run test             - Run unit tests"
    echo "  npm run test:e2e         - Run E2E tests"
    echo "  npm run lint             - Run linting"
    echo "  npm run type-check       - Run TypeScript checks"
    echo ""
    echo -e "${GREEN}Docker commands:${NC}"
    echo "  docker-compose -f docker-compose.dev.yml up -d    - Start all services"
    echo "  docker-compose -f docker-compose.dev.yml down     - Stop all services"
    echo "  docker-compose -f docker-compose.dev.yml logs     - View logs"
    echo ""
    echo -e "${GREEN}Database:${NC}"
    echo "  PostgreSQL: localhost:5432 (kidshiz/password)"
    echo "  Redis: localhost:6379"
    echo ""
    if docker-compose -f docker-compose.dev.yml ps | grep -q "tools"; then
        echo -e "${GREEN}Development tools:${NC}"
        echo "  pgAdmin: http://localhost:8080"
        echo "  Redis Commander: http://localhost:8081"
        echo "  MailHog: http://localhost:8025"
        echo ""
    fi
}

# Main setup function
main() {
    local with_tools=false
    local with_tests=false
    local skip_seed=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-tools)
                with_tools=true
                shift
                ;;
            --with-tests)
                with_tests=true
                shift
                ;;
            --skip-seed)
                skip_seed=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --with-tools    Start additional development tools (pgAdmin, Redis Commander, MailHog)"
                echo "  --with-tests    Run tests after setup"
                echo "  --skip-seed     Skip database seeding"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
    
    log_info "Setting up KidsHiz development environment..."
    
    # Run setup steps
    check_dependencies
    setup_environment
    install_dependencies
    setup_database
    
    if [ "$skip_seed" = false ]; then
        seed_database
    fi
    
    if [ "$with_tools" = true ]; then
        setup_tools --with-tools
    fi
    
    if [ "$with_tests" = true ]; then
        run_tests --with-tests
    fi
    
    show_commands
}

# Run main function
main "$@"