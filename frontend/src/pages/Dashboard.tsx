import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Play, Trophy, Star, TrendingUp } from 'lucide-react';
import type { GameSession } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async (): Promise<void> => {
    try {
      const response = await apiService.getUserGameSessions({ limit: 5 });
      // Handle the backend response structure: response.data.data.sessions
      const sessionsData = response.data.data?.sessions || [];
      setRecentSessions(Array.isArray(sessionsData) ? sessionsData : []);
    } catch (error) {
      console.error('Failed to fetch recent sessions:', error);
      setRecentSessions([]); // Ensure recentSessions is always an array
    } finally {
      setIsLoading(false);
    }
  };





  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'abandoned':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Selamat datang kembali, {user?.username}!
        </h1>
        <p className="text-gray-600">
          Siap untuk menjelajahi warisan budaya Indonesia?
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Skor</p>
              <p className="text-2xl font-bold text-gray-900">{user?.totalScore || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Permainan Dimainkan</p>
              <p className="text-2xl font-bold text-gray-900">{user?.gamesPlayed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Skor Tertinggi</p>
              <p className="text-2xl font-bold text-gray-900">{user?.highestScore || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tingkat</p>
              <p className="text-2xl font-bold text-gray-900">{user?.level || 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Game Sessions */}
      <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sesi Permainan Terbaru</h2>
            
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada sesi permainan</p>
                <p className="text-sm text-gray-400">Mulai permainan pertama Anda dengan memutar roda!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/game/${session._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Play className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Sesi Permainan
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(session.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{session.score} pts</p>
                        <p className="text-sm text-gray-500">
                          {session.currentQuestionIndex}/{session.totalQuestions}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
    </div>
  );
};

export default Dashboard;