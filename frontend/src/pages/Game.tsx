import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Clock, Star, ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { GameSession, Question, Character, SubmitAnswerResponse } from '../types';

const Game: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { } = useAuth();
  
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchGameSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, gameOver]);

  const fetchGameSession = async () => {
    try {
      const response = await apiService.getGameSessionDetails(sessionId!);
      const session = response.data.data;
      if (session) {
        setGameSession(session);
        // Fetch character details
        const charResponse = await apiService.getCharacterById(session.characterId);
        setCharacter(charResponse.data.data || null);
      }
      
      if (session?.status === 'completed') {
        setGameOver(true);
      } else {
        await fetchCurrentQuestion();
      }
    } catch (error) {
      console.error('Failed to fetch game session:', error);
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentQuestion = async () => {
    try {
      // Get questions for the character and use current index
      if (gameSession) {
        const response = await apiService.getQuizQuestions(gameSession.characterId, gameSession.totalQuestions);
        const questions = response.data.data;
        if (questions && gameSession.currentQuestionIndex < questions.length) {
          setCurrentQuestion(questions[gameSession.currentQuestionIndex]);
        }
      }
      setTimeLeft(30); // Reset timer for new question
      setSelectedAnswer(null);
      setTextAnswer('');
      setShowResult(false);
    } catch (error) {
      console.error('Failed to fetch current question:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult && !isSubmitting) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleTextAnswerChange = (value: string) => {
    if (!showResult && !isSubmitting) {
      setTextAnswer(value);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || isSubmitting) return;
    
    // Check if answer is provided based on question type
    if (currentQuestion.questionType === 'multiple_choice' && selectedAnswer === null) return;
    if (currentQuestion.questionType === 'essay' && textAnswer.trim() === '') return;
    
    setIsSubmitting(true);
    
    try {
      const submitData: any = {
        sessionId: sessionId!,
        questionId: currentQuestion._id || '',
        timeSpent: 30 - timeLeft
      };
      
      if (currentQuestion.questionType === 'multiple_choice') {
        submitData.selectedAnswer = selectedAnswer;
      } else {
        submitData.textAnswer = textAnswer;
      }
      
      const response = await apiService.submitAnswer(submitData);
       
       const result = response.data?.data as unknown as SubmitAnswerResponse;
       if (result && currentQuestion) {
          setIsCorrect(result.isCorrect);
          setShowResult(true);
        
        // Update game session with new data
        if (gameSession) {
          setGameSession({
            ...gameSession,
            score: result.score || gameSession.score,
            currentQuestionIndex: result.currentQuestionIndex || gameSession.currentQuestionIndex,
            answers: result.answers || gameSession.answers
          });
          
          // Check if game is complete
          if (result.isGameComplete) {
            setTimeout(() => {
              setGameOver(true);
            }, 2000);
          } else {
            // Move to next question after showing result
            setTimeout(() => {
              setShowResult(false);
              setSelectedAnswer(null);
              setTextAnswer('');
              setTimeLeft(30);
              fetchCurrentQuestion();
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    if (isSubmitting || showResult) return;
    
    // Auto-submit with no answer selected
    setSelectedAnswer(-1); // -1 indicates no answer
    await handleSubmitAnswer();
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">Memuat permainan...</div>
      </div>
    );
  }

  if (gameOver || !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Permainan Selesai!</h2>
            <p className="text-gray-600">Karakter: {character?.name}</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Skor Akhir:</span>
              <span className="font-bold text-lg">{gameSession?.score || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pertanyaan Dijawab:</span>
              <span className="font-bold">{gameSession?.currentQuestionIndex || 0}/{gameSession?.totalQuestions || 0}</span>
            </div>

          </div>
          
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-white text-xl">Memuat pertanyaan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Dashboard
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-gray-700">
              <Clock className="w-5 h-5 mr-2" />
              <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
                {timeLeft}s
              </span>
            </div>
            

            
            <div className="flex items-center text-gray-700">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              <span className="font-bold">{gameSession.score}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-4xl mx-auto">
        {/* Character Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{character?.name}</h2>
              <p className="text-gray-600">{character?.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Pertanyaan</p>
              <p className="text-lg font-bold">
                {gameSession.currentQuestionIndex + 1} / {gameSession.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h3>
          
          {currentQuestion.questionType === 'multiple_choice' ? (
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => {
                let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    buttonClass += "border-green-500 bg-green-50 text-green-800";
                  } else if (index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                    buttonClass += "border-red-500 bg-red-50 text-red-800";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else {
                  if (selectedAnswer === index) {
                    buttonClass += "border-purple-500 bg-purple-50 text-purple-800";
                  } else {
                    buttonClass += "border-gray-200 hover:border-purple-300 hover:bg-purple-50";
                  }
                }
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult || isSubmitting}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQuestion.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Ketik jawaban Anda di bawah ini:
              </div>
              <textarea
                value={textAnswer}
                onChange={(e) => handleTextAnswerChange(e.target.value)}
                disabled={showResult || isSubmitting}
                placeholder="Masukkan jawaban Anda..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none h-32 disabled:bg-gray-50 disabled:text-gray-500"
              />
              {showResult && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-semibold text-blue-800 mb-2">Jawaban yang benar:</div>
                  <div className="text-blue-700">{currentQuestion.correctAnswerText}</div>
                  {textAnswer && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold text-blue-800 mb-1">Jawaban Anda:</div>
                      <div className="text-blue-700">{textAnswer}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        {!showResult && (
          <div className="text-center">
            <button
              onClick={handleSubmitAnswer}
              disabled={
                (currentQuestion.questionType === 'multiple_choice' && selectedAnswer === null) ||
                (currentQuestion.questionType === 'essay' && textAnswer.trim() === '') ||
                isSubmitting
              }
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
            </button>
          </div>
        )}

        {/* Result Display */}
        {showResult && (
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-bold ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Benar! +{currentQuestion.points} poin
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 mr-2" />
                  Salah! -1 nyawa
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;