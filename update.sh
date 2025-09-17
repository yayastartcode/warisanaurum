#!/bin/bash

# WARISAN Update Script
# Script untuk update aplikasi setelah push ke GitHub

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
APP_NAME="warisan"
APP_DIR="/var/www/warisan"
BACKEND_PORT=3000

print_status "🔄 Starting WARISAN update process..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo"
    exit 1
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory $APP_DIR does not exist"
    print_error "Please run deploy-manual.sh first"
    exit 1
fi

cd $APP_DIR

# Backup current version
print_status "💾 Creating backup..."
BACKUP_DIR="/var/backups/warisan-$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r backend/dist $BACKUP_DIR/backend-dist 2>/dev/null || true
cp -r frontend/dist $BACKUP_DIR/frontend-dist 2>/dev/null || true
print_status "✅ Backup created at $BACKUP_DIR"

# Pull latest changes
print_status "📥 Pulling latest changes from GitHub..."
git fetch origin
git reset --hard origin/main

# Check if there are any changes
if git diff HEAD@{1} --quiet; then
    print_status "ℹ️ No changes detected, skipping build"
    exit 0
fi

print_status "📝 Changes detected, proceeding with update..."

# Install/update backend dependencies
print_status "📦 Updating backend dependencies..."
cd backend
npm ci --production

# Build backend
print_status "🔨 Building backend..."
npm run build

# Install/update frontend dependencies
print_status "📦 Updating frontend dependencies..."
cd ../frontend
npm ci

# Build frontend
print_status "🔨 Building frontend..."
npm run build

cd ..

# Restart backend with PM2
print_status "🔄 Restarting backend..."
pm2 restart ${APP_NAME}-backend

# Wait for backend to start
print_status "⏳ Waiting for backend to start..."
sleep 10

# Health checks
print_status "🏥 Performing health checks..."

# Check PM2 status
if pm2 list | grep -q "${APP_NAME}-backend.*online"; then
    print_status "✅ Backend is running"
else
    print_error "❌ Backend failed to start"
    print_error "🔄 Rolling back..."
    
    # Rollback
    if [ -d "$BACKUP_DIR/backend-dist" ]; then
        rm -rf backend/dist
        cp -r $BACKUP_DIR/backend-dist backend/dist
        pm2 restart ${APP_NAME}-backend
        print_status "✅ Rollback completed"
    fi
    
    pm2 logs ${APP_NAME}-backend --lines 20
    exit 1
fi

# Check backend API
if curl -f http://localhost:${BACKEND_PORT}/api/health > /dev/null 2>&1; then
    print_status "✅ Backend API is healthy"
else
    print_error "❌ Backend API health check failed"
    print_error "🔄 Rolling back..."
    
    # Rollback
    if [ -d "$BACKUP_DIR/backend-dist" ]; then
        rm -rf backend/dist
        cp -r $BACKUP_DIR/backend-dist backend/dist
        pm2 restart ${APP_NAME}-backend
        print_status "✅ Rollback completed"
    fi
    
    exit 1
fi

# Set proper permissions for frontend
print_status "🔐 Setting proper permissions..."
chown -R www-data:www-data frontend/dist
chmod -R 755 frontend/dist

# Reload Nginx to clear cache
print_status "🔄 Reloading Nginx..."
nginx -t && systemctl reload nginx

# Clean up old backups (keep last 5)
print_status "🧹 Cleaning up old backups..."
ls -t /var/backups/warisan-* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true

print_status "🎉 Update completed successfully!"
print_status "📱 Application: http://your-domain.com"
print_status "🔧 Backend API: http://your-domain.com/api"
print_status "📊 PM2 Status: pm2 status"
print_status "📋 PM2 Logs: pm2 logs ${APP_NAME}-backend"

# Show recent commits
print_status "📝 Recent changes:"
git log --oneline -5

print_status "✨ WARISAN has been updated successfully!"