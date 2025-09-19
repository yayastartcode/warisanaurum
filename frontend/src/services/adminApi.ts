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

export interface QuestionFormData {
  characterId: string;
  question: string;
  questionType: 'multiple_choice' | 'essay';
  options?: string[];
  correctAnswer?: number;
  correctAnswerText?: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'origin' | 'history' | 'culture' | 'facts' | 'general';
  points?: number;
  translation?: {
    conversation?: string[];
    questionLine?: string;
    options?: string[];
    correctAnswerText?: string;
  };
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

  // Create a new question
  async createQuestion(questionData: QuestionFormData) {
    const response = await this.api.post('/admin/questions', questionData);
    return response.data;
  }

  // Update an existing question
  async updateQuestion(id: string, questionData: Partial<QuestionFormData>) {
    const response = await this.api.put(`/admin/questions/${id}`, questionData);
    return response.data;
  }

  // Delete a question
  async deleteQuestion(id: string) {
    const response = await this.api.delete(`/admin/questions/${id}`);
    return response.data;
  }

  // Bulk create questions
  async bulkCreateQuestions(questions: QuestionFormData[]) {
    const response = await this.api.post('/admin/questions/bulk', { questions });
    return response.data;
  }

  // Get question statistics
  async getQuestionStats() {
    const response = await this.api.get('/admin/questions/stats');
    return response.data;
  }

  // Get all characters for dropdown
  async getCharacters() {
    const response = await this.api.get('/characters');
    return response.data.data;
  }

  // Get questions with filtering
  async getQuestions(params: {
    page?: number;
    limit?: number;
    characterId?: string;
    difficulty?: string;
    category?: string;
    search?: string;
  } = {}) {
    const response = await this.api.get('/questions', { params });
    return response.data;
  }
}

export const adminApi = new AdminApiService();
export default adminApi;