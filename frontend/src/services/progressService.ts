import { apiService } from './api';

export interface LevelProgress {
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score: number;
  attempts: number;
  bestTime?: number;
  completedAt?: Date;
}

export interface CharacterProgress {
  characterId: string;
  isUnlocked: boolean;
  currentLevel: number;
  totalScore: number;
  gamesPlayed: number;
  gamesCompleted: number;
  levels: LevelProgress[];
  lastPlayedAt?: Date;
}

export interface UserProgress {
  _id: string;
  userId: string;
  currentCharacter?: string;
  currentLevel: number;
  totalScore: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  characters: CharacterProgress[];
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaderboardEntry {
  _id: string;
  username: string;
  totalScore: number;
  totalGamesCompleted: number;
  profilePicture?: string;
}

class ProgressService {
  // Get user progress
  async getUserProgress(): Promise<UserProgress> {
    const response = await apiService['api'].get('/progress');
    return response.data.data;
  }

  // Select character
  async selectCharacter(characterId: string): Promise<UserProgress> {
    const response = await apiService['api'].post('/progress/character/select', {
      characterId
    });
    return response.data.data;
  }

  // Get character progress
  async getCharacterProgress(characterId: string): Promise<CharacterProgress> {
    const response = await apiService['api'].get(`/progress/character/${characterId}`);
    return response.data.data;
  }

  // Update level progress
  async updateLevelProgress(data: {
    characterId: string;
    level: number;
    score: number;
    completed: boolean;
    timeTaken?: number;
  }): Promise<UserProgress> {
    const response = await apiService['api'].post('/progress/level/update', data);
    return response.data.data;
  }

  // Get available levels for character
  async getAvailableLevels(characterId: string): Promise<LevelProgress[]> {
    const response = await apiService['api'].get(`/progress/levels/${characterId}`);
    return response.data.data.levels;
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const response = await apiService['api'].get(`/progress/leaderboard?limit=${limit}`);
    return response.data.data;
  }
}

export default new ProgressService();