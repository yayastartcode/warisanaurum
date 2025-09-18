import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Play, Lock, Star, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import progressService, { type LevelProgress } from '../services/progressService';

interface Character {
  id: number;
  name: string;
  description: string;
  color: string;
  image: string;
}





const LevelSelection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [levels, setLevels] = useState<LevelProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCharacterAndLevels = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No access token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      // Tunggu sebentar untuk memastikan user state sudah ter-update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Cek apakah user sudah login
      if (!user) {
        console.log('User not logged in, redirecting to login');
        navigate('/login');
        return;
      }
      
      // Ambil karakter yang dipilih dari localStorage
      const storedCharacter = localStorage.getItem('selectedCharacter');
      if (storedCharacter) {
        const character = JSON.parse(storedCharacter);
        console.log('Loaded character from localStorage:', character);
        
        // Pastikan character memiliki id yang valid
        if (character && character.id) {
          setSelectedCharacter(character);
          console.log('Loading levels for character ID:', character.id);
          
          // Ambil level yang tersedia untuk karakter ini
          try {
            const availableLevels = await progressService.getAvailableLevels(character.id.toString());
            setLevels(availableLevels);
            console.log('Levels loaded successfully:', availableLevels);
          } catch (apiError: any) {
            console.error('Failed to load levels:', apiError);
            if (apiError.response?.status === 401) {
              console.log('Authentication failed, redirecting to login');
              localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
              navigate('/login');
              return;
            }
            throw apiError;
          }
        } else {
          console.error('Character ID is missing or invalid:', character);
          throw new Error('Invalid character data');
        }
      } else {
        console.log('No character found in localStorage, redirecting to main');
        // Jika tidak ada karakter yang dipilih, kembali ke halaman utama
        navigate('/main');
      }
    } catch (error: any) {
        console.error('Error loading character and levels:', error);
        // If it's an authentication error, redirect to login
         if (error.response?.status === 401) {
           localStorage.removeItem('accessToken');
           localStorage.removeItem('refreshToken');
           localStorage.removeItem('user');
           navigate('/login');
           return;
         }
        // Fallback ke level default jika gagal load dari API
      setLevels([
        { level: 1, isUnlocked: true, isCompleted: false, score: 0, attempts: 0 },
        { level: 2, isUnlocked: false, isCompleted: false, score: 0, attempts: 0 },
        { level: 3, isUnlocked: false, isCompleted: false, score: 0, attempts: 0 },
        { level: 4, isUnlocked: false, isCompleted: false, score: 0, attempts: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacterAndLevels();
  }, [navigate, user]);

  // Refresh data ketika user kembali ke halaman ini
  useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refreshing level data...');
      loadCharacterAndLevels();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleLevelSelect = async (levelData: LevelProgress) => {
    if (!levelData.isUnlocked) {
      return; // Level terkunci, tidak bisa dipilih
    }

    try {
      // Simpan level yang dipilih ke localStorage
      localStorage.setItem('selectedLevel', JSON.stringify({
        id: levelData.level,
        name: `Level ${levelData.level}`,
        isUnlocked: levelData.isUnlocked,
        isCompleted: levelData.isCompleted,
        score: levelData.score
      }));
      
      // Navigasi ke halaman gameplay
      navigate('/gameplay');
    } catch (error) {
      console.error('Error selecting level:', error);
    }
  };

  const handleBackToCharacterSelection = () => {
    // Hapus karakter yang dipilih dan kembali ke main
    localStorage.removeItem('selectedCharacter');
    navigate('/main');
  };

  const handleBackToLevelSelection = () => {
    // Tetap di halaman ini, bisa digunakan untuk refresh atau reset
    window.location.reload();
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.jpg)' }}
    >
      {/* Overlay untuk readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white bg-opacity-90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link to="/" className="mr-4">
                  <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </Link>
                <img src="/wyg.jpg" alt="WARISAN" className="h-10 w-10 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">WARISAN - Pilih Level</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Halo, {user?.username || 'Pengguna'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Pilih Level Permainan
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg">
              Pilih level yang ingin kamu mainkan bersama {selectedCharacter?.name || 'karakter pilihan'}
            </p>
          </div>

          {/* Selected Character Info */}
          {selectedCharacter && (
            <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-6 text-center mb-8">
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src={selectedCharacter.image} 
                  alt={selectedCharacter.name}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Bermain dengan {selectedCharacter.name}
                  </h3>
                  <p className="text-gray-600">{selectedCharacter.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Level Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {levels.map((levelData) => (
                <div
                  key={levelData.level}
                  className={`relative bg-white bg-opacity-95 rounded-xl shadow-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                    levelData.isUnlocked 
                      ? 'cursor-pointer hover:shadow-2xl' 
                      : 'cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => levelData.isUnlocked && handleLevelSelect(levelData)}
                >
                  {/* Status Icon */}
                  <div className="absolute top-3 right-3">
                    {!levelData.isUnlocked ? (
                      <Lock className="w-5 h-5 text-gray-500" />
                    ) : levelData.isCompleted ? (
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Star className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  {/* Level Icon */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-3xl`}>
                    {levelData.isUnlocked ? '🌟' : <Lock className="h-8 w-8 text-white" />}
                  </div>
                  
                  {/* Level Info */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Level {levelData.level}</h3>
                  
                  {levelData.isCompleted && (
                    <div className="flex items-center justify-center gap-1 text-yellow-600 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">Skor: {levelData.score}</span>
                    </div>
                  )}
                  
                  {levelData.isUnlocked && !levelData.isCompleted && (
                    <p className="text-sm text-gray-600 mb-4">Siap dimainkan</p>
                  )}
                  
                  {!levelData.isUnlocked && (
                    <p className="text-sm text-gray-500 mb-4">Selesaikan level sebelumnya</p>
                  )}
                  
                  {levelData.attempts > 0 && (
                    <p className="text-xs text-gray-500 mb-4">Percobaan: {levelData.attempts}</p>
                  )}
                  
                  {/* Play Button */}
                  {levelData.isUnlocked && (
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto">
                      <Play className="h-4 w-4 mr-2" />
                      Mulai
                    </button>
                  )}
                  
                  {!levelData.isUnlocked && (
                    <div className="text-gray-500 font-medium">
                      Terkunci
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleBackToLevelSelection}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Pemilihan Level
            </button>
            
            <button
              onClick={handleBackToCharacterSelection}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg flex items-center"
            >
              <User className="h-5 w-5 mr-2" />
              Kembali ke Pemilihan Karakter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;