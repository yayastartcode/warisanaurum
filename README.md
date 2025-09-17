# WARISAN - Platform Pembelajaran Bahasa Jawa

![WARISAN Logo](https://via.placeholder.com/200x100/4CAF50/FFFFFF?text=WARISAN)

## 📖 Deskripsi Project

**WARISAN** adalah aplikasi pembelajaran bahasa Jawa yang interaktif dan menyenangkan melalui permainan dengan karakter punokawan (Semar, Petruk, Gareng, dan Bagong). Aplikasi ini menggabungkan teknologi modern dengan kearifan budaya Jawa untuk memberikan pengalaman belajar yang engaging.

## 🎯 Fitur Utama

- 🎲 **Wheel of Fortune**: Spin untuk mendapatkan karakter punokawan
- 📱 **QR Code Integration**: Scan QR code untuk perkenalan karakter
- 🎮 **4 Level Game**: Setiap karakter memiliki 4 tingkat kesulitan
- ❤️ **Life System**: 3 nyawa per game session
- 🏆 **Scoring System**: Tracking skor dan waktu bermain
- 💬 **Wisdom Messages**: Pesan bijak dari setiap karakter
- 👤 **User Management**: Profile dan statistik pemain

## 🏗️ Arsitektur Sistem

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│ (MongoDB Atlas) │
│   TypeScript    │    │   Express.js    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18.x dengan TypeScript
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI)
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js 18.x LTS
- **Framework**: Express.js dengan TypeScript
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **API Documentation**: Swagger/OpenAPI

### Database
- **Primary**: MongoDB Atlas
- **ODM**: Mongoose
- **Caching**: Redis (optional)

## 📁 Struktur Project

```
warum/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── package.json
├── docs/                     # Documentation
│   ├── PRD-WARISAN.md       # Product Requirements
│   ├── TECHNICAL-REQUIREMENTS.md
│   └── API-SPECIFICATION.md
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x atau lebih tinggi
- npm atau yarn
- MongoDB Atlas account
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd warum
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env dengan konfigurasi yang sesuai
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

## 🔧 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/warisan
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=WARISAN
```

## 📚 Dokumentasi

- [Product Requirements Document](./PRD-WARISAN.md)
- [Technical Requirements](./TECHNICAL-REQUIREMENTS.md)
- [API Specification](./API-SPECIFICATION.md)

## 🎮 Cara Bermain

1. **Register/Login** - Buat akun atau masuk ke aplikasi
2. **Tutorial** - Pelajari cara bermain melalui tutorial
3. **Spin Wheel** - Putar roda untuk mendapatkan karakter punokawan
4. **Scan QR Code** - Scan QR code untuk melihat perkenalan karakter
5. **Main Game** - Jawab pertanyaan dalam 4 level dengan 3 nyawa
6. **Dapatkan Wisdom** - Terima pesan bijak dari karakter di akhir game

## 🏆 Game Mechanics

- **4 Karakter**: Semar, Petruk, Gareng, Bagong
- **4 Level per Karakter**: Easy → Medium → Hard → Expert
- **3 Nyawa**: Hilang satu nyawa setiap jawaban salah
- **Scoring**: Poin berdasarkan tingkat kesulitan dan waktu
- **Timer**: Tracking waktu bermain untuk setiap sesi

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
```

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Deployment Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- Gunakan TypeScript untuk type safety
- Follow ESLint dan Prettier configuration
- Gunakan conventional commits
- Write unit tests untuk fitur baru

### Git Workflow
- `main` branch untuk production
- `develop` branch untuk development
- Feature branches untuk fitur baru
- Hotfix branches untuk bug fixes

## 🐛 Bug Reports

Jika menemukan bug, silakan buat issue dengan:
- Deskripsi bug yang jelas
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (jika applicable)
- Environment details

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Product Owner**: [Nama]
- **Technical Lead**: [Nama]
- **Frontend Developer**: [Nama]
- **Backend Developer**: [Nama]
- **UI/UX Designer**: [Nama]

## 🙏 Acknowledgments

- Terimakasih kepada para dalang dan seniman Jawa yang telah melestarikan budaya punokawan
- Inspirasi dari berbagai aplikasi pembelajaran bahasa daerah
- Community open source yang telah menyediakan tools dan libraries

## 📞 Contact

- Email: [email@example.com]
- Website: [https://warisan-app.com]
- Documentation: [https://docs.warisan-app.com]

---

**Dibuat dengan ❤️ untuk melestarikan budaya Jawa**

*"Ajining diri ana ing lathi, ajining raga ana ing busana, ajining bangsa ana ing budaya"*  
*"Harga diri seseorang terletak pada perkataannya, harga diri raga terletak pada pakaiannya, harga diri bangsa terletak pada budayanya"*