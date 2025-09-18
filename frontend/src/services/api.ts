import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  BackendPaginatedResponse,
  Character,
  Question,
  GameSession,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  SpinResult,
  GameSessionResponse,
  SubmitAnswerRequest,
  LeaderboardEntry
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Handle rate limiting (429) - don't retry, just reject
        if (error.response?.status === 429) {
          return Promise.reject(error);
        }
        
        // Don't try to refresh token for refresh endpoint itself
        if (originalRequest.url?.includes('/auth/refresh')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          return Promise.reject(error);
        }
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            console.log('Attempting token refresh due to 401 error');
            
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
               const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
               
               console.log('Token refresh successful');
               localStorage.setItem('accessToken', accessToken);
               localStorage.setItem('refreshToken', newRefreshToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.api(originalRequest);
            } else {
              console.log('No refresh token found, redirecting to login');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }
          } catch (refreshError: any) {
            console.error('Token refresh failed:', refreshError);
            
            // If refresh fails due to rate limiting, don't redirect immediately
            if (refreshError.response?.status === 429) {
              return Promise.reject(error);
            }
            
            // Refresh failed for other reasons, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/auth/register', data);
  }

  async login(credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> {
    return this.api.post('/auth/login', credentials);
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.api.post<RefreshTokenResponse>('/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(): Promise<AxiosResponse<ApiResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.api.post('/auth/logout', { refreshToken });
  }

  // Character endpoints
  async getCharacters(params?: {
    page?: number;
    limit?: number;
    difficulty?: string;
    category?: string;
  }): Promise<AxiosResponse<BackendPaginatedResponse<Character>>> {
    return this.api.get('/characters', { params });
  }

  async getCharacterById(id: string): Promise<AxiosResponse<ApiResponse<Character>>> {
    return this.api.get(`/characters/${id}`);
  }

  async getRandomCharacter(): Promise<AxiosResponse<ApiResponse<Character>>> {
    return this.api.get('/characters/random');
  }

  // Question endpoints
  async getQuestionsByCharacter(
    characterId: string,
    params?: { page?: number; limit?: number; difficulty?: string }
  ): Promise<AxiosResponse<PaginatedResponse<Question>>> {
    return this.api.get(`/questions/character/${characterId}`, { params });
  }

  async getQuizQuestions(
    characterId: string,
    count: number = 10
  ): Promise<AxiosResponse<ApiResponse<Question[]>>> {
    return this.api.get(`/questions/quiz/${characterId}`, {
      params: { count }
    });
  }

  // Game endpoints
  async spinWheel(): Promise<AxiosResponse<ApiResponse<SpinResult>>> {
    return this.api.post('/game/spin');
  }

  async startGameSession(characterId: string): Promise<AxiosResponse<ApiResponse<GameSessionResponse>>> {
    return this.api.post('/game/session/start', { characterId });
  }

  async submitAnswer(data: SubmitAnswerRequest): Promise<AxiosResponse<ApiResponse<GameSessionResponse>>> {
    return this.api.post('/game/session/answer', data);
  }

  async completeGameSession(sessionId: string): Promise<AxiosResponse<ApiResponse<GameSession>>> {
    return this.api.post(`/game/session/${sessionId}/complete`);
  }

  async getUserGameSessions(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<AxiosResponse<BackendPaginatedResponse<GameSession>>> {
    return this.api.get('/game/sessions', { params });
  }

  async getGameSessionDetails(sessionId: string): Promise<AxiosResponse<ApiResponse<GameSession>>> {
    return this.api.get(`/game/session/${sessionId}`);
  }

  async getLeaderboard(params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<LeaderboardEntry>>> {
    return this.api.get('/game/leaderboard', { params });
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
export default apiService;