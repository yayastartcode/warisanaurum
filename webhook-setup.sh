#!/bin/bash

# WARISAN GitHub Webhook Setup
# Script untuk setup webhook otomatis deployment setelah push ke GitHub

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
WEBHOOK_PORT=9000
WEBHOOK_SECRET="your-webhook-secret-here"
APP_DIR="/var/www/warisan"

print_status "🔧 Setting up GitHub webhook for automatic deployment..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script with sudo"
    exit 1
fi

# Install webhook if not exists
if ! command -v webhook &> /dev/null; then
    print_status "📦 Installing webhook..."
    
    # Ubuntu/Debian
    if command -v apt &> /dev/null; then
        apt update
        apt install -y webhook
    # CentOS/RHEL
    elif command -v yum &> /dev/null; then
        yum install -y epel-release
        yum install -y webhook
    else
        print_error "Unsupported package manager"
        exit 1
    fi
fi

# Create webhook configuration
print_status "⚙️ Creating webhook configuration..."
cat > /etc/webhook.conf << EOF
[
  {
    "id": "warisan-deploy",
    "execute-command": "/var/www/warisan/webhook-deploy.sh",
    "command-working-directory": "/var/www/warisan",
    "response-message": "Deployment started",
    "trigger-rule": {
      "and": [
        {
          "match": {
            "type": "payload-hash-sha1",
            "secret": "${WEBHOOK_SECRET}",
            "parameter": {
              "source": "header",
              "name": "X-Hub-Signature"
            }
          }
        },
        {
          "match": {
            "type": "value",
            "value": "refs/heads/main",
            "parameter": {
              "source": "payload",
              "name": "ref"
            }
          }
        }
      ]
    }
  }
]
EOF

# Create webhook deployment script
print_status "📝 Creating webhook deployment script..."
cat > $APP_DIR/webhook-deploy.sh << 'EOF'
#!/bin/bash

# Webhook deployment script
# Dipanggil otomatis oleh GitHub webhook

set -e

# Logging
LOG_FILE="/var/log/warisan-webhook.log"
exec > >(tee -a $LOG_FILE)
exec 2>&1

echo "[$(date)] Webhook deployment started"

# Change to app directory
cd /var/www/warisan

# Run update script
./update.sh

echo "[$(date)] Webhook deployment completed"
EOF

# Make scripts executable
chmod +x $APP_DIR/webhook-deploy.sh
chmod +x /etc/webhook.conf

# Create systemd service for webhook
print_status "🔧 Creating systemd service..."
cat > /etc/systemd/system/warisan-webhook.service << EOF
[Unit]
Description=WARISAN GitHub Webhook
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/webhook -hooks /etc/webhook.conf -verbose -port ${WEBHOOK_PORT}
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start webhook service
print_status "🚀 Starting webhook service..."
systemctl daemon-reload
systemctl enable warisan-webhook
systemctl start warisan-webhook

# Setup firewall rule
print_status "🔥 Setting up firewall rule..."
if command -v ufw &> /dev/null; then
    ufw allow $WEBHOOK_PORT/tcp
elif command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-port=$WEBHOOK_PORT/tcp
    firewall-cmd --reload
fi

# Create log rotation for webhook logs
print_status "📋 Setting up log rotation..."
cat > /etc/logrotate.d/warisan-webhook << EOF
/var/log/warisan-webhook.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF

print_status "✅ Webhook setup completed!"
print_status "📡 Webhook URL: http://your-server-ip:${WEBHOOK_PORT}/hooks/warisan-deploy"
print_status "🔑 Webhook Secret: ${WEBHOOK_SECRET}"
print_status "📊 Service Status: systemctl status warisan-webhook"
print_status "📋 Webhook Logs: tail -f /var/log/warisan-webhook.log"

print_status "📝 Next steps:"
echo "  1. Go to your GitHub repository settings"
echo "  2. Navigate to Webhooks section"
echo "  3. Add new webhook with:"
echo "     - Payload URL: http://your-server-ip:${WEBHOOK_PORT}/hooks/warisan-deploy"
echo "     - Content type: application/json"
echo "     - Secret: ${WEBHOOK_SECRET}"
echo "     - Events: Just the push event"
echo "  4. Test the webhook by pushing to main branch"

print_warning "⚠️ Important:"
echo "  - Replace 'your-server-ip' with your actual server IP or domain"
echo "  - Change the webhook secret in this script before running"
echo "  - Make sure port ${WEBHOOK_PORT} is accessible from GitHub"
echo "  - Consider using HTTPS in production"

print_status "🎉 GitHub webhook is now ready for automatic deployments!"