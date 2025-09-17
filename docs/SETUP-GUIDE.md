# Setup Guide - WARISAN Project

## 📋 Prerequisites

Sebelum memulai development, pastikan Anda telah menginstall:

- **Node.js** 18.x atau lebih tinggi
- **npm** 8.x atau lebih tinggi (atau yarn/pnpm)
- **Git** untuk version control
- **MongoDB Atlas** account (atau MongoDB local)
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd warum
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file dengan konfigurasi yang sesuai
nano .env  # atau gunakan editor favorit Anda
```

**Konfigurasi .env yang wajib diisi:**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/warisan
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

```bash
# Start development server
npm run dev
```

Backend akan berjalan di: http://localhost:3000

### 3. Setup Frontend

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file jika diperlukan
nano .env
```

```bash
# Start development server
npm run dev
```

Frontend akan berjalan di: http://localhost:5173

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Buat Account MongoDB Atlas**
   - Kunjungi https://www.mongodb.com/atlas
   - Daftar atau login ke account Anda

2. **Buat Cluster Baru**
   - Pilih "Build a Database"
   - Pilih "Shared" (gratis)
   - Pilih region terdekat
   - Beri nama cluster: `warisan-cluster`

3. **Setup Database User**
   - Buat username dan password
   - Simpan credentials ini untuk .env file

4. **Whitelist IP Address**
   - Tambahkan IP address Anda
   - Atau gunakan `0.0.0.0/0` untuk development (tidak recommended untuk production)

5. **Get Connection String**
   - Klik "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` dengan password yang Anda buat

### MongoDB Local (Alternative)

```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Connection string untuk local MongoDB
MONGODB_URI=mongodb://localhost:27017/warisan
```

## 🔧 Development Tools Setup

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-json",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-thunder-client",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-react-javascript-snippets"
  ]
}
```

### VS Code Settings

Buat file `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 🧪 Testing Setup

### Backend Testing

```bash
cd backend

# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run Storybook
npm run storybook
```

## 📊 Database Seeding

### Seed Initial Data

```bash
cd backend

# Run database seeder
npm run seed
```

Ini akan membuat:
- 4 karakter punokawan (Semar, Petruk, Gareng, Bagong)
- Sample questions untuk setiap karakter
- Test user accounts

### Sample Data Structure

**Characters:**
- Semar: 20 questions per level (80 total)
- Petruk: 20 questions per level (80 total)
- Gareng: 20 questions per level (80 total)
- Bagong: 20 questions per level (80 total)

**Test Users:**
- Email: `test@warisan.com`
- Password: `Test123456`

## 🔍 API Testing

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Import collection dari `docs/api-collection.json`
3. Set environment variables:
   ```json
   {
     "baseUrl": "http://localhost:3000/api",
     "token": "your-jwt-token"
   }
   ```

### Using Postman

1. Import collection dari `docs/postman-collection.json`
2. Set environment dengan base URL: `http://localhost:3000/api`
3. Test authentication endpoints terlebih dahulu

## 🚀 Production Deployment

### Backend Deployment (Railway)

1. **Setup Railway Account**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Set Environment Variables**
   - Buka Railway dashboard
   - Set semua environment variables dari .env.example
   - Pastikan MONGODB_URI menggunakan production database

### Frontend Deployment (Vercel)

1. **Setup Vercel Account**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   - Update VITE_API_BASE_URL ke production backend URL
   - Set production environment variables

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: MongoNetworkError: failed to connect to server
```
**Solution:**
- Periksa connection string di .env
- Pastikan IP address sudah di-whitelist
- Periksa username/password

**2. CORS Error**
```
Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
- Periksa CORS_ORIGIN di backend .env
- Pastikan frontend URL sudah benar

**3. JWT Token Error**
```
Unauthorized: Invalid token
```
**Solution:**
- Periksa JWT_SECRET di .env
- Clear browser cookies/localStorage
- Login ulang untuk mendapatkan token baru

**4. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:**
```bash
# Kill process yang menggunakan port
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain
PORT=3001 npm run dev
```

### Development Tips

1. **Hot Reload Issues**
   - Restart development server
   - Clear browser cache
   - Check file watchers limit (Linux)

2. **TypeScript Errors**
   - Run `npm run type-check`
   - Restart TypeScript server di VS Code
   - Check tsconfig.json paths

3. **Database Connection**
   - Use MongoDB Compass untuk GUI
   - Check database logs di Atlas dashboard
   - Monitor connection pool

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Atlas Tutorial](https://docs.atlas.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Material-UI Components](https://mui.com/components/)

## 🆘 Getting Help

Jika mengalami masalah:

1. Check dokumentasi di folder `docs/`
2. Search existing issues di repository
3. Create new issue dengan detail:
   - OS dan versi Node.js
   - Error message lengkap
   - Steps to reproduce
   - Screenshots jika diperlukan

---

**Happy Coding! 🚀**

*Semoga project WARISAN dapat membantu melestarikan budaya Jawa untuk generasi mendatang.*