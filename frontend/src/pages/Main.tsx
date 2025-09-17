import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Character {
  id: number;
  name: string;
  description: string;
  color: string;
  image: string;
}

const characters: Character[] = [
  {
    id: 1,
    name: 'Semar',
    description: 'Punakawan bijaksana dan penuh kebijaksanaan',
    color: 'from-blue-500 to-blue-700',
    image: '/semar.png'
  },
  {
    id: 2,
    name: 'Gareng',
    description: 'Punakawan yang lucu dan menghibur',
    color: 'from-green-500 to-green-700',
    image: '/gareng.png'
  },
  {
    id: 3,
    name: 'Petruk',
    description: 'Punakawan yang cerdik dan kreatif',
    color: 'from-purple-500 to-purple-700',
    image: '/petruk.png'
  },
  {
    id: 4,
    name: 'Bagong',
    description: 'Punakawan yang berani dan setia',
    color: 'from-red-500 to-red-700',
    image: '/bagong.png'
  }
];

const Main: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [rotation, setRotation] = useState(0);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const spins = 5 + Math.random() * 5; // 5-10 putaran
    const finalRotation = rotation + (spins * 360) + (Math.random() * 360);
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      const normalizedRotation = finalRotation % 360;
      const segmentAngle = 360 / characters.length;
      const selectedIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) / segmentAngle) % characters.length;
      
      setSelectedCharacter(characters[selectedIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const startGame = () => {
    if (selectedCharacter) {
      // Simpan karakter yang dipilih ke localStorage atau state management
      localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
      navigate('/gameplay');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.webp)' }}
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
                <img src="/wyg.webp" alt="WARISAN" className="h-10 w-10 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">WARISAN - Main Game</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Halo, {user?.username || 'Pengguna'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Pilih Karakter Punakawan
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-lg">
              Putar roda keberuntungan untuk memilih karakter punakawan yang akan menemanimu bermain
            </p>
          </div>

          {/* Wheel of Fortune */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative mb-8">
              {/* Wheel Container */}
              <div className="relative w-80 h-80">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                </div>
                
                {/* Wheel */}
                <div 
                  className={`w-80 h-80 rounded-full border-8 border-yellow-500 relative overflow-hidden transition-transform duration-3000 ease-out ${isSpinning ? 'animate-spin' : ''}`}
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  {characters.map((character, index) => {
                    const angle = (360 / characters.length) * index;
                    return (
                      <div
                        key={character.id}
                        className={`absolute w-1/2 h-1/2 origin-bottom-right bg-gradient-to-br ${character.color}`}
                        style={{
                          transform: `rotate(${angle}deg)`,
                          clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                        }}
                      >
                        <div 
                          className="absolute top-4 left-4 text-white font-bold text-center"
                          style={{ transform: `rotate(${45}deg)` }}
                        >
                          <img 
                            src={character.image} 
                            alt={character.name}
                            className="w-8 h-8 mb-1 mx-auto object-contain"
                          />
                          <div className="text-sm">{character.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-500 rounded-full border-4 border-white flex items-center justify-center z-10">
                  <Play className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={`px-8 py-4 rounded-lg font-bold text-white text-xl transition-all duration-300 ${
                isSpinning 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-yellow-500 hover:bg-yellow-600 hover:scale-105 shadow-lg'
              }`}
            >
              {isSpinning ? 'Memutar...' : 'Putar Roda!'}
            </button>
          </div>

          {/* Selected Character */}
          {selectedCharacter && (
            <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-8 text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Karakter Terpilih: {selectedCharacter.name}
              </h3>
              <img 
                src={selectedCharacter.image} 
                alt={selectedCharacter.name}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <p className="text-gray-600 mb-6">{selectedCharacter.description}</p>
              <button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Mulai Bermain dengan {selectedCharacter.name}
              </button>
            </div>
          )}

          {/* Character Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((character) => (
              <div key={character.id} className="bg-white bg-opacity-90 rounded-lg p-6 text-center shadow-lg">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-16 h-16 mx-auto mb-3 object-contain"
                />
                <h4 className="text-lg font-bold text-gray-900 mb-2">{character.name}</h4>
                <p className="text-gray-600 text-sm">{character.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;