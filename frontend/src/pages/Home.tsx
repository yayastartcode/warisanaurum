import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Trophy, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { user } = useAuth();

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
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/wyg.webp" alt="WARISAN" className="h-10 w-10 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">WARISAN</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Halo, {user?.username || 'Pengguna'}</span>
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Selamat Datang di WARISAN
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi kekayaan budaya Jawa melalui permainan interaktif yang menyenangkan
          </p>
        </div>

        {/* Main Menu */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Main Game */}
          <Link
            to="/main"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-blue-500"
          >
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
              <Play className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Main</h3>
            <p className="text-gray-600">
              Mulai permainan utama dan jelajahi karakter-karakter budaya Jawa
            </p>
          </Link>

          {/* Tutorial */}
          <Link
            to="/tutorial"
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-green-500"
          >
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <BookOpen className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Tutorial</h3>
            <p className="text-gray-600">
              Pelajari cara bermain dan pahami aturan permainan
            </p>
          </Link>
        </div>

        {/* Secondary Menu */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Skor */}
          <Link
            to="/leaderboard"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-200 hover:border-yellow-400"
          >
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Skor</h4>
            <p className="text-gray-600 text-sm">
              Lihat papan peringkat dan pencapaian terbaik
            </p>
          </Link>

          {/* Beranda */}
          <Link
            to="/"
            className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-200 hover:border-purple-400"
          >
            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <HomeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Beranda</h4>
            <p className="text-gray-600 text-sm">
              Kembali ke halaman utama
            </p>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            WARISAN - Melestarikan Budaya Jawa untuk Generasi Mendatang
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;