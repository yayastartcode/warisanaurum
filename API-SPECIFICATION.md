# API Specification
# Aplikasi WARISAN - Platform Pembelajaran Bahasa Jawa

## Base URL
```
Development: http://localhost:3000/api
Production: https://warisan-api.railway.app/api
```

## Authentication
Semua endpoint yang memerlukan autentikasi menggunakan JWT Bearer Token:
```
Authorization: Bearer <jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Access denied |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `INTERNAL_ERROR` | Server internal error |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INVALID_TOKEN` | JWT token invalid |
| `TOKEN_EXPIRED` | JWT token expired |
| `GAME_SESSION_EXPIRED` | Game session expired |
| `INSUFFICIENT_LIVES` | No lives remaining |

---

# 1. Authentication Endpoints

## 1.1 Register User

**POST** `/auth/register`

### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1995-05-15"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": null,
        "dateOfBirth": "1995-05-15T00:00:00.000Z"
      },
      "gameStats": {
        "totalScore": 0,
        "totalPlayTime": 0,
        "gamesPlayed": 0,
        "charactersUnlocked": []
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "User registered successfully"
}
```

## 1.2 Login User

**POST** `/auth/login`

### Request Body
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "username": "johndoe",
      "email": "john@example.com",
      "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "gameStats": {
        "totalScore": 1250,
        "totalPlayTime": 3600,
        "gamesPlayed": 5,
        "charactersUnlocked": ["semar", "petruk"]
      }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Login successful"
}
```

## 1.3 Refresh Token

**POST** `/auth/refresh-token`

### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "Token refreshed successfully"
}
```

## 1.4 Logout

**POST** `/auth/logout`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Response
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

# 2. User Management Endpoints

## 2.1 Get User Profile

**GET** `/users/profile`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "https://example.com/avatar.jpg",
      "dateOfBirth": "1995-05-15T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    "gameStats": {
      "totalScore": 1250,
      "totalPlayTime": 3600,
      "gamesPlayed": 5,
      "charactersUnlocked": ["semar", "petruk"]
    }
  },
  "message": "Profile retrieved successfully"
}
```

## 2.2 Update User Profile

**PUT** `/users/profile`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "dateOfBirth": "1995-05-15"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "profile": {
      "firstName": "John Updated",
      "lastName": "Doe Updated",
      "avatar": "https://example.com/avatar.jpg",
      "dateOfBirth": "1995-05-15T00:00:00.000Z",
      "updatedAt": "2025-01-15T10:35:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

## 2.3 Get User Statistics

**GET** `/users/stats`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "gameStats": {
      "totalScore": 1250,
      "totalPlayTime": 3600,
      "gamesPlayed": 5,
      "charactersUnlocked": ["semar", "petruk"],
      "averageScore": 250,
      "bestScore": 400,
      "completionRate": 0.8
    },
    "characterStats": [
      {
        "characterId": "64f1a2b3c4d5e6f7g8h9i0j2",
        "characterName": "Semar",
        "gamesPlayed": 3,
        "bestScore": 400,
        "averageScore": 300,
        "levelsCompleted": 4,
        "totalPlayTime": 1800
      },
      {
        "characterId": "64f1a2b3c4d5e6f7g8h9i0j3",
        "characterName": "Petruk",
        "gamesPlayed": 2,
        "bestScore": 350,
        "averageScore": 275,
        "levelsCompleted": 3,
        "totalPlayTime": 1200
      }
    ]
  },
  "message": "Statistics retrieved successfully"
}
```

---

# 3. Characters Endpoints

## 3.1 Get All Characters

**GET** `/characters`

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar",
      "description": "Tokoh bijaksana dalam pewayangan Jawa",
      "introduction": "Semar adalah punokawan yang bijaksana...",
      "image": "https://example.com/semar.jpg",
      "characteristics": ["bijaksana", "humoris", "pelindung"],
      "wisdomMessage": "Kebijaksanaan sejati datang dari pengalaman hidup"
    },
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Petruk",
      "description": "Tokoh lucu dan menghibur",
      "introduction": "Petruk adalah punokawan yang selalu menghibur...",
      "image": "https://example.com/petruk.jpg",
      "characteristics": ["lucu", "menghibur", "spontan"],
      "wisdomMessage": "Tawa adalah obat terbaik untuk hati yang sedih"
    },
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "name": "Gareng",
      "description": "Tokoh setia dan dapat diandalkan",
      "introduction": "Gareng adalah punokawan yang setia...",
      "image": "https://example.com/gareng.jpg",
      "characteristics": ["setia", "dapat diandalkan", "jujur"],
      "wisdomMessage": "Kesetiaan adalah fondasi persahabatan sejati"
    },
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "name": "Bagong",
      "description": "Tokoh polos dan jujur",
      "introduction": "Bagong adalah punokawan yang polos...",
      "image": "https://example.com/bagong.jpg",
      "characteristics": ["polos", "jujur", "sederhana"],
      "wisdomMessage": "Kesederhanaan adalah kunci kebahagiaan"
    }
  ],
  "message": "Characters retrieved successfully"
}
```

## 3.2 Get Character by ID

**GET** `/characters/:id`

### Response
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Semar",
    "description": "Tokoh bijaksana dalam pewayangan Jawa",
    "introduction": "Semar adalah punokawan yang bijaksana dan selalu memberikan nasihat kepada para kesatria. Dia memiliki kemampuan untuk melihat masa depan dan memberikan petunjuk yang tepat.",
    "image": "https://example.com/semar.jpg",
    "characteristics": ["bijaksana", "humoris", "pelindung"],
    "wisdomMessage": "Kebijaksanaan sejati datang dari pengalaman hidup yang penuh makna",
    "totalQuestions": 80,
    "levels": 4
  },
  "message": "Character retrieved successfully"
}
```

---

# 4. Game Endpoints

## 4.1 Spin Wheel of Fortune

**POST** `/game/spin-wheel`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "selectedCharacter": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar",
      "image": "https://example.com/semar.jpg"
    },
    "spinResult": {
      "angle": 270,
      "duration": 3000
    }
  },
  "message": "Wheel spun successfully"
}
```

## 4.2 Generate QR Code

**POST** `/game/generate-qr`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "characterId": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "qrCodeId": "64f1a2b3c4d5e6f7g8h9i0j6",
    "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "qrCodeData": "WARISAN_CHAR_64f1a2b3c4d5e6f7g8h9i0j2_64f1a2b3c4d5e6f7g8h9i0j1",
    "expiresAt": "2025-01-15T11:30:00.000Z"
  },
  "message": "QR Code generated successfully"
}
```

## 4.3 Scan QR Code

**POST** `/game/scan-qr`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "qrCodeData": "WARISAN_CHAR_64f1a2b3c4d5e6f7g8h9i0j2_64f1a2b3c4d5e6f7g8h9i0j1"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "character": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar",
      "introduction": "Semar adalah punokawan yang bijaksana...",
      "image": "https://example.com/semar.jpg",
      "characteristics": ["bijaksana", "humoris", "pelindung"]
    },
    "canStartGame": true
  },
  "message": "QR Code scanned successfully"
}
```

## 4.4 Start Game Session

**POST** `/game/start-session`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "characterId": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "sessionId": "64f1a2b3c4d5e6f7g8h9i0j7",
    "character": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar"
    },
    "currentLevel": 1,
    "livesRemaining": 3,
    "score": 0,
    "startTime": "2025-01-15T10:30:00.000Z"
  },
  "message": "Game session started successfully"
}
```

## 4.5 Get Game Session

**GET** `/game/session/:sessionId`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "sessionId": "64f1a2b3c4d5e6f7g8h9i0j7",
    "character": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar"
    },
    "currentLevel": 2,
    "livesRemaining": 2,
    "score": 150,
    "startTime": "2025-01-15T10:30:00.000Z",
    "status": "active",
    "answeredQuestions": [
      {
        "questionId": "64f1a2b3c4d5e6f7g8h9i0j8",
        "selectedOption": 2,
        "isCorrect": true,
        "timeSpent": 15,
        "timestamp": "2025-01-15T10:31:00.000Z"
      }
    ]
  },
  "message": "Game session retrieved successfully"
}
```

## 4.6 Submit Answer

**POST** `/game/answer`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "sessionId": "64f1a2b3c4d5e6f7g8h9i0j7",
  "questionId": "64f1a2b3c4d5e6f7g8h9i0j8",
  "selectedOption": 2,
  "timeSpent": 15
}
```

### Response
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctAnswer": 2,
    "explanation": "Jawaban yang benar adalah 'Sugeng enjing' yang berarti selamat pagi",
    "pointsEarned": 50,
    "newScore": 200,
    "livesRemaining": 3,
    "nextQuestion": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j9",
      "level": 2,
      "dialogue": "Semar: 'Yen arep mangan, kudu ngomong apa?'",
      "context": "Semar bertanya tentang tata krama saat makan",
      "options": [
        {"text": "Bismillah", "index": 0},
        {"text": "Sugeng dhahar", "index": 1},
        {"text": "Matur nuwun", "index": 2},
        {"text": "Sampun", "index": 3}
      ],
      "points": 60
    },
    "levelCompleted": false
  },
  "message": "Answer submitted successfully"
}
```

### Wrong Answer Response
```json
{
  "success": true,
  "data": {
    "isCorrect": false,
    "correctAnswer": 1,
    "explanation": "Jawaban yang benar adalah 'Sugeng enjing' yang berarti selamat pagi",
    "pointsEarned": 0,
    "newScore": 150,
    "livesRemaining": 2,
    "nextQuestion": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j9",
      "level": 2,
      "dialogue": "Semar: 'Yen arep mangan, kudu ngomong apa?'",
      "context": "Semar bertanya tentang tata krama saat makan",
      "options": [
        {"text": "Bismillah", "index": 0},
        {"text": "Sugeng dhahar", "index": 1},
        {"text": "Matur nuwun", "index": 2},
        {"text": "Sampun", "index": 3}
      ],
      "points": 60
    },
    "levelCompleted": false
  },
  "message": "Answer submitted successfully"
}
```

## 4.7 Complete Game Session

**POST** `/game/complete-session`

**Headers**: `Authorization: Bearer <token>`

### Request Body
```json
{
  "sessionId": "64f1a2b3c4d5e6f7g8h9i0j7"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "sessionId": "64f1a2b3c4d5e6f7g8h9i0j7",
    "finalScore": 350,
    "totalPlayTime": 1200,
    "levelsCompleted": 4,
    "accuracy": 0.85,
    "character": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Semar",
      "wisdomMessage": "Kebijaksanaan sejati datang dari pengalaman hidup yang penuh makna"
    },
    "achievements": [
      {
        "type": "LEVEL_MASTER",
        "title": "Master Semar",
        "description": "Menyelesaikan semua level dengan karakter Semar"
      }
    ],
    "newPersonalBest": true,
    "ranking": {
      "position": 15,
      "totalPlayers": 100
    }
  },
  "message": "Game session completed successfully"
}
```

## 4.8 Get Leaderboard

**GET** `/game/leaderboard?limit=10&characterId=64f1a2b3c4d5e6f7g8h9i0j2`

### Query Parameters
- `limit` (optional): Number of results (default: 10, max: 50)
- `characterId` (optional): Filter by specific character
- `timeframe` (optional): 'daily', 'weekly', 'monthly', 'all' (default: 'all')

### Response
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": "64f1a2b3c4d5e6f7g8h9i0j1",
        "username": "johndoe",
        "avatar": "https://example.com/avatar1.jpg",
        "score": 450,
        "character": "Semar",
        "completedAt": "2025-01-15T09:30:00.000Z",
        "playTime": 900
      },
      {
        "rank": 2,
        "userId": "64f1a2b3c4d5e6f7g8h9i0j2",
        "username": "janedoe",
        "avatar": "https://example.com/avatar2.jpg",
        "score": 420,
        "character": "Semar",
        "completedAt": "2025-01-15T08:45:00.000Z",
        "playTime": 1050
      }
    ],
    "userRank": {
      "position": 15,
      "score": 350,
      "totalPlayers": 100
    },
    "metadata": {
      "totalPlayers": 100,
      "timeframe": "all",
      "characterFilter": "Semar"
    }
  },
  "message": "Leaderboard retrieved successfully"
}
```

---

# 5. Questions Endpoints

## 5.1 Get Questions by Character and Level

**GET** `/questions/character/:characterId/level/:level`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j8",
        "level": 1,
        "dialogue": "Semar: 'Yen ketemu wong tuwa, kudu ngomong apa?'",
        "context": "Semar bertanya tentang tata krama kepada orang tua",
        "options": [
          {"text": "Halo", "index": 0},
          {"text": "Sugeng enjing", "index": 1},
          {"text": "Hai", "index": 2},
          {"text": "Yo", "index": 3}
        ],
        "points": 50,
        "difficulty": "easy",
        "tags": ["tata krama", "sapaan"]
      }
    ],
    "metadata": {
      "characterId": "64f1a2b3c4d5e6f7g8h9i0j2",
      "characterName": "Semar",
      "level": 1,
      "totalQuestions": 20,
      "difficulty": "easy"
    }
  },
  "message": "Questions retrieved successfully"
}
```

## 5.2 Get Single Question

**GET** `/questions/:questionId`

**Headers**: `Authorization: Bearer <token>`

### Response
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j8",
    "characterId": "64f1a2b3c4d5e6f7g8h9i0j2",
    "level": 1,
    "dialogue": "Semar: 'Yen ketemu wong tuwa, kudu ngomong apa?'",
    "context": "Semar bertanya tentang tata krama kepada orang tua",
    "options": [
      {"text": "Halo", "index": 0},
      {"text": "Sugeng enjing", "index": 1},
      {"text": "Hai", "index": 2},
      {"text": "Yo", "index": 3}
    ],
    "points": 50,
    "difficulty": "easy",
    "tags": ["tata krama", "sapaan"]
  },
  "message": "Question retrieved successfully"
}
```

---

# 6. Rate Limiting

| Endpoint | Rate Limit |
|----------|------------|
| `/auth/login` | 5 requests per 15 minutes |
| `/auth/register` | 3 requests per hour |
| `/auth/refresh-token` | 10 requests per hour |
| `/game/*` | 100 requests per hour |
| `/questions/*` | 200 requests per hour |
| `/users/*` | 50 requests per hour |
| Global | 1000 requests per hour |

---

# 7. WebSocket Events (Optional)

Untuk real-time features seperti multiplayer atau live leaderboard:

## Connection
```javascript
const socket = io('wss://warisan-api.railway.app', {
  auth: {
    token: 'Bearer <jwt_token>'
  }
});
```

## Events

### Client to Server
```javascript
// Join game room
socket.emit('join-game', { sessionId: 'session123' });

// Submit answer
socket.emit('submit-answer', {
  sessionId: 'session123',
  questionId: 'question456',
  selectedOption: 2,
  timeSpent: 15
});
```

### Server to Client
```javascript
// Answer result
socket.on('answer-result', (data) => {
  console.log(data); // { isCorrect: true, pointsEarned: 50, ... }
});

// Leaderboard update
socket.on('leaderboard-update', (data) => {
  console.log(data); // Updated leaderboard data
});
```

---

# 8. Sample Data

## Sample Questions Data

### Semar - Level 1 (Easy)
```json
[
  {
    "dialogue": "Semar: 'Yen ketemu wong tuwa, kudu ngomong apa?'",
    "context": "Semar bertanya tentang tata krama kepada orang tua",
    "options": [
      {"text": "Halo", "index": 0},
      {"text": "Sugeng enjing", "index": 1},
      {"text": "Hai", "index": 2},
      {"text": "Yo", "index": 3}
    ],
    "correctAnswer": 1,
    "explanation": "'Sugeng enjing' adalah sapaan yang sopan dalam bahasa Jawa",
    "points": 50
  },
  {
    "dialogue": "Semar: 'Yen arep mangan, kudu ngomong apa dhisik?'",
    "context": "Semar bertanya tentang doa sebelum makan",
    "options": [
      {"text": "Bismillah", "index": 0},
      {"text": "Sugeng dhahar", "index": 1},
      {"text": "Matur nuwun", "index": 2},
      {"text": "Sampun", "index": 3}
    ],
    "correctAnswer": 0,
    "explanation": "'Bismillah' diucapkan sebelum makan sebagai bentuk syukur",
    "points": 50
  }
]
```

### Petruk - Level 1 (Easy)
```json
[
  {
    "dialogue": "Petruk: 'Aku lagi luwe banget nih, 'luwe' kuwi apa ya?'",
    "context": "Petruk bertanya tentang arti kata 'luwe'",
    "options": [
      {"text": "Lapar", "index": 0},
      {"text": "Haus", "index": 1},
      {"text": "Capek", "index": 2},
      {"text": "Ngantuk", "index": 3}
    ],
    "correctAnswer": 0,
    "explanation": "'Luwe' dalam bahasa Jawa berarti lapar",
    "points": 50
  }
]
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Prepared by**: Backend Team  
**Reviewed by**: API Architect  
**Approved by**: Technical Lead