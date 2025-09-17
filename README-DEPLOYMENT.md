# 🚀 WARISAN - Quick Deployment Guide

Panduan cepat untuk deploy aplikasi WARISAN ke VPS tanpa Docker.

## 📋 Prerequisites

✅ **Server Requirements:**
- Ubuntu 20.04+ atau CentOS 8+
- RAM minimal 2GB
- Node.js 20.x
- npm
- PM2
- Nginx
- Git
- MongoDB

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/your-username/warisan.git
cd warisan
```

### 2. Deploy ke VPS
```bash
# Upload files ke VPS
scp -r . user@your-server:/var/www/warisan

# SSH ke VPS
ssh user@your-server
cd /var/www/warisan

# Jalankan deployment
sudo ./deploy-manual.sh
```

### 3. Setup Environment
Edit file environment:
```bash
# Backend
nano backend/.env
```
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/warisan
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://your-domain.com
```

```bash
# Frontend
nano frontend/.env
```
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=WARISAN
```

### 4. Update Domain
Edit konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/warisan
# Ganti 'your-domain.com' dengan domain Anda
```

## 🔄 Update Setelah Push GitHub

```bash
# SSH ke VPS
ssh user@your-server
cd /var/www/warisan

# Update aplikasi
sudo ./update.sh
```

## 🤖 Setup Auto-Deploy (Webhook)

```bash
# Setup webhook untuk auto-deploy
sudo ./webhook-setup.sh
```

Kemudian setup webhook di GitHub:
1. Go to repository → Settings → Webhooks
2. Add webhook:
   - URL: `http://your-server-ip:9000/hooks/warisan-deploy`
   - Content type: `application/json`
   - Secret: `your-webhook-secret-here`
   - Events: Just push events

## 📊 Monitoring & Management

### Menggunakan Makefile
```bash
# Lihat semua command
make help

# Check status
make pm2-status
make nginx-status

# Lihat logs
make pm2-logs
make nginx-logs

# Health check
make health-remote

# Restart services
make pm2-restart
make nginx-restart
```

### Manual Commands
```bash
# PM2
pm2 status
pm2 logs warisan-backend
pm2 restart warisan-backend

# Nginx
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Database backup
mongodump --db warisan --out /var/backups/mongodb/$(date +%Y%m%d)


```
sudo chown -R www-data:www-data /home/warisan/warisanaurum/backend/dist
sudo chown -R www-data:www-data /home/warisan/warisanaurum/frontend/dist

sudo chmod -R 755 /home/warisan/warisanaurum/backend/dist
sudo chmod -R 755 /home/warisan/warisanaurum/frontend/dist

# Fix permissions for all files (including assets)
sudo find /home/warisan/warisanaurum/backend/dist -type f -exec chmod 644 {} \;
sudo find /home/warisan/warisanaurum/frontend/dist -type f -exec chmod 644 {} \;

sudo find /home/warisan/warisanaurum/backend/dist -type d -exec chmod 755 {} \;
sudo find /home/warisan/warisanaurum/frontend/dist -type d -exec chmod 755 {} \;

sudo chown -R www-data:www-data /home/warisan/warisanaurum/backend/dist/assets
sudo chown -R www-data:www-data /home/warisan/warisanaurum/frontend/dist/assets
sudo chmod -R 755 /home/warisan/warisanaurum/backend/dist/assets
sudo chmod -R 755 /home/warisan/warisanaurum/frontend/dist/assets
sudo chmod -R 644 /home/warisan/warisanaurum/backend/dist/assets/*
sudo chmod -R 644 /home/warisan/warisanaurum/frontend/dist/assets/*

# Add warisan user to www-data group
sudo usermod -a -G www-data warisan

# Set proper permissions for parent directories
sudo chmod 755 /home/warisan
sudo chmod 755 /home/warisan/warisanaurum


## 🔒 Security Setup

### 1. Firewall
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

### 2. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🆘 Troubleshooting

### Backend Tidak Jalan
```bash
# Check logs
pm2 logs warisan-backend

# Check port
sudo netstat -tlnp | grep :3000

# Restart
pm2 restart warisan-backend
```

### Frontend Tidak Bisa Diakses
```bash
# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Database Error
```bash
# Check MongoDB
sudo systemctl status mongod
sudo systemctl start mongod

# Test connection
mongo --eval "db.adminCommand('ismaster')"
```

## 📁 File Structure

```
warisan/
├── deploy-manual.sh      # Script deployment utama
├── update.sh            # Script update aplikasi
├── webhook-setup.sh     # Setup GitHub webhook
├── ecosystem.config.js  # Konfigurasi PM2
├── nginx-site.conf      # Konfigurasi Nginx
├── Makefile            # Command shortcuts
└── DEPLOYMENT-MANUAL.md # Dokumentasi lengkap
```

## 🔗 Useful Links

- **Aplikasi**: `https://your-domain.com`
- **API**: `https://your-domain.com/api`
- **Health Check**: `https://your-domain.com/api/health`
- **PM2 Monitor**: `pm2 monit`

## 📞 Support

Jika ada masalah:
1. Check logs: `make pm2-logs` atau `make nginx-logs`
2. Health check: `make health-remote`
3. Restart services: `make pm2-restart`
4. Lihat dokumentasi lengkap: `DEPLOYMENT-MANUAL.md`

---

**Happy Deploying! 🎉**