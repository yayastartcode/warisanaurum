# Technical Requirements Document (TRD)
# Aplikasi WARISAN - Platform Pembelajaran Bahasa Jawa

## 1. System Architecture Overview

### 1.1 Architecture Pattern
**3-Tier Architecture dengan Microservices Approach**
- **Presentation Layer**: React.js Frontend
- **Business Logic Layer**: Node.js Backend dengan Express.js
- **Data Layer**: MongoDB Atlas

### 1.2 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React.js)    │◄──►│   (Node.js)     │◄──►│ (MongoDB Atlas) │
│                 │    │   Express.js    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   External      │              │
         └──────────────►│   Services      │◄─────────────┘
                        │ (QR Generator)  │
                        └─────────────────┘
```

## 2. Technology Stack

### 2.1 Frontend Stack
- **Framework**: React.js 18.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **UI Components**: Material-UI (MUI) atau Ant Design
- **QR Code Scanner**: react-qr-scanner
- **Animation**: Framer Motion
- **Build Tool**: Vite
- **Package Manager**: npm

### 2.2 Backend Stack
- **Runtime**: Node.js 18.x LTS
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT + bcrypt
- **Validation**: Joi atau Zod
- **API Documentation**: Swagger/OpenAPI
- **File Upload**: Multer
- **CORS**: cors middleware
- **Security**: helmet, express-rate-limit
- **Logging**: Winston
- **Environment**: dotenv

### 2.3 Database
- **Primary Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Caching**: Redis (optional untuk session)
- **File Storage**: MongoDB GridFS atau AWS S3

### 2.4 External Services
- **QR Code Generation**: qrcode library
- **Image Processing**: Sharp (jika diperlukan)
- **Email Service**: SendGrid atau Nodemailer (untuk reset password)

### 2.5 Development Tools
- **Version Control**: Git
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **API Testing**: Postman/Insomnia
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)

## 3. System Requirements

### 3.1 Performance Requirements
- **Response Time**: < 3 seconds untuk semua API calls
- **Throughput**: Support 100 concurrent users
- **Availability**: 99.5% uptime
- **Scalability**: Horizontal scaling capability

### 3.2 Security Requirements
- **Authentication**: JWT dengan refresh token
- **Password**: bcrypt hashing dengan salt rounds 12
- **HTTPS**: SSL/TLS encryption
- **Input Validation**: Server-side validation untuk semua input
- **Rate Limiting**: API rate limiting untuk prevent abuse
- **CORS**: Configured untuk specific domains

### 3.3 Compatibility Requirements
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS 12+, Android 8+
- **Screen Sizes**: 320px - 2560px width
- **PWA**: Progressive Web App support

## 4. Database Design

### 4.1 Collections Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String (URL),
    dateOfBirth: Date,
    createdAt: Date,
    updatedAt: Date
  },
  gameStats: {
    totalScore: Number (default: 0),
    totalPlayTime: Number (default: 0),
    gamesPlayed: Number (default: 0),
    charactersUnlocked: [String] (default: [])
  },
  isActive: Boolean (default: true)
}
```

#### Characters Collection
```javascript
{
  _id: ObjectId,
  name: String (required), // "Semar", "Petruk", "Gareng", "Bagong"
  description: String,
  introduction: String,
  image: String (URL),
  wisdomMessage: String,
  characteristics: [String],
  isActive: Boolean (default: true)
}
```

#### Questions Collection
```javascript
{
  _id: ObjectId,
  characterId: ObjectId (ref: Characters),
  level: Number (1-4),
  question: {
    dialogue: String,
    context: String,
    audioUrl: String (optional)
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  points: Number,
  difficulty: String, // "easy", "medium", "hard", "expert"
  tags: [String],
  isActive: Boolean (default: true)
}
```

#### GameSessions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  characterId: ObjectId (ref: Characters),
  startTime: Date,
  endTime: Date,
  currentLevel: Number (1-4),
  livesRemaining: Number (default: 3),
  score: Number (default: 0),
  answeredQuestions: [{
    questionId: ObjectId,
    selectedOption: Number,
    isCorrect: Boolean,
    timeSpent: Number,
    timestamp: Date
  }],
  status: String, // "active", "completed", "abandoned"
  completedAt: Date
}
```

#### QRCodes Collection
```javascript
{
  _id: ObjectId,
  characterId: ObjectId (ref: Characters),
  userId: ObjectId (ref: Users),
  qrCodeData: String,
  qrCodeImage: String (base64 atau URL),
  generatedAt: Date,
  scannedAt: Date,
  isUsed: Boolean (default: false),
  expiresAt: Date
}
```

### 4.2 Indexes
```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })

// Questions
db.questions.createIndex({ "characterId": 1, "level": 1 })
db.questions.createIndex({ "difficulty": 1 })

// GameSessions
db.gameSessions.createIndex({ "userId": 1, "status": 1 })
db.gameSessions.createIndex({ "characterId": 1 })
db.gameSessions.createIndex({ "startTime": -1 })

// QRCodes
db.qrCodes.createIndex({ "userId": 1, "characterId": 1 })
db.qrCodes.createIndex({ "expiresAt": 1 }, { expireAfterSeconds: 0 })
```

## 5. API Specification

### 5.1 Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### 5.2 User Management Endpoints
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/stats
PUT /api/users/avatar
```

### 5.3 Game Endpoints
```
GET /api/characters
GET /api/characters/:id
POST /api/game/spin-wheel
POST /api/game/generate-qr
POST /api/game/scan-qr
POST /api/game/start-session
GET /api/game/session/:sessionId
POST /api/game/answer
POST /api/game/complete-session
GET /api/game/leaderboard
```

### 5.4 Questions Endpoints
```
GET /api/questions/character/:characterId/level/:level
GET /api/questions/:questionId
```

### 5.5 API Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-01-XX"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2025-01-XX"
}
```

## 6. Security Implementation

### 6.1 Authentication Flow
1. User login dengan email/password
2. Server validate credentials
3. Generate JWT access token (15 menit) + refresh token (7 hari)
4. Client store tokens di httpOnly cookies
5. Setiap request include access token di Authorization header
6. Auto-refresh token sebelum expire

### 6.2 Authorization Levels
- **Public**: Register, login, character info
- **Authenticated**: Game play, profile management
- **Admin**: Question management, user management (future)

### 6.3 Input Validation
```javascript
// Example validation schema
const registerSchema = {
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
}
```

### 6.4 Rate Limiting
```javascript
// API rate limits
const rateLimits = {
  '/api/auth/login': '5 requests per 15 minutes',
  '/api/auth/register': '3 requests per hour',
  '/api/game/*': '100 requests per hour',
  'global': '1000 requests per hour'
}
```

## 7. File Structure

### 7.1 Frontend Structure
```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   ├── game/
│   │   └── ui/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Game/
│   │   └── Profile/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   └── assets/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### 7.2 Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── gameController.ts
│   │   └── questionController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Character.ts
│   │   ├── Question.ts
│   │   ├── GameSession.ts
│   │   └── QRCode.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── game.ts
│   │   └── questions.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── gameService.ts
│   │   ├── qrService.ts
│   │   └── emailService.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── logger.ts
│   │   ├── helpers.ts
│   │   └── constants.ts
│   ├── types/
│   └── config/
├── package.json
├── tsconfig.json
└── .env.example
```

## 8. Deployment Architecture

### 8.1 Environment Setup
- **Development**: Local development dengan hot reload
- **Staging**: Testing environment dengan production-like data
- **Production**: Live environment dengan real users

### 8.2 Deployment Strategy
- **Frontend**: Vercel dengan automatic deployments dari Git
- **Backend**: Railway atau Heroku dengan Docker containers
- **Database**: MongoDB Atlas dengan automated backups
- **CDN**: Cloudflare untuk static assets

### 8.3 Environment Variables
```bash
# Backend .env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CORS_ORIGIN=https://warisan-app.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 9. Testing Strategy

### 9.1 Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing user flows
- **E2E Tests**: Cypress untuk critical paths
- **Visual Tests**: Storybook untuk component testing

### 9.2 Backend Testing
- **Unit Tests**: Jest untuk individual functions
- **Integration Tests**: Supertest untuk API endpoints
- **Database Tests**: MongoDB Memory Server
- **Load Tests**: Artillery atau k6

### 9.3 Test Coverage
- Target minimum 80% code coverage
- Critical paths harus 100% covered
- Automated testing di CI/CD pipeline

## 10. Monitoring dan Logging

### 10.1 Application Monitoring
- **Error Tracking**: Sentry untuk error monitoring
- **Performance**: Web Vitals tracking
- **Analytics**: Google Analytics untuk user behavior
- **Uptime**: UptimeRobot untuk service monitoring

### 10.2 Logging Strategy
```javascript
// Log levels
const logLevels = {
  error: 0,    // System errors, exceptions
  warn: 1,     // Warning conditions
  info: 2,     // General information
  debug: 3     // Debug information
}

// Log format
{
  timestamp: "2025-01-XX",
  level: "info",
  message: "User logged in",
  userId: "user123",
  ip: "192.168.1.1",
  userAgent: "..."
}
```

## 11. Performance Optimization

### 11.1 Frontend Optimization
- **Code Splitting**: Route-based dan component-based
- **Lazy Loading**: Images dan components
- **Caching**: Service Worker untuk offline capability
- **Bundle Optimization**: Tree shaking dan minification
- **Image Optimization**: WebP format dengan fallbacks

### 11.2 Backend Optimization
- **Database Indexing**: Proper indexes untuk query performance
- **Caching**: Redis untuk frequently accessed data
- **Connection Pooling**: MongoDB connection pooling
- **Compression**: Gzip compression untuk responses
- **CDN**: Static assets served via CDN

### 11.3 Database Optimization
- **Query Optimization**: Efficient MongoDB queries
- **Aggregation Pipelines**: Complex data processing
- **Data Archiving**: Old game sessions archiving
- **Backup Strategy**: Automated daily backups

## 12. Scalability Considerations

### 12.1 Horizontal Scaling
- **Load Balancing**: Multiple backend instances
- **Database Sharding**: User-based sharding strategy
- **Microservices**: Split into smaller services jika diperlukan
- **Caching Layer**: Redis cluster untuk distributed caching

### 12.2 Vertical Scaling
- **Resource Monitoring**: CPU, Memory, Disk usage
- **Auto-scaling**: Based on traffic patterns
- **Database Scaling**: MongoDB Atlas auto-scaling

## 13. Maintenance dan Updates

### 13.1 Regular Maintenance
- **Security Updates**: Monthly dependency updates
- **Performance Reviews**: Quarterly performance analysis
- **Database Cleanup**: Automated cleanup scripts
- **Backup Verification**: Monthly backup restore tests

### 13.2 Feature Updates
- **Version Control**: Semantic versioning
- **Release Notes**: Detailed changelog
- **Rollback Strategy**: Quick rollback capability
- **A/B Testing**: Feature flag implementation

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Prepared by**: Technical Team  
**Reviewed by**: Senior Developer  
**Approved by**: Technical Lead