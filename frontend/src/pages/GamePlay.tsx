import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Star, ArrowLeft, CheckCircle, XCircle, Crown } from 'lucide-react';
import GameComplete from '../components/GameComplete';
import { getQuestionsByCharacterAndLevel } from '../utils/questionsData';
import progressService from '../services/progressService';

interface Question {
  id: number;
  character: string;
  level: number;
  conversation: string[];
  questionLine: string;
  type?: 'multiple_choice' | 'essay';
  options: string[];
  correctAnswer: number;
  correctAnswerText?: string;
  explanation: string;
  hint?: string;
  translation?: {
    conversation: string[];
    questionLine: string;
    options: string[];
    correctAnswerText?: string;
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
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(60);
  // Lives system removed - unlimited attempts
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Load questions from questionsData
  useEffect(() => {
    const loadQuestions = () => {
      try {
        if (selectedCharacter) {
          const characterQuestions = getQuestionsByCharacterAndLevel(selectedCharacter.name, currentLevel);
          setQuestions(characterQuestions);
        } else {
          setQuestions([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions([]);
        setLoading(false);
      }
    };

    if (selectedCharacter) {
      loadQuestions();
    }
  }, [selectedCharacter, currentLevel]);

  // Get current question
  const getCurrentQuestion = () => {
    if (questions.length === 0) return null;
    return questions[currentQuestionIndex] || null;
  };

  const currentQuestion = getCurrentQuestion();

  // Load selected character and level from localStorage
  useEffect(() => {
    const savedCharacter = localStorage.getItem('selectedCharacter');
    const savedLevel = localStorage.getItem('selectedLevel');
    
    if (savedCharacter) {
      setSelectedCharacter(JSON.parse(savedCharacter));
    } else {
      navigate('/main');
      return;
    }
    
    if (savedLevel) {
      try {
        const levelData = JSON.parse(savedLevel);
        setCurrentLevel(levelData.id);
      } catch (error) {
        console.error('Error parsing saved level:', error);
        navigate('/level-selection');
        return;
      }
    } else {
      navigate('/level-selection');
    }
  }, [navigate]);

  // Timer effect
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

  const handleTextAnswerChange = (value: string) => {
    setTextAnswer(value);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    
    // Check if answer is provided based on question type
    if (currentQuestion.type === 'essay' && textAnswer.trim() === '') return;
    if (currentQuestion.type !== 'essay' && selectedAnswer === null) return;

    let correct = false;
    
    if (currentQuestion.type === 'essay') {
      // Simple text matching for essay questions
      const userAnswer = textAnswer.trim().toLowerCase();
      const correctAnswer = (currentQuestion.correctAnswerText || '').trim().toLowerCase();
      correct = userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer);
    } else {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    }
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + 100);
      setCorrectAnswersCount(correctAnswersCount + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const handleTimeUp = () => {
    setShowResult(true);
    setIsCorrect(false);
    
    setTimeout(() => {
      nextQuestion();
    }, 3000);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTextAnswer('');
      setShowResult(false);
      setTimeLeft(60);
    } else {
      // Level completed
      setLevelCompleted(true);
      await saveGameData();
      
      // Check if this was the final level (level 4)
      if (currentLevel >= 4) {
        setGameCompleted(true);
      }
    }
  };

  const nextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel(currentLevel + 1);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setLevelCompleted(false);
      setTimeLeft(60);
    } else {
      // All levels completed
      setGameCompleted(true);
    }
  };

  const handleBackToMain = () => {
    navigate('/main');
  };

  const handleBackToLevelSelection = () => {
    navigate('/level-selection', { state: { selectedCharacter } });
  };

  const saveGameData = async () => {
    try {
      const gameData = {
        character: selectedCharacter?.name,
        level: currentLevel,
        score: score,
        // lives: removed,
        correctAnswers: correctAnswersCount,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem('lastGameData', JSON.stringify(gameData));
      
      // Save progress to backend
      if (selectedCharacter) {
        const isCompleted = correctAnswersCount >= Math.ceil(questions.length * 0.7); // 70% correct to complete
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        
        await progressService.updateLevelProgress({
          characterId: selectedCharacter.id.toString(),
          level: currentLevel,
          score: score,
          completed: isCompleted,
          timeTaken: timeTaken
        });
        
        console.log('Progress saved to backend');
      }
      
      console.log('Game data saved:', gameData);
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const handlePlayAgain = () => {
    setCurrentLevel(1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setTimeLeft(60);
    // setLives(3); // Lives system removed
    setScore(0);
    setShowResult(false);
    setGameCompleted(false);
    setGameOver(false);
    setLevelCompleted(false);
    setCorrectAnswersCount(0);
    setStartTime(Date.now());
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Memuat pertanyaan...</div>
      </div>
    );
  }

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Karakter tidak ditemukan</div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">💀</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h2>
          <p className="text-gray-600 mb-6">Skor akhir: {score}</p>
          <div className="space-y-3">
            <button
              onClick={handlePlayAgain}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Main Lagi
            </button>
            <button
              onClick={handleBackToMain}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameCompleted && selectedCharacter) {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    return (
      <GameComplete
        character={{
          name: selectedCharacter.name,
          image: selectedCharacter.image
        }}
        score={score}
        timeElapsed={timeElapsed}
        totalQuestions={questions.length * currentLevel}
        correctAnswers={correctAnswersCount}
        onPlayAgain={handlePlayAgain}
        onBackToMain={handleBackToMain}
        onBackToLevelSelection={handleBackToLevelSelection}
      />
    );
  }

  if (levelCompleted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Level {currentLevel} Selesai!</h2>
          <p className="text-gray-600 mb-6">Skor: {score}</p>
          <button
            onClick={nextLevel}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Lanjut ke Level {currentLevel + 1}
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Tidak ada pertanyaan tersedia untuk karakter {selectedCharacter.name} level {currentLevel}</div>
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
                <div className="flex items-center space-x-2 mr-4">
                  <button 
                    onClick={handleBackToLevelSelection} 
                    className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
                    title="Kembali ke Pilihan Level"
                  >
                    <ArrowLeft className="h-5 w-5 text-blue-600" />
                  </button>
                  <button 
                    onClick={handleBackToMain} 
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Pilih Karakter Lain"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <img src="/wyg.jpg" alt="WARISAN" className="h-10 w-10 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">WARISAN - Permainan</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Lives display removed */}
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Character Info */}
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
                  Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
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

            {/* Question Content */}
            <div className="mb-8">
              {/* Translation Toggle and Hint Button */}
              <div className="flex justify-center items-center gap-4 mb-4">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showTranslation ? 'Tampilkan Bahasa Jawa' : 'Tampilkan Terjemahan'}
                </button>
                
                {/* Hint Button - only show for question 3 in each level */}
                {(currentQuestion.id === 103 || currentQuestion.id === 203 || currentQuestion.id === 301) && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    💡 {showHint ? 'Sembunyikan Hint' : 'Tampilkan Hint'}
                  </button>
                )}
              </div>
              
              {/* Hint Display */}
              {showHint && currentQuestion.hint && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 text-lg">💡</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Bantuan:</h4>
                      <p className="text-yellow-700">{currentQuestion.hint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Conversation */}
              {(showTranslation ? currentQuestion.translation?.conversation : currentQuestion.conversation) && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  {(showTranslation ? currentQuestion.translation?.conversation : currentQuestion.conversation)?.map((line, index) => (
                    <div key={index} className="mb-2 text-gray-700">
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Question */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {showTranslation ? currentQuestion.translation?.questionLine : currentQuestion.questionLine}
                </h3>
              </div>
            </div>

            {/* Answer Options */}
            {currentQuestion.type === 'essay' ? (
              <div className="mb-8">
                <textarea
                  value={textAnswer}
                  onChange={(e) => handleTextAnswerChange(e.target.value)}
                  placeholder="Tulis jawaban Anda di sini..."
                  disabled={showResult}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none h-32"
                />
                {showResult && currentQuestion.correctAnswerText && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Jawaban yang benar:</h4>
                    <p className="text-green-700">{currentQuestion.correctAnswerText}</p>
                  </div>
                )}
              </div>
            ) : currentQuestion.options && (
              <div className="grid gap-4 mb-8">
                {(showTranslation ? currentQuestion.translation?.options : currentQuestion.options)?.map((option, index) => {
                  let buttonClass = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ';
                  
                  if (showResult) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass += 'bg-green-100 border-green-500 text-green-800';
                    } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                      buttonClass += 'bg-red-100 border-red-500 text-red-800';
                    } else {
                      buttonClass += 'bg-gray-100 border-gray-300 text-gray-600';
                    }
                  } else {
                    if (selectedAnswer === index) {
                      buttonClass += 'bg-blue-100 border-blue-500 text-blue-800 transform scale-105';
                    } else {
                      buttonClass += 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400';
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Submit Button */}
            {!showResult && (
              <div className="text-center">
                <button
                  onClick={handleSubmitAnswer}
                  disabled={currentQuestion.type === 'essay' ? textAnswer.trim() === '' : selectedAnswer === null}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
                    (currentQuestion.type === 'essay' ? textAnswer.trim() !== '' : selectedAnswer !== null)
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

                {currentQuestion.explanation && (
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