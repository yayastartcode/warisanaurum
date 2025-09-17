# WARISAN - Manual Deployment Guide

Panduan deployment manual untuk VPS dengan Node.js, PM2, dan Nginx tanpa menggunakan Docker.

## Prerequisites

### Server Requirements
- Ubuntu 20.04+ atau CentOS 8+
- RAM minimal 2GB
- Storage minimal 10GB
- Node.js 20.x
- npm
- PM2 process manager
- Nginx
- Git
- MongoDB (lokal atau cloud)

### Domain & DNS
- Domain yang sudah diarahkan ke IP server
- SSL certificate (opsional, tapi direkomendasikan)

## Installation Prerequisites

### 1. Install Node.js 20
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

### 2. Install PM2
```bash
sudo npm install -g pm2
```

### 3. Install Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 4. Install Git
```bash
# Ubuntu/Debian
sudo apt install git

# CentOS/RHEL
sudo yum install git
```

## Deployment Steps

### 1. Persiapan Server

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Buat user untuk aplikasi (opsional)
sudo useradd -m -s /bin/bash warisan
sudo usermod -aG sudo warisan

# Buat direktori aplikasi
sudo mkdir -p /var/www/warisan
sudo chown -R $USER:$USER /var/www/warisan
```

### 2. Clone Repository

```bash
cd /var/www/warisan
git clone https://github.com/your-username/warisan.git .
```

### 3. Setup Environment Files

```bash
# Backend environment
cp backend/.env.example backend/.env
nano backend/.env
```

Edit `backend/.env`:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/warisan
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://warisanaurum.online
```

```bash
# Frontend environment
cp frontend/.env.example frontend/.env
nano frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=https://your-domain.com/api
VITE_APP_NAME=WARISAN
```

### 4. Install Dependencies dan Build

```bash
# Backend
cd backend
npm install --production
npm run build

# Frontend
cd ../frontend
npm install
npm run build

cd ..
```

### 5. Setup PM2

```bash
# Copy ecosystem config
cp ecosystem.config.js /var/www/warisan/

# Edit konfigurasi jika diperlukan
nano ecosystem.config.js

# Start aplikasi dengan PM2
pm2 start ecosystem.config.js
pm2 stop ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Jalankan command yang diberikan oleh PM2
```

### 6. Setup Nginx

```bash
# Copy konfigurasi Nginx
sudo cp nginx-site.conf /etc/nginx/sites-available/warisan

# Edit konfigurasi
sudo nano /etc/nginx/sites-available/warisan
# Ganti 'your-domain.com' dengan domain Anda

# Enable site
sudo ln -s /etc/nginx/sites-available/warisan /etc/nginx/sites-enabled/

# Disable default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 7. Setup Firewall

```bash
# Install UFW
sudo apt install ufw

# Setup basic rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

### 8. Setup SSL (Opsional tapi Direkomendasikan)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan SSL certificate
sudo certbot --nginx -d warisanaurum.online -d www.warisanaurum.online

# Setup auto-renewal
sudo crontab -e
# Tambahkan baris berikut:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Deployment Otomatis

### Menggunakan Script Deploy

```bash
# Buat script executable
chmod +x deploy-manual.sh

# Jalankan deployment
sudo ./deploy-manual.sh
```

### Update Setelah Push ke GitHub

```bash
# Buat script executable
chmod +x update.sh

# Jalankan update
sudo ./update.sh
```

## Monitoring dan Maintenance

### PM2 Commands

```bash
# Lihat status aplikasi
pm2 status

# Lihat logs
pm2 logs warisan-backend

# Restart aplikasi
pm2 restart warisan-backend

# Stop aplikasi
pm2 stop warisan-backend

# Monitor real-time
pm2 monit
```

### Nginx Commands

```bash
# Test konfigurasi
sudo nginx -t

# Reload konfigurasi
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# Lihat status
sudo systemctl status nginx

# Lihat logs
sudo tail -f /var/log/nginx/warisan_access.log
sudo tail -f /var/log/nginx/warisan_error.log
```

### Database Backup

```bash
# Backup MongoDB
mongodump --db warisan --out /var/backups/mongodb/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --db warisan /var/backups/mongodb/20231201/warisan
```

## Troubleshooting

### Backend Tidak Bisa Start

```bash
# Cek logs PM2
pm2 logs warisan-backend

# Cek port yang digunakan
sudo netstat -tlnp | grep :3000

# Restart aplikasi
pm2 restart warisan-backend
```

### Frontend Tidak Bisa Diakses

```bash
# Cek status Nginx
sudo systemctl status nginx

# Cek konfigurasi Nginx
sudo nginx -t

# Cek logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Error

```bash
# Cek status MongoDB
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Cek koneksi
mongo --eval "db.adminCommand('ismaster')"
```

## Security Best Practices

1. **Update Sistem Secara Berkala**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Setup Fail2Ban**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Disable Root Login**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl restart ssh
   ```

4. **Setup Log Rotation**
   ```bash
   sudo nano /etc/logrotate.d/warisan
   ```
   
   Isi file:
   ```
   /var/www/warisan/logs/*.log {
       daily
       missingok
       rotate 52
       compress
       delaycompress
       notifempty
       create 644 root root
       postrotate
           pm2 reloadLogs
       endscript
   }
   ```

## Performance Optimization

### 1. PM2 Cluster Mode

Edit `ecosystem.config.js`:
```javascript
instances: 'max', // Gunakan semua CPU core
exec_mode: 'cluster'
```

### 2. Nginx Caching

Tambahkan ke konfigurasi Nginx:
```nginx
# Cache untuk static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Indexing

```javascript
// Buat index untuk query yang sering digunakan
db.users.createIndex({ email: 1 })
db.characters.createIndex({ userId: 1 })
```

## Backup Strategy

### Automated Backup Script

```bash
#!/bin/bash
# /var/scripts/backup.sh

BACKUP_DIR="/var/backups/warisan"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR/$DATE

# Backup database
mongodump --db warisan --out $BACKUP_DIR/$DATE/

# Backup application files
tar -czf $BACKUP_DIR/$DATE/app.tar.gz /var/www/warisan

# Remove backups older than 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

### Setup Cron Job

```bash
sudo crontab -e
# Tambahkan:
# 0 2 * * * /var/scripts/backup.sh
```

## Monitoring

### Setup PM2 Web Monitoring

```bash
# Install PM2 web interface
npm install -g pm2-web

# Start web interface
pm2-web --port 9615
```

### Setup Log Monitoring

```bash
# Install logwatch
sudo apt install logwatch

# Configure untuk email reports
sudo nano /etc/logwatch/conf/logwatch.conf
```

---

**Catatan**: Ganti semua `your-domain.com` dan `your-username` dengan nilai yang sesuai dengan setup Anda.