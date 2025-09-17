#!/bin/bash

# WARISAN Manual Deployment Script for VPS
# For VPS with Node.js, PM2, and Nginx already installed

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
NGINX_CONFIG="/etc/nginx/sites-available/warisan"
NGINX_ENABLED="/etc/nginx/sites-enabled/warisan"
BACKEND_PORT=3000
FRONTEND_PORT=5173

print_status "🚀 Starting WARISAN manual deployment..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed"
    exit 1
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    print_error "Nginx is not installed"
    exit 1
fi

print_status "✅ All prerequisites are installed"

# Create app directory
print_status "📁 Creating application directory..."
mkdir -p $APP_DIR
cd $APP_DIR

# Clone or update repository
if [ -d ".git" ]; then
    print_status "🔄 Updating existing repository..."
    git pull origin main
else
    print_status "📥 Cloning repository..."
    # Replace with your actual repository URL
    git clone https://github.com/your-username/warisan.git .
fi

# Setup environment files
print_status "⚙️ Setting up environment files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_warning "Please edit backend/.env with your configuration"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    print_warning "Please edit frontend/.env with your configuration"
fi

# Install backend dependencies
print_status "📦 Installing backend dependencies..."
cd backend
npm install --production

# Build backend
print_status "🔨 Building backend..."
npm run build

# Install frontend dependencies
print_status "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
print_status "🔨 Building frontend..."
npm run build

# Setup PM2 ecosystem file
print_status "⚙️ Setting up PM2 configuration..."
cd ..
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: '${APP_NAME}-backend',
      script: './backend/dist/index.js',
      cwd: '${APP_DIR}',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: ${BACKEND_PORT}
      },
      error_file: '${APP_DIR}/logs/backend-error.log',
      out_file: '${APP_DIR}/logs/backend-out.log',
      log_file: '${APP_DIR}/logs/backend.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
EOF

# Create logs directory
mkdir -p logs

# Stop existing PM2 processes
print_status "🛑 Stopping existing PM2 processes..."
pm2 stop ${APP_NAME}-backend 2>/dev/null || true
pm2 delete ${APP_NAME}-backend 2>/dev/null || true

# Start backend with PM2
print_status "🚀 Starting backend with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup Nginx configuration
print_status "⚙️ Setting up Nginx configuration..."
cat > $NGINX_CONFIG << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Frontend static files
    location / {
        root ${APP_DIR}/frontend/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:${BACKEND_PORT}/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Logs
    access_log /var/log/nginx/warisan_access.log;
    error_log /var/log/nginx/warisan_error.log;
}
EOF

# Enable Nginx site
print_status "🔗 Enabling Nginx site..."
ln -sf $NGINX_CONFIG $NGINX_ENABLED

# Remove default Nginx site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "🧪 Testing Nginx configuration..."
nginx -t

# Reload Nginx
print_status "🔄 Reloading Nginx..."
systemctl reload nginx

# Set proper permissions
print_status "🔐 Setting proper permissions..."
chown -R www-data:www-data $APP_DIR/frontend/dist
chmod -R 755 $APP_DIR/frontend/dist

# Health check
print_status "🏥 Performing health checks..."
sleep 5

# Check PM2 status
if pm2 list | grep -q "${APP_NAME}-backend.*online"; then
    print_status "✅ Backend is running"
else
    print_error "❌ Backend failed to start"
    pm2 logs ${APP_NAME}-backend --lines 20
    exit 1
fi

# Check backend API
if curl -f http://localhost:${BACKEND_PORT}/api/health > /dev/null 2>&1; then
    print_status "✅ Backend API is healthy"
else
    print_error "❌ Backend API health check failed"
    exit 1
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx is not running"
    exit 1
fi

print_status "🎉 Deployment completed successfully!"
print_status "📱 Application: http://your-domain.com (or server IP)"
print_status "🔧 Backend API: http://your-domain.com/api"
print_status "📊 PM2 Status: pm2 status"
print_status "📋 PM2 Logs: pm2 logs ${APP_NAME}-backend"
print_status "🔄 PM2 Restart: pm2 restart ${APP_NAME}-backend"

print_status "📝 Next steps:"
echo "  1. Update your domain in Nginx config: $NGINX_CONFIG"
echo "  2. Setup SSL certificate (Let's Encrypt recommended)"
echo "  3. Configure your database connection in backend/.env"
echo "  4. Update frontend/.env with your API URL"
echo "  5. Setup firewall rules (UFW recommended)"

print_status "✨ WARISAN is now running on your VPS!"