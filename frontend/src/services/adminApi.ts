import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface UserAnalytic {
  _id: string;
  username: string;
  email: string;
  totalScore: number;
  gamesPlayed: number;
  highestScore: number;
  level: number;
  experience: number;
  totalPlayTime: number;
  lastLogin: string;
  completedGames: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalQuestions: number;
    totalCharacters: number;
    totalGameSessions: number;
  };
  recentActivity: Array<{
    _id: string;
    gamesPlayed: number;
    totalScore: number;
  }>;
  topPlayers: Array<{
    _id: string;
    username: string;
    totalScore: number;
    highestScore: number;
    gamesPlayed: number;
  }>;
  questionStats: Array<{
    _id: string;
    questionCount: number;
    averagePoints: number;
  }>;
}



class AdminApiService {
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
  }

  // Get admin dashboard statistics
  async getAdminStats(): Promise<AdminStats> {
    const response = await this.api.get('/admin/stats');
    return response.data.data;
  }

  // Get user analytics with pagination and filtering
  async getUserAnalytics(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  } = {}) {
    const response = await this.api.get('/admin/users/analytics', { params });
    return response.data.data;
  }

  // Export user analytics as CSV
  async exportUserAnalytics(): Promise<Blob> {
    const response = await this.api.get('/admin/users/export', {
      responseType: 'blob'
    });
    return response.data;
  }


}

export const adminApi = new AdminApiService();
export default adminApi;