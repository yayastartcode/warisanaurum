import React, { useState, useRef } from 'react';
import { Shuffle, Play } from 'lucide-react';
import type { Character } from '../types';

interface WheelOfFortuneProps {
  characters: Character[];
  onSpin: () => Promise<void>;
  isSpinning: boolean;
  disabled?: boolean;
}

const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({
  characters,
  onSpin,
  isSpinning,
  disabled = false
}) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = async () => {
    if (isSpinning || disabled) return;

    // Generate random rotation (multiple full rotations + random angle)
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);
    
    // Call the onSpin function
    await onSpin();
  };

  // Calculate segment angle
  const segmentAngle = characters.length > 0 ? 360 / characters.length : 0;

  // Generate colors for segments
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
        </div>
        
        {/* Wheel */}
        <div
          ref={wheelRef}
          className={`w-80 h-80 rounded-full border-8 border-gray-800 relative overflow-hidden transition-transform duration-[4000ms] ease-out ${
            isSpinning ? 'pointer-events-none' : ''
          }`}
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${
              characters.map((_, index) => {
                const startAngle = (index * segmentAngle);
                const endAngle = ((index + 1) * segmentAngle);
                const color = colors[index % colors.length];
                return `${color} ${startAngle}deg ${endAngle}deg`;
              }).join(', ')
            })`
          }}
        >
          {/* Character Names */}
          {characters.map((character, index) => {
            const angle = (index * segmentAngle) + (segmentAngle / 2);
            const radian = (angle * Math.PI) / 180;
            const radius = 120; // Distance from center
            const x = Math.cos(radian - Math.PI / 2) * radius;
            const y = Math.sin(radian - Math.PI / 2) * radius;
            
            return (
              <div
                key={character._id}
                className="absolute text-white font-bold text-sm transform -translate-x-1/2 -translate-y-1/2 text-center"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                  maxWidth: '80px',
                  lineHeight: '1.2'
                }}
              >
                {character.name}
              </div>
            );
          })}
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-white flex items-center justify-center">
            <Shuffle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || disabled || characters.length === 0}
        className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
          isSpinning || disabled || characters.length === 0
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 shadow-lg'
        }`}
      >
        {isSpinning ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Memutar...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Putar Roda!</span>
          </>
        )}
      </button>

      {/* Instructions */}
      <div className="text-center text-gray-600 max-w-md">
        <p className="text-sm">
          Putar roda untuk memilih karakter secara acak dan mulai permainan kuis!
        </p>
        {characters.length === 0 && (
          <p className="text-red-500 text-sm mt-2">
            Tidak ada karakter yang tersedia saat ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default WheelOfFortune;