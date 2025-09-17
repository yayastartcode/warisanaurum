# WARISAN - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Readiness
- [ ] All features implemented and tested
- [ ] No console.log or debug code in production
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] Code reviewed and approved

### ✅ Environment Setup
- [ ] `.env` file created from `.env.production` template
- [ ] Database credentials configured
- [ ] JWT secrets generated (minimum 32 characters)
- [ ] CORS origins configured correctly
- [ ] SSL certificates obtained (for HTTPS)

### ✅ Infrastructure Requirements
- [ ] VPS with minimum 2GB RAM
- [ ] Docker and Docker Compose installed
- [ ] Domain name configured (optional)
- [ ] Firewall rules configured
- [ ] SSH access secured

## Deployment Steps

### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
```

### 2. Application Deployment
```bash
# Clone repository
git clone <your-repository-url>
cd warum

# Setup environment
cp .env.production .env
nano .env  # Edit with your configuration

# Deploy
chmod +x deploy.sh
./deploy.sh
```

### 3. Post-Deployment Verification
- [ ] All containers running: `docker-compose ps`
- [ ] Backend health check: `curl http://localhost:3000/api/health`
- [ ] Frontend accessible: `curl http://localhost`
- [ ] Database connection working
- [ ] Application functionality tested

## Security Checklist

### ✅ Server Security
- [ ] SSH key-based authentication enabled
- [ ] Root login disabled
- [ ] Firewall configured (UFW recommended)
- [ ] Fail2ban installed and configured
- [ ] Regular security updates enabled

### ✅ Application Security
- [ ] Strong JWT secrets configured
- [ ] Database credentials secured
- [ ] HTTPS enabled (SSL certificates)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented

### ✅ Database Security
- [ ] MongoDB authentication enabled
- [ ] Strong database passwords
- [ ] Database access restricted to application only
- [ ] Regular backups configured

## Monitoring Setup

### ✅ Health Monitoring
- [ ] Application health checks working
- [ ] Log aggregation configured
- [ ] Disk space monitoring
- [ ] Memory usage monitoring
- [ ] CPU usage monitoring

### ✅ Backup Strategy
- [ ] Database backup script tested
- [ ] Backup schedule configured (cron job)
- [ ] Backup restoration tested
- [ ] Off-site backup storage configured

## Maintenance Tasks

### Daily
- [ ] Check application logs
- [ ] Monitor resource usage
- [ ] Verify backup completion

### Weekly
- [ ] Review security logs
- [ ] Update dependencies (if needed)
- [ ] Performance monitoring

### Monthly
- [ ] Security audit
- [ ] Backup restoration test
- [ ] Capacity planning review
- [ ] Update system packages

## Troubleshooting

### Common Issues

1. **Container won't start**
   ```bash
   docker-compose logs [service-name]
   ```

2. **Database connection failed**
   - Check MongoDB container status
   - Verify credentials in .env
   - Check network connectivity

3. **Frontend not accessible**
   - Check nginx configuration
   - Verify port mappings
   - Check firewall rules

4. **High memory usage**
   ```bash
   docker stats
   ```

### Emergency Procedures

1. **Application rollback**
   ```bash
   git checkout [previous-commit]
   ./deploy.sh
   ```

2. **Database restore**
   ```bash
   # Stop application
   docker-compose down
   
   # Restore from backup
   docker-compose up -d mongodb
   docker-compose exec mongodb mongorestore /backup/path
   
   # Restart application
   docker-compose up -d
   ```

3. **Emergency contacts**
   - Development team: [contact-info]
   - Infrastructure team: [contact-info]
   - Database admin: [contact-info]

## Performance Optimization

### ✅ Frontend Optimization
- [ ] Static assets cached
- [ ] Gzip compression enabled
- [ ] CDN configured (optional)
- [ ] Image optimization

### ✅ Backend Optimization
- [ ] Database indexes optimized
- [ ] API response caching
- [ ] Connection pooling configured
- [ ] Memory limits set

### ✅ Database Optimization
- [ ] Proper indexing strategy
- [ ] Query optimization
- [ ] Connection limits configured
- [ ] Regular maintenance tasks

---

**Note**: This checklist should be customized based on your specific infrastructure and requirements. Always test deployment procedures in a staging environment first.