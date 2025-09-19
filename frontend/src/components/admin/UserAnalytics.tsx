import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Users, Clock, Trophy, TrendingUp, Download, RefreshCw } from 'lucide-react';
import { adminApi, type UserAnalytic } from '../../services/adminApi';

// UserAnalytic interface is now imported from adminApi

const UserAnalytics: React.FC = () => {
  const [users, setUsers] = useState<UserAnalytic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof UserAnalytic>('totalScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });
  const [summary, setSummary] = useState({
    totalUsers: 0,
    averageScore: 0,
    totalGamesPlayed: 0,
    highestScore: 0
  });

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await adminApi.getUserAnalytics({
        page: currentPage,
        limit: usersPerPage,
        sortBy,
        sortOrder,
        search: searchTerm
      });
      
      setUsers(response.users);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalUsers: response.pagination?.totalUsers || 0,
          limit: response.pagination?.limit || 10
        });
        
        // Update summary from backend response
        if (response.summary) {
          setSummary(response.summary);
        }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, usersPerPage, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    loadAnalytics();
  }, [currentPage, searchTerm, sortBy, sortOrder, loadAnalytics]);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        loadAnalytics(true);
      }, 30000); // Refresh every 30 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, loadAnalytics]);

  // Manual refresh function
  const handleManualRefresh = () => {
    loadAnalytics(true);
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Since backend handles pagination, we use users directly
  const currentUsers = users || [];
  const totalPages = pagination.totalPages;
  const indexOfFirstUser = (pagination.currentPage - 1) * pagination.limit;
  const indexOfLastUser = Math.min(indexOfFirstUser + pagination.limit, pagination.totalUsers);

  const handleSort = (column: keyof UserAnalytic) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const formatPlayTime = (minutes: number) => {
    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}j ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m`;
    } else {
      return '< 1m';
    }
  };

  const formatLastPlayed = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = async () => {
    try {
      setLoading(true);
      const blob = await adminApi.exportUserAnalytics();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_analytics.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate additional statistics from current page data
  const totalPlayTime = (users || []).reduce((sum, user) => sum + user.totalPlayTime, 0);
  const activeUsersToday = (users || []).filter(user => {
    const lastLogin = new Date(user.lastLogin);
    const today = new Date();
    return lastLogin.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics User</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Auto-refresh toggle */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Auto-refresh:</label>
            <button
              onClick={toggleAutoRefresh}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Memperbarui...' : 'Refresh'}
          </button>
          
          {/* Export button */}
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
         </div>
       </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Memuat data analytics...</div>
        </div>
      )}

      {/* Realtime Status Indicator */}
      {autoRefresh && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 font-medium">
              Data diperbarui secara realtime setiap 30 detik
            </span>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total User</p>
              <p className="text-2xl font-bold text-blue-900">{summary.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Total Waktu Bermain</p>
              <p className="text-2xl font-bold text-green-900">{formatPlayTime(totalPlayTime)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-600">Total Games</p>
              <p className="text-2xl font-bold text-yellow-900">{summary.totalGamesPlayed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Skor Tertinggi</p>
              <p className="text-2xl font-bold text-purple-900">{summary.highestScore}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-indigo-600">Rata-rata Skor</p>
              <p className="text-2xl font-bold text-indigo-900">{summary.averageScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-pink-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-pink-600">Aktif Hari Ini</p>
              <p className="text-2xl font-bold text-pink-900">{activeUsersToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari username atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as keyof UserAnalytic)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="totalScore">Total Skor</option>
              <option value="totalPlayTime">Waktu Bermain</option>
              <option value="lastLogin">Terakhir Bermain</option>
              <option value="gamesPlayed">Game Dimainkan</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="desc">Tertinggi</option>
              <option value="asc">Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('username')}
                >
                  Username {sortBy === 'username' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalScore')}
                >
                  Total Skor {sortBy === 'totalScore' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalPlayTime')}
                >
                  Waktu Bermain {sortBy === 'totalPlayTime' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastLogin')}
                >
                  Terakhir Bermain {sortBy === 'lastLogin' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gamesPlayed')}
                >
                  Game Dimainkan {sortBy === 'gamesPlayed' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('highestScore')}
                  >
                    Skor Tertinggi {sortBy === 'highestScore' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-blue-600">{user.totalScore}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPlayTime(user.totalPlayTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLastPlayed(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.gamesPlayed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-semibold text-green-600">{user.gamesPlayed > 0 ? (user.totalScore / user.gamesPlayed).toFixed(1) : '0.0'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              Menampilkan {indexOfFirstUser + 1}-{indexOfLastUser} dari {pagination.totalUsers} user (Halaman {pagination.currentPage} dari {totalPages})
            </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={pagination.currentPage === 1}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md ${
                  pagination.currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={pagination.currentPage === totalPages}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {!loading && (users || []).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada user yang ditemukan.
        </div>
      )}
    </div>
  );
};

export default UserAnalytics;