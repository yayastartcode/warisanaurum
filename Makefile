# WARISAN - Development and Deployment Commands

.PHONY: help install dev build test clean deploy backup logs stop restart



# Development commands
install:
	@echo "📦 Installing dependencies..."
	cd backend && npm install
	cd frontend && npm install
	@echo "✅ Dependencies installed"

dev:
	@echo "🚀 Starting development servers..."
	@echo "Backend will run on http://localhost:3000"
	@echo "Frontend will run on http://localhost:5173"
	@echo "Press Ctrl+C to stop"
	@(cd backend && npm run dev) & (cd frontend && npm run dev)

test:
	@echo "🧪 Running tests..."
	cd backend && npm test
	cd frontend && npm test
	@echo "✅ Tests completed"

build:
	@echo "🔨 Building applications..."
	cd backend && npm run build
	cd frontend && npm run build
	@echo "✅ Build completed"

clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf backend/dist
	rm -rf frontend/dist
	rm -rf backend/node_modules/.cache
	rm -rf frontend/node_modules/.cache
	@echo "✅ Clean completed"

# Manual deployment commands (VPS)
deploy-manual:
	@echo "🚀 Deploying manually to VPS..."
	chmod +x deploy-manual.sh
	sudo ./deploy-manual.sh

update-manual:
	@echo "🔄 Updating application on VPS..."
	chmod +x update.sh
	sudo ./update.sh

setup-webhook:
	@echo "⚙️ Setting up GitHub webhook..."
	chmod +x webhook-setup.sh
	sudo ./webhook-setup.sh

# Docker deployment commands (alternative)
deploy-docker:
	@echo "🚀 Deploying WARISAN with Docker..."
	@if [ ! -f .env ]; then \
		echo "⚠️  .env file not found. Creating from template..."; \
		cp .env.production .env; \
		echo "📝 Please edit .env file with your configuration"; \
		exit 1; \
	fi
	chmod +x deploy.sh
	./deploy.sh

logs-docker:
	@echo "📋 Viewing Docker logs..."
	docker-compose logs -f

stop-docker:
	@echo "🛑 Stopping Docker services..."
	docker-compose down
	@echo "✅ All services stopped"

restart-docker:
	@echo "🔄 Restarting Docker services..."
	docker-compose restart
	@echo "✅ All services restarted"

backup-docker:
	@echo "💾 Creating Docker database backup..."
	chmod +x backup.sh
	./backup.sh

# PM2 commands (manual deployment)
pm2-status:
	@echo "📊 Checking PM2 status..."
	pm2 status

pm2-logs:
	@echo "📋 Showing PM2 logs..."
	pm2 logs warisan-backend

pm2-restart:
	@echo "🔄 Restarting PM2 application..."
	pm2 restart warisan-backend

pm2-stop:
	@echo "🛑 Stopping PM2 application..."
	pm2 stop warisan-backend

pm2-start:
	@echo "🚀 Starting PM2 application..."
	pm2 start ecosystem.config.js

# Nginx commands
nginx-test:
	@echo "🔧 Testing Nginx configuration..."
	sudo nginx -t

nginx-reload:
	@echo "🔄 Reloading Nginx..."
	sudo systemctl reload nginx

nginx-restart:
	@echo "🔄 Restarting Nginx..."
	sudo systemctl restart nginx

nginx-status:
	@echo "📊 Checking Nginx status..."
	sudo systemctl status nginx

nginx-logs:
	@echo "📋 Showing Nginx logs..."
	sudo tail -f /var/log/nginx/warisan_access.log

# Database commands
db-backup:
	@echo "💾 Creating database backup..."
	mongodump --db warisan --out /var/backups/mongodb/$(shell date +%Y%m%d)

db-restore:
	@echo "📥 Restoring database (specify DATE=YYYYMMDD)..."
	mongorestore --db warisan /var/backups/mongodb/$(DATE)/warisan

# Utility commands
health:
	@echo "🏥 Checking local service health..."
	@echo "Backend API:"
	@curl -f http://localhost:3000/api/health || echo "❌ Backend unhealthy"
	@echo "\nFrontend:"
	@curl -f http://localhost/health || echo "❌ Frontend unhealthy"

health-remote:
	@echo "🏥 Checking remote service health..."
	@curl -f http://your-domain.com/api/health || echo "❌ Backend unhealthy"
	@curl -f http://your-domain.com/health || echo "❌ Frontend unhealthy"

# Monitoring commands
monitor:
	@echo "📊 Starting monitoring dashboard..."
	pm2 monit

webhook-logs:
	@echo "📋 Showing webhook logs..."
	sudo tail -f /var/log/warisan-webhook.log

webhook-status:
	@echo "📊 Checking webhook service status..."
	sudo systemctl status warisan-webhook

# Security commands
firewall-status:
	@echo "🔒 Checking firewall status..."
	sudo ufw status

ssl-renew:
	@echo "🔐 Renewing SSL certificate..."
	sudo certbot renew

# Maintenance commands
cleanup:
	@echo "🧹 Cleaning up old files..."
	sudo find /var/backups -type f -mtime +30 -delete
	pm2 flush

system-update:
	@echo "⬆️ Updating system packages..."
	sudo apt update && sudo apt upgrade -y

# Production commands
setup-prod:
	@echo "🔧 Setting up production environment..."
	@if [ ! -f .env ]; then \
		cp .env.production .env; \
		echo "✅ Environment file created"; \
	else \
		echo "⚠️ Environment file already exists"; \
	fi
	make deploy-manual

update:
	@echo "🔄 Updating application..."
	git pull
	make deploy-manual
	@echo "✅ Application updated"

# Help command
help:
	@echo "🚀 WARISAN - Available Commands:"
	@echo ""
	@echo "📦 Development:"
	@echo "  install       - Install dependencies"
	@echo "  dev          - Start development servers"
	@echo "  test         - Run tests"
	@echo "  build        - Build applications"
	@echo "  clean        - Clean build artifacts"
	@echo ""
	@echo "🚀 Manual Deployment (VPS):"
	@echo "  deploy-manual - Deploy to VPS manually"
	@echo "  update-manual - Update application on VPS"
	@echo "  setup-webhook - Setup GitHub webhook"
	@echo ""
	@echo "🐳 Docker Deployment (Alternative):"
	@echo "  deploy-docker - Deploy with Docker"
	@echo "  logs-docker   - Show Docker logs"
	@echo "  stop-docker   - Stop Docker services"
	@echo "  restart-docker- Restart Docker services"
	@echo "  backup-docker - Backup Docker database"
	@echo ""
	@echo "⚙️ PM2 Management:"
	@echo "  pm2-status   - Check PM2 status"
	@echo "  pm2-logs     - Show PM2 logs"
	@echo "  pm2-restart  - Restart PM2 app"
	@echo "  pm2-stop     - Stop PM2 app"
	@echo "  pm2-start    - Start PM2 app"
	@echo ""
	@echo "🌐 Nginx Management:"
	@echo "  nginx-test   - Test Nginx config"
	@echo "  nginx-reload - Reload Nginx"
	@echo "  nginx-restart- Restart Nginx"
	@echo "  nginx-status - Check Nginx status"
	@echo "  nginx-logs   - Show Nginx logs"
	@echo ""
	@echo "🏥 Health & Monitoring:"
	@echo "  health       - Check local health"
	@echo "  health-remote- Check remote health"
	@echo "  monitor      - PM2 monitoring dashboard"
	@echo "  webhook-logs - Show webhook logs"
	@echo "  webhook-status- Check webhook status"
	@echo ""
	@echo "💾 Database:"
	@echo "  db-backup    - Backup database"
	@echo "  db-restore   - Restore database (DATE=YYYYMMDD)"
	@echo ""
	@echo "🔒 Security:"
	@echo "  firewall-status- Check firewall status"
	@echo "  ssl-renew    - Renew SSL certificate"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  cleanup      - Clean old files"
	@echo "  system-update- Update system packages"
	@echo "  setup-prod   - Setup production environment"
	@echo "  update       - Update application"
	@echo ""
	@echo "📖 Usage Examples:"
	@echo "  make deploy-manual    # Deploy to VPS"
	@echo "  make pm2-logs        # Check application logs"
	@echo "  make health-remote   # Check if app is running"
	@echo "  make db-backup       # Backup database"
	@echo "  make update-manual   # Update after GitHub push"
	@echo ""
	@echo "💡 For more details, see DEPLOYMENT-MANUAL.md"

.DEFAULT_GOAL := help
.PHONY: help install dev test build clean deploy-manual update-manual setup-webhook deploy-docker logs-docker stop-docker restart-docker backup-docker pm2-status pm2-logs pm2-restart pm2-stop pm2-start nginx-test nginx-reload nginx-restart nginx-status nginx-logs health health-remote monitor webhook-logs webhook-status firewall-status ssl-renew cleanup system-update db-backup db-restore setup-prod update

# Monitoring
status:
	@echo "📊 Service Status:"
	docker-compose ps

stats:
	@echo "📈 Resource Usage:"
	docker stats --no-stream