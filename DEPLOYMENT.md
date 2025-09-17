# WARISAN - Deployment Guide

## Prerequisites

### For Docker Deployment (Recommended)
- Docker 20.10+
- Docker Compose 2.0+
- Git
- 2GB+ RAM
- 10GB+ disk space

### For Manual Deployment
- Node.js 18+ dan npm
- MongoDB Atlas account atau MongoDB lokal
- Git
- Nginx (for production)

## Environment Setup

### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.com/api
```

## Local Development

### 1. Clone Repository
```bash
git clone <repository-url>
cd warum
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Setup Environment
```bash
# Backend
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai

# Frontend
cp .env.example .env
# Edit .env dengan URL backend
```

### 4. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Testing

### Frontend Testing
```bash
cd frontend
npm test  # Runs linting and build
npm run lint  # ESLint check
npm run build  # Production build
```

### Backend Testing
```bash
cd backend
npm test  # Jest tests
npm run test:coverage  # Test coverage
npm run lint  # ESLint check
```

## Docker Deployment (Recommended)

### Quick Start with Docker

1. **Clone repository:**
```bash
git clone <repository-url>
cd warum
```

2. **Setup environment:**
```bash
cp .env.production .env
# Edit .env with your configuration
```

3. **Deploy with one command:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Docker Commands

1. **Build and start services:**
```bash
docker-compose up -d --build
```

2. **View logs:**
```bash
docker-compose logs -f
```

3. **Stop services:**
```bash
docker-compose down
```

### Database Backup

```bash
chmod +x backup.sh
./backup.sh
```

## Manual Production Deployment

### Backend Deployment

1. **Build aplikasi:**
```bash
cd backend
npm run build
```

2. **Start production server:**
```bash
npm start
```

### Frontend Deployment

1. **Build aplikasi:**
```bash
cd frontend
npm run build
```

2. **Deploy ke hosting (contoh: Vercel, Netlify):**
```bash
# Upload folder dist/ ke hosting provider
```

## Database Setup

### MongoDB Atlas (Recommended)
1. Buat cluster di MongoDB Atlas
2. Whitelist IP address server
3. Buat database user
4. Copy connection string ke .env

### Seed Data (Optional)
```bash
cd backend
npm run seed  # Populate database dengan data contoh
```

## Health Checks

- Backend: `GET /health`
- Frontend: Akses root URL

## Monitoring

- Check logs di console/file
- Monitor database connections
- Track API response times

## Troubleshooting

### Common Issues:

1. **CORS Error:**
   - Pastikan CORS_ORIGIN di backend sesuai dengan domain frontend

2. **Database Connection:**
   - Verify MongoDB URI
   - Check network connectivity

3. **JWT Issues:**
   - Ensure JWT secrets are set
   - Check token expiration

4. **Build Errors:**
   - Run `npm run lint` untuk check code quality
   - Ensure all dependencies installed

## Security Checklist

- [ ] Environment variables tidak di-commit
- [ ] JWT secrets yang kuat
- [ ] HTTPS enabled di production
- [ ] Database access restricted
- [ ] Rate limiting enabled
- [ ] Input validation implemented

## Performance Optimization

- Enable gzip compression
- Use CDN untuk static assets
- Implement caching strategies
- Monitor database queries
- Optimize bundle size