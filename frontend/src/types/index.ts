// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  totalScore: number;
  gamesPlayed: number;
  highestScore: number;
  achievements: string[];
  level: number;
  experience: number;
  createdAt: string;
  updatedAt: string;
}

// Character types
export interface Character {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Question types
export interface Question {
  _id: string;
  characterId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  explanation?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Game Session types
export interface GameAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  pointsEarned: number;
}

export interface GameSession {
  _id: string;
  userId: string;
  characterId: string;
  status: 'active' | 'completed' | 'abandoned';
  score: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: GameAnswer[];
  startedAt: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Backend paginated response structure
export interface BackendPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    characters?: T[];
    questions?: T[];
    sessions?: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

// Game types
export interface SpinResult {
  character: Character;
  message: string;
}

export interface GameSessionResponse {
  session: GameSession;
  currentQuestion: Question;
  progress: number;
}

export interface SubmitAnswerRequest {
  sessionId: string;
  questionId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export interface LeaderboardEntry {
  user: {
    _id: string;
    username: string;
  };
  totalScore: number;
  gamesPlayed: number;
  highestScore: number;
  rank: number;
}

// Component Props types
export interface RouteProps {
  children?: React.ReactNode;
}

export interface ProtectedRouteProps extends RouteProps {
  requireAuth?: boolean;
}