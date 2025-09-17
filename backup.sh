#!/bin/bash

# WARISAN Database Backup Script
# This script creates backups of the MongoDB database

set -e

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="warisan_backup_${DATE}"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

print_status "Starting database backup..."

# Check if MongoDB container is running
if ! docker-compose ps mongodb | grep -q "Up"; then
    print_error "MongoDB container is not running"
    exit 1
fi

# Create backup
print_status "Creating backup: $BACKUP_NAME"
docker-compose exec -T mongodb mongodump \
    --host localhost:27017 \
    --db warisan \
    --authenticationDatabase admin \
    --username admin \
    --password "${MONGO_ROOT_PASSWORD}" \
    --out "/tmp/$BACKUP_NAME"

# Copy backup from container
print_status "Copying backup from container..."
docker cp "$(docker-compose ps -q mongodb):/tmp/$BACKUP_NAME" "$BACKUP_DIR/"

# Compress backup
print_status "Compressing backup..."
cd "$BACKUP_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
rm -rf "$BACKUP_NAME"
cd ..

# Clean up old backups
print_status "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "warisan_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)

print_status "✅ Backup completed successfully!"
print_status "📁 Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
print_status "📊 Backup size: $BACKUP_SIZE"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# print_status "Uploading to cloud storage..."
# aws s3 cp "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" "s3://your-backup-bucket/warisan/"
# print_status "✅ Backup uploaded to cloud storage"

print_status "🎉 Backup process completed!"