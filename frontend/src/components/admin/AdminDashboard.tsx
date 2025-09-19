import React, { useState, useEffect } from 'react';
import { Users, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import { adminApi, type AdminStats } from '../../services/adminApi';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
              <div className="text-2xl font-bold text-gray-900">{stats?.overview.totalUsers.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pertanyaan</p>
              <div className="text-2xl font-bold text-gray-900">48</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Karakter</p>
              <div className="text-2xl font-bold text-gray-900">{stats?.overview.totalCharacters || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sesi Game</p>
              <div className="text-2xl font-bold text-gray-900">{stats?.overview.totalGameSessions.toLocaleString() || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {stats?.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-600">
                    User dengan {activity.gamesPlayed} game dimainkan
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {activity.totalScore} poin
                </span>
              </div>
            )) || []}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Players</h2>
          <div className="space-y-4">
            {stats?.topPlayers.map((player, index) => (
              <div key={player._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{player.username}</p>
                    <p className="text-xs text-gray-500">{player.gamesPlayed} games</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{player.totalScore}</p>
                  <p className="text-xs text-gray-500">Highest: {player.highestScore}</p>
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>

      {/* Question Stats */}
      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistik Pertanyaan per Karakter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats?.questionStats.map((stat) => (
              <div key={stat._id} className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Karakter ID: {stat._id}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Pertanyaan: <span className="font-medium">{stat.questionCount}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Rata-rata Poin: <span className="font-medium">{stat.averagePoints.toFixed(1)}</span>
                  </p>
                </div>
              </div>
            )) || []}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;