#!/bin/bash

# WARISAN Setup Scripts
# Script untuk membuat semua deployment scripts executable

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

print_status "🔧 Setting up WARISAN deployment scripts..."

# Make all scripts executable
print_status "📝 Making scripts executable..."
chmod +x deploy-manual.sh
chmod +x update.sh
chmod +x webhook-setup.sh
chmod +x setup-scripts.sh

# Check if scripts exist
SCRIPTS=("deploy-manual.sh" "update.sh" "webhook-setup.sh")
for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        print_status "✅ $script is ready"
    else
        print_error "❌ $script not found"
    fi
done

# Check if config files exist
CONFIGS=("ecosystem.config.js" "nginx-site.conf" "Makefile")
for config in "${CONFIGS[@]}"; do
    if [ -f "$config" ]; then
        print_status "✅ $config is ready"
    else
        print_error "❌ $config not found"
    fi
done

# Create logs directory if not exists
if [ ! -d "logs" ]; then
    mkdir -p logs
    print_status "📁 Created logs directory"
fi

# Check environment files
print_status "⚙️ Checking environment files..."
if [ ! -f "backend/.env.example" ]; then
    print_warning "⚠️ backend/.env.example not found"
    print_status "📝 Creating backend/.env.example..."
    cat > backend/.env.example << EOF
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/warisan
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
EOF
fi

if [ ! -f "frontend/.env.example" ]; then
    print_warning "⚠️ frontend/.env.example not found"
    print_status "📝 Creating frontend/.env.example..."
    cat > frontend/.env.example << EOF
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=WARISAN
EOF
fi

# Create production environment template
if [ ! -f ".env.production" ]; then
    print_status "📝 Creating .env.production template..."
    cat > .env.production << EOF
# Production Environment Variables
# Copy this file to .env and update with your actual values

# Database
MONGODB_URI=mongodb://localhost:27017/warisan

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-domain.com

# API URL for frontend
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=WARISAN
EOF
fi

print_status "🎉 Setup completed successfully!"
print_status "📋 Available commands:"
echo "  ./deploy-manual.sh   - Deploy to VPS"
echo "  ./update.sh         - Update application"
echo "  ./webhook-setup.sh  - Setup GitHub webhook"
echo "  make help           - Show all available commands"
echo ""
print_status "📖 Documentation:"
echo "  README-DEPLOYMENT.md    - Quick deployment guide"
echo "  DEPLOYMENT-MANUAL.md    - Complete deployment guide"
echo ""
print_status "⚙️ Next steps:"
echo "  1. Update environment files with your configuration"
echo "  2. Upload to your VPS"
echo "  3. Run ./deploy-manual.sh on your VPS"
echo "  4. Setup GitHub webhook with ./webhook-setup.sh"
echo ""
print_status "✨ WARISAN deployment scripts are ready to use!"