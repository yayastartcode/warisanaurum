import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Leaderboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data untuk leaderboard
  const leaderboardData = [
    { rank: 1, username: 'BudiJawa', score: 2850, gamesPlayed: 15 },
    { rank: 2, username: 'SariKultur', score: 2720, gamesPlayed: 12 },
    { rank: 3, username: 'RamaTraditional', score: 2650, gamesPlayed: 18 },
    { rank: 4, username: 'DewiJavanese', score: 2480, gamesPlayed: 10 },
    { rank: 5, username: 'ArjunaBudaya', score: 2350, gamesPlayed: 14 },
    { rank: 6, username: 'SitiWarisan', score: 2200, gamesPlayed: 9 },
    { rank: 7, username: 'AgusNusantara', score: 2150, gamesPlayed: 11 },
    { rank: 8, username: 'IndraCulture', score: 2050, gamesPlayed: 8 },
    { rank: 9, username: 'MayaJawa', score: 1980, gamesPlayed: 13 },
    { rank: 10, username: 'FajarTradisi', score: 1850, gamesPlayed: 7 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.webp)' }}
    >
      {/* Overlay untuk readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              to="/"
              className="flex items-center text-yellow-600 hover:text-yellow-800 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali
            </Link>
            <Trophy className="h-6 w-6 text-yellow-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Papan Peringkat</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pemain Terbaik WARISAN
          </h2>
          <p className="text-lg text-gray-600">
            Lihat siapa yang paling menguasai budaya Jawa!
          </p>
        </div>

        {/* User's Current Rank */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-1">
                Peringkat Anda
              </h3>
              <p className="text-blue-700">
                {user?.username || 'Pengguna'} - Belum ada permainan
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">-</div>
              <div className="text-sm text-blue-700">Mulai bermain untuk mendapat peringkat!</div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div
              key={player.rank}
              className={`${getRankBg(player.rank)} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(player.rank)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {player.username}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {player.gamesPlayed} permainan dimainkan
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">poin</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Skor Tertinggi
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {leaderboardData[0]?.score.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Medal className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Pemain
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {leaderboardData.length}+
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rata-rata Skor
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {Math.round(
                leaderboardData.reduce((sum, player) => sum + player.score, 0) /
                leaderboardData.length
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ingin Masuk Papan Peringkat?
            </h3>
            <p className="text-yellow-100 mb-6">
              Mulai bermain sekarang dan tunjukkan pengetahuan budaya Jawa Anda!
            </p>
            <Link
              to="/dashboard"
              className="bg-white text-yellow-600 hover:bg-yellow-50 px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Mulai Bermain
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Leaderboard;