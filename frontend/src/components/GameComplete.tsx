import React from 'react';
import { Trophy, Clock, Heart, Star, ArrowLeft, RotateCcw } from 'lucide-react';

interface GameCompleteProps {
  character: {
    name: string;
    image: string;
  };
  score: number;
  timeElapsed: number;
  livesRemaining: number;
  totalQuestions: number;
  correctAnswers: number;
  onPlayAgain: () => void;
  onBackToMain: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({
  character,
  score,
  timeElapsed,
  livesRemaining,
  totalQuestions,
  correctAnswers,
  onPlayAgain,
  onBackToMain
}) => {
  // Kata mutiara untuk setiap karakter
  const characterQuotes: { [key: string]: string } = {
    semar: "ngendika kaliyan sinten mawon kedah agem panggalih. ampun kesesa , ampun naming badhe egois, sikap lembat tembung ingkang sopan menika tanda tiyang ingkang kagungan budi",
    gareng: "basa menika kados sandhangan kedah cocok kaliyan sinten ingkang dipun-ajak matur menawi kaliyan pantaran kepareng santai nanging menawi kaliyan tiyang sepuh wajib ngajeni",
    petruk: "menawi matur kaliyan tiyang sanes kedah tenang ampun dadakan kados tahu bulat, ampun ngagem nada matur inggil, ampun nyinggung panggalih tiyang sanes",
    bagong: "kula apal :sare, dhahar, dalu lsp nanging wekdal dipunpundhut priksa malah bingung. ngendika ngagem basa Krama menika wigatos dipuntindakaken saben dinten"
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = (): string => {
    const accuracy = (correctAnswers / totalQuestions) * 100;
    if (accuracy >= 90) return "Luar Biasa! 🌟";
    if (accuracy >= 75) return "Bagus Sekali! 👏";
    if (accuracy >= 60) return "Cukup Baik! 👍";
    return "Terus Berlatih! 💪";
  };

  const characterName = character.name.toLowerCase();
  const quote = characterQuotes[characterName] || characterQuotes.semar;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.jpg)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Permainan Selesai!</h1>
            <p className="text-lg text-gray-600">{getPerformanceMessage()}</p>
          </div>

          {/* Character Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Kata Mutiara dari {character.name}
                </h2>
                <p className="text-gray-700 italic leading-relaxed text-sm md:text-base">
                  "{quote}"
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-800">{score}</div>
              <div className="text-sm text-yellow-600">Skor</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-blue-600">Waktu</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{livesRemaining}</div>
              <div className="text-sm text-red-600">Sisa Nyawa</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">{correctAnswers}/{totalQuestions}</div>
              <div className="text-sm text-green-600">Benar</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Detail</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Akurasi:</span>
                <span className="font-bold text-lg">
                  {Math.round((correctAnswers / totalQuestions) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Karakter:</span>
                <span className="font-bold">{character.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pertanyaan:</span>
                <span className="font-bold">{totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Main Lagi
            </button>
            <button
              onClick={onBackToMain}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Pilih Karakter Lain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameComplete;