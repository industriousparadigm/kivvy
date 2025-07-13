# Deployment Guide

This guide covers deploying KidsHiz to production environments.

## 🚀 Production Deployment

### Prerequisites

- Docker and Docker Compose
- Domain name with SSL certificate
- PostgreSQL database (managed service recommended)
- Redis instance (managed service recommended)
- SMTP email service
- Stripe account for payments

### Environment Setup

1. **Create production environment file**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Configure production values**
   ```bash
   # Database
   DATABASE_URL="postgresql://user:password@prod-db-host:5432/kidshiz"
   
   # Authentication
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="secure-32-char-secret"
   
   # Stripe (Live Keys)
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   
   # External Services
   GOOGLE_MAPS_API_KEY="production-maps-key"
   SENTRY_DSN="production-sentry-dsn"
   ```

### Docker Deployment

1. **Build and deploy**
   ```bash
   ./scripts/deploy.sh --backup --cleanup
   ```

2. **Verify deployment**
   ```bash
   curl https://your-domain.com/api/health
   ```

### Manual Deployment

1. **Build application**
   ```bash
   npm run build
   ```

2. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Start application**
   ```bash
   npm start
   ```

### Load Balancer Setup

For high availability, use a load balancer:

```nginx
upstream kidshiz_backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://kidshiz_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | Application URL |
| `NEXTAUTH_SECRET` | Yes | JWT secret (32+ chars) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `GOOGLE_MAPS_API_KEY` | No | Google Maps API key |
| `REDIS_HOST` | No | Redis host (optional) |
| `SENTRY_DSN` | No | Sentry error tracking |

### Database Configuration

**Recommended Production Settings:**
- PostgreSQL 16+
- Connection pooling enabled
- Read replicas for scaling
- Automated backups
- SSL connections required

### SSL/TLS Setup

1. **Obtain SSL certificate** (Let's Encrypt recommended)
2. **Configure Nginx** with SSL termination
3. **Enable HTTPS redirects**
4. **Set security headers**

### Monitoring Setup

1. **Sentry Error Tracking**
   ```javascript
   SENTRY_DSN="https://your-dsn@sentry.io/project"
   ```

2. **Health Checks**
   - Application: `/api/health`
   - Database: Include in health check
   - External services: Payment, email, maps

3. **Metrics Collection**
   - Performance metrics: `/api/metrics`
   - Business metrics: Bookings, revenue
   - Technical metrics: Response times, errors

## 🔒 Security

### Security Headers

Configure Nginx with security headers:

```nginx
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth:10m rate=1r/s;

location /api/ {
    limit_req zone=api burst=20 nodelay;
}

location /api/auth/ {
    limit_req zone=auth burst=5 nodelay;
}
```

### Database Security

- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular security updates
- Database firewall rules

## 📊 Performance

### Caching Strategy

1. **Static Assets**: CDN with long TTL
2. **API Responses**: Redis caching
3. **Database Queries**: Connection pooling
4. **Images**: Cloudinary optimization

### Performance Monitoring

Monitor these key metrics:

- **Response Time**: < 200ms for API calls
- **Uptime**: > 99.9% availability
- **Error Rate**: < 0.1% of requests
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1

### Scaling

**Horizontal Scaling:**
- Multiple application instances
- Load balancer distribution
- Database read replicas
- Redis clustering

**Vertical Scaling:**
- Increase instance resources
- Database optimization
- Connection pool tuning

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to production
        run: ./scripts/deploy.sh
```

### Deployment Stages

1. **Staging Environment**
   - Automated deployment from `develop` branch
   - Integration testing
   - User acceptance testing

2. **Production Environment**
   - Manual approval required
   - Blue-green deployment
   - Automated rollback on failure

## 📋 Maintenance

### Regular Tasks

1. **Database Maintenance**
   ```bash
   # Update statistics
   ANALYZE;
   
   # Vacuum tables
   VACUUM ANALYZE;
   
   # Check index usage
   SELECT * FROM pg_stat_user_indexes;
   ```

2. **Log Rotation**
   ```bash
   # Configure logrotate
   /var/log/kidshiz/*.log {
       daily
       rotate 30
       compress
       delaycompress
       missingok
       notifempty
   }
   ```

3. **Backup Verification**
   ```bash
   # Test database restore
   pg_restore --dry-run backup.sql
   
   # Verify backup integrity
   pg_dump --schema-only | diff - schema.sql
   ```

### Monitoring Checklist

- [ ] Application health checks
- [ ] Database performance
- [ ] SSL certificate expiry
- [ ] Disk space usage
- [ ] Memory consumption
- [ ] Error rates and logs
- [ ] Payment processing status
- [ ] Email delivery rates

### Troubleshooting

**Common Issues:**

1. **High Memory Usage**
   - Check for memory leaks
   - Review connection pools
   - Monitor background jobs

2. **Slow Database Queries**
   - Review query performance
   - Check index usage
   - Update table statistics

3. **Payment Failures**
   - Verify Stripe webhooks
   - Check API key validity
   - Review error logs

## 🆘 Emergency Procedures

### Incident Response

1. **Identify the issue**
   - Check monitoring alerts
   - Review error logs
   - Test application functionality

2. **Immediate response**
   - Scale resources if needed
   - Enable maintenance mode
   - Communicate with stakeholders

3. **Resolution**
   - Apply hotfix if possible
   - Rollback to previous version
   - Schedule proper fix

### Rollback Procedure

```bash
# Quick rollback using Docker
docker-compose down
docker-compose up -d --scale app=0
docker-compose up -d previous-version

# Database rollback (if needed)
psql -f backup-YYYY-MM-DD.sql
```

### Recovery Testing

Test recovery procedures regularly:

1. **Database Recovery**
   - Restore from backup
   - Verify data integrity
   - Test application functionality

2. **Application Recovery**
   - Deploy to clean environment
   - Run smoke tests
   - Verify all services

---

For additional support, contact the development team or refer to the monitoring dashboards for real-time system status.