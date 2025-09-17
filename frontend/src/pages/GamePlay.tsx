import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowLeft, CheckCircle, XCircle, Trophy, Crown } from 'lucide-react';

interface Question {
  id: number;
  conversation: string[];
  questionLine: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
  };
}

interface Character {
  id: number;
  name: string;
  description: string;
  color: string;
  image: string;
}

const GamePlay: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  // Data pertanyaan default untuk setiap level
  const questionsData: { [key: number]: Question[] } = {
    1: [
      {
        id: 1,
        conversation: [
          'Gareng: "Bapak, kula lingsem matur kaliyan pak guru enggal"',
          'Semar: "Kok isin? koe ora ndueni salah karo pak guru anyar ta?"',
          'Gareng: "Mboten pak, kula namung ndredeg dereng tepang"'
        ],
        questionLine: 'Semar: "Yen kowe arep ngajeni uwong sek luwih tuwa cukup nganggo basa …….. lan sikap sing sopan"',
        options: ["Ngoko Lugu", "Ngoko Alus", "Krama Lugu", "Krama Alus"],
        correctAnswer: 3,
        explanation: "Krama Alus digunakan untuk menghormati orang yang lebih tua.",
        translation: {
          conversation: [
            'Gareng: "Bapak, saya malu berbicara dengan guru baru"',
            'Semar: "Kenapa malu? kamu tidak punya salah dengan guru baru kan?"',
            'Gareng: "Tidak pak, saya hanya grogi belum kenal"'
          ],
          questionLine: 'Semar: "Jika kamu ingin menghormati orang yang lebih tua cukup menggunakan bahasa …….. dan sikap yang sopan"',
          options: ["Ngoko Lugu", "Ngoko Alus", "Krama Lugu", "Krama Alus"]
        }
      },
      {
        id: 2,
        conversation: [
          'Petruk: "Pak Semar, apa bedanya wayang kulit dengan wayang golek?"',
          'Semar: "Wayang kulit terbuat dari kulit kerbau, wayang golek dari kayu"',
          'Petruk: "Lalu apa nama lain wayang kulit?"'
        ],
        questionLine: 'Semar: "Wayang kulit juga disebut wayang …….."',
        options: ["Wayang golek", "Wayang wong", "Wayang purwa", "Wayang klitik"],
        correctAnswer: 2,
        explanation: "Wayang purwa adalah nama lain dari wayang kulit yang menceritakan kisah-kisah dari Mahabharata dan Ramayana.",
        translation: {
          conversation: [
            'Petruk: "Pak Semar, apa bedanya wayang kulit dengan wayang golek?"',
            'Semar: "Wayang kulit terbuat dari kulit kerbau, wayang golek dari kayu"',
            'Petruk: "Lalu apa nama lain wayang kulit?"'
          ],
          questionLine: 'Semar: "Wayang kulit juga disebut wayang …….."',
          options: ["Wayang golek", "Wayang wong", "Wayang purwa", "Wayang klitik"]
        }
      }
    ],
    2: [
      {
        id: 3,
        conversation: [
          'Pandu: "Anak-anakku, kalian adalah Pandawa Lima yang akan memimpin Hastinapura"',
          'Yudhishthira: "Ayahanda, kami akan menjaga kehormatan keluarga"'
        ],
        questionLine: 'Pandu: "Dalam cerita wayang, siapakah ayah dari Pandawa Lima?"',
        options: ["Pandu", "Dhritarashtra", "Kresna", "Arjuna"],
        correctAnswer: 0,
        explanation: "Pandu adalah raja Hastinapura dan ayah dari Pandawa Lima: Yudhishthira, Bhima, Arjuna, Nakula, dan Sahadewa.",
        translation: {
          conversation: [
            'Pandu: "Anak-anakku, kalian adalah Pandawa Lima yang akan memimpin Hastinapura"',
            'Yudhishthira: "Ayahanda, kami akan menjaga kehormatan keluarga"'
          ],
          questionLine: 'Pandu: "Dalam cerita wayang, siapakah ayah dari Pandawa Lima?"',
          options: ["Pandu", "Dhritarashtra", "Kresna", "Arjuna"]
        }
      },
      {
        id: 4,
        conversation: [
          'Arjuna: "Guru Drona, saya ingin menguasai senjata yang paling sakti"',
          'Drona: "Arjuna, senjata andalanmu adalah..."'
        ],
        questionLine: 'Drona: "Apa nama senjata andalan Arjuna?"',
        options: ["Gada", "Panah Pasopati", "Keris", "Tombak"],
        correctAnswer: 1,
        explanation: "Panah Pasopati adalah senjata andalan Arjuna yang sangat sakti dan tidak pernah meleset.",
        translation: {
          conversation: [
            'Arjuna: "Guru Drona, saya ingin menguasai senjata yang paling sakti"',
            'Drona: "Arjuna, senjata andalanmu adalah..."'
          ],
          questionLine: 'Drona: "Apa nama senjata andalan Arjuna?"',
          options: ["Gada", "Panah Pasopati", "Keris", "Tombak"]
        }
      }
    ],
    3: [
      {
        id: 5,
        conversation: [
          'Murid: "Pak Dalang, siapa dalang paling terkenal di Jawa?"',
          'Dalang Tua: "Ada banyak dalang hebat, seperti..."'
        ],
        questionLine: 'Dalang Tua: "Siapakah dalang terkenal yang dikenal sebagai Ki Dalang?"',
        options: ["Ki Nartosabdo", "Ki Manteb", "Ki Anom Suroto", "Semua benar"],
        correctAnswer: 3,
        explanation: "Semua nama tersebut adalah dalang-dalang terkenal yang berkontribusi besar dalam dunia pewayangan.",
        translation: {
          conversation: [
            'Murid: "Pak Dalang, siapa dalang paling terkenal di Jawa?"',
            'Dalang Tua: "Ada banyak dalang hebat, seperti..."'
          ],
          questionLine: 'Dalang Tua: "Siapakah dalang terkenal yang dikenal sebagai Ki Dalang?"',
          options: ["Ki Nartosabdo", "Ki Manteb", "Ki Anom Suroto", "Semua benar"]
        }
      },
      {
        id: 6,
        conversation: [
          'Penonton: "Pak Dalang, bagian mana yang paling lucu dalam wayang?"',
          'Dalang: "Bagian yang paling menghibur adalah..."'
        ],
        questionLine: 'Dalang: "Apa yang dimaksud dengan \'gara-gara\' dalam pertunjukan wayang?"',
        options: ["Adegan perang", "Adegan punakawan", "Adegan cinta", "Adegan doa"],
        correctAnswer: 1,
        explanation: "Gara-gara adalah bagian pertunjukan wayang yang menampilkan adegan punakawan dengan dialog yang menghibur.",
        translation: {
          conversation: [
            'Penonton: "Pak Dalang, bagian mana yang paling lucu dalam wayang?"',
            'Dalang: "Bagian yang paling menghibur adalah..."'
          ],
          questionLine: 'Dalang: "Apa yang dimaksud dengan \'gara-gara\' dalam pertunjukan wayang?"',
          options: ["Adegan perang", "Adegan punakawan", "Adegan cinta", "Adegan doa"]
        }
      }
    ],
    4: [
      {
        id: 7,
        conversation: [
          'Santri: "Kyai, apa makna filosofis dari tokoh Semar?"',
          'Kyai: "Semar mengajarkan kita tentang..."'
        ],
        questionLine: 'Kyai: "Filosofi apa yang terkandung dalam karakter Semar?"',
        options: ["Kekuatan fisik", "Kebijaksanaan dan kerendahan hati", "Kekayaan", "Kecantikan"],
        correctAnswer: 1,
        explanation: "Semar melambangkan kebijaksanaan, kerendahan hati, dan kedekatan dengan rakyat kecil.",
        translation: {
          conversation: [
            'Santri: "Kyai, apa makna filosofis dari tokoh Semar?"',
            'Kyai: "Semar mengajarkan kita tentang..."'
          ],
          questionLine: 'Kyai: "Filosofi apa yang terkandung dalam karakter Semar?"',
          options: ["Kekuatan fisik", "Kebijaksanaan dan kerendahan hati", "Kekayaan", "Kecantikan"]
        }
      },
      {
        id: 8,
        conversation: [
          'Budayawan: "Wayang bukan hanya hiburan, tetapi juga..."',
          'Peneliti: "Benar, wayang memiliki makna yang sangat dalam"'
        ],
        questionLine: 'Budayawan: "Apa makna simbolis dari wayang kulit?"',
        options: ["Hiburan semata", "Cerminan kehidupan manusia", "Ritual keagamaan", "Semua benar"],
        correctAnswer: 3,
        explanation: "Wayang kulit memiliki makna mendalam sebagai hiburan, cerminan kehidupan, dan sarana spiritual.",
        translation: {
          conversation: [
            'Budayawan: "Wayang bukan hanya hiburan, tetapi juga..."',
            'Peneliti: "Benar, wayang memiliki makna yang sangat dalam"'
          ],
          questionLine: 'Budayawan: "Apa makna simbolis dari wayang kulit?"',
          options: ["Hiburan semata", "Cerminan kehidupan manusia", "Ritual keagamaan", "Semua benar"]
        }
      }
    ]
  };

  const currentQuestions = questionsData[currentLevel] || [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    // Ambil karakter yang dipilih dari localStorage
    const storedCharacter = localStorage.getItem('selectedCharacter');
    if (storedCharacter) {
      setSelectedCharacter(JSON.parse(storedCharacter));
    } else {
      // Jika tidak ada karakter, kembali ke halaman main
      navigate('/main');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 10);
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setIsCorrect(false);
    setShowResult(true);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      // Level selesai
      setLevelCompleted(true);
      setTimeout(() => {
        if (currentLevel < 4) {
          nextLevel();
        } else {
          setGameCompleted(true);
        }
      }, 3000);
    }
  };

  const nextLevel = () => {
    setCurrentLevel(currentLevel + 1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setLevelCompleted(false);
    setTimeLeft(30);
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  const handlePlayAgain = () => {
    setCurrentLevel(1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameCompleted(false);
    setLevelCompleted(false);
    setTimeLeft(30);
  };

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">Memuat permainan...</div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/wyg.webp)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Selamat!</h2>
            <p className="text-lg text-gray-600 mb-4">
              Anda telah menyelesaikan semua level sebagai <strong>{selectedCharacter.name}</strong>!
            </p>
            <div className="bg-yellow-100 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-yellow-600 mr-2" />
                <span className="text-2xl font-bold text-yellow-800">Skor Akhir: {score}</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Main Lagi
              </button>
              <button
                onClick={handleBackToMain}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Pilih Karakter Lain
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (levelCompleted) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/wyg.webp)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="bg-white bg-opacity-95 rounded-xl shadow-2xl p-8 text-center max-w-md w-full mx-4">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Level {currentLevel} Selesai!</h2>
            <p className="text-gray-600 mb-4">
              Bersiap untuk level berikutnya...
            </p>
            <div className="bg-blue-100 rounded-lg p-4">
              <div className="text-lg font-semibold text-blue-800">Skor: {score}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/wyg.webp)' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white bg-opacity-90 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button onClick={handleBackToMain} className="mr-4">
                  <ArrowLeft className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                </button>
                <img src="/wyg.webp" alt="WARISAN" className="h-10 w-10 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">WARISAN - Permainan</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Character & Level Info */}
          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-4xl mr-4">{selectedCharacter.image}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedCharacter.name}</h2>
                  <p className="text-gray-600">{selectedCharacter.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <Crown className="h-5 w-5 text-purple-500 mr-1" />
                  <span className="font-semibold">Level {currentLevel}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Pertanyaan {currentQuestionIndex + 1} dari {currentQuestions.length}
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white bg-opacity-95 rounded-xl shadow-lg p-8">
            {/* Timer */}
            <div className="flex justify-center mb-6">
              <div className={`flex items-center px-4 py-2 rounded-full ${
                timeLeft <= 10 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
               {/* Language Toggle */}
               <div className="flex justify-center mb-4">
                 <button
                   onClick={() => setShowTranslation(!showTranslation)}
                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                 >
                   {showTranslation ? 'Tampilkan Bahasa Jawa' : 'Tampilkan Terjemahan'}
                 </button>
               </div>

               {/* Conversation */}
               {currentQuestion?.conversation && (
                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
                   {(showTranslation && currentQuestion.translation ? 
                     currentQuestion.translation.conversation : 
                     currentQuestion.conversation
                   ).map((line, index) => (
                     <div key={index} className="mb-2 text-gray-700">
                       {line}
                     </div>
                   ))}
                 </div>
               )}
               
               {/* Question Line */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {showTranslation && currentQuestion?.translation ? 
                      currentQuestion.translation.questionLine : 
                      currentQuestion?.questionLine}
                  </h3>
                </div>
             </div>

            {/* Options */}
            <div className="grid gap-4 mb-8">
              {(showTranslation && currentQuestion?.translation ? 
                currentQuestion.translation.options : 
                currentQuestion?.options || []
              ).map((option, index) => {
                let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ";
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    buttonClass += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
                  } else {
                    buttonClass += "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400";
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={buttonClass}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!showResult && (
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    selectedAnswer !== null
                      ? 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  Jawab
                </button>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-lg mb-4 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 mr-2" />
                  ) : (
                    <XCircle className="h-6 w-6 mr-2" />
                  )}
                  <span className="font-bold">
                    {isCorrect ? 'Benar!' : 'Salah!'}
                  </span>
                </div>
                
                {currentQuestion?.explanation && (
                  <div className="bg-blue-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-blue-900 mb-2">Penjelasan:</h4>
                    <p className="text-blue-800">{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;