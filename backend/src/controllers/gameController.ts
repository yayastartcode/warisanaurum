import { Request, Response } from 'express';
import { GameSession, Character, Question, User, IGameSession } from '../models';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Spin the wheel to get a random character
export const spinWheel = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { difficulty } = req.query;

    // Build filter for characters
    const filter: any = { isActive: true };
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Get random character using aggregation
    const characters = await Character.aggregate([
      { $match: filter },
      { $sample: { size: 1 } }
    ]);

    if (characters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada karakter yang ditemukan untuk putaran roda'
      });
    }

    const character = characters[0];

    // Update user's last spin time
    await User.findByIdAndUpdate(userId, {
      lastSpinAt: new Date()
    });

    res.json({
      success: true,
      message: 'Roda berhasil diputar',
      data: {
        character: {
          _id: character._id,
          name: character.name,
          description: character.description,
          image: character.image,
          category: character.category,
          difficulty: character.difficulty,
          origin: character.origin
        }
      }
    });
  } catch (error) {
    console.error('Spin wheel error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat memutar roda'
    });
  }
};

// Start a new game session
export const startGameSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { characterId } = req.body;

    if (!characterId) {
      return res.status(400).json({
        success: false,
        message: 'ID karakter wajib diisi'
      });
    }

    // Validate character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Karakter tidak ditemukan'
      });
    }

    // Check if user has an active session for this character
    const existingSession = await GameSession.findOne({
      userId,
      characterId,
      status: 'active'
    });

    if (existingSession) {
      return res.json({
        success: true,
        message: 'Sesi permainan aktif ditemukan',
        data: {
          session: existingSession
        }
      });
    }

    // Create new game session
    const gameSession = new GameSession({
      userId,
      characterId,
      status: 'active',
      startedAt: new Date()
    });

    await gameSession.save();
    await gameSession.populate('characterId', 'name image category difficulty');

    res.status(201).json({
      success: true,
      message: 'Sesi permainan berhasil dimulai',
      data: {
        session: gameSession
      }
    });
  } catch (error) {
    console.error('Start game session error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID karakter tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat memulai sesi permainan'
    });
  }
};

// Submit quiz answer
export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { sessionId, questionId, selectedAnswer, timeSpent } = req.body;

    // Validation
    if (!sessionId || !questionId || selectedAnswer === undefined) {
      return res.status(400).json({
        success: false,
        message: 'ID sesi, ID pertanyaan, dan jawaban yang dipilih wajib diisi'
      });
    }

    // Find active game session
    const session = await GameSession.findOne({
      _id: sessionId,
      userId,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesi permainan aktif tidak ditemukan'
      });
    }

    // Find question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Pertanyaan tidak ditemukan'
      });
    }

    // Check if question belongs to session character
    if (question.characterId.toString() !== session.characterId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Pertanyaan tidak sesuai dengan karakter sesi'
      });
    }

    // Check if question already answered
    const existingAnswer = session.answers.find(
      answer => answer.questionId.toString() === questionId
    );

    if (existingAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Pertanyaan sudah dijawab dalam sesi ini'
      });
    }

    // Calculate if answer is correct
    const isCorrect = selectedAnswer === question.correctAnswer;
    const pointsEarned = isCorrect ? question.points : 0;

    // Add answer to session
    session.answers.push({
      questionId: new mongoose.Types.ObjectId(questionId),
      selectedAnswer,
      isCorrect,
      pointsEarned,
      timeSpent: timeSpent || 0
    });

    // Update session score and progress
    session.score += pointsEarned;
    session.currentQuestionIndex = session.answers.length;

    await session.save();

    res.json({
      success: true,
      message: 'Jawaban berhasil dikirim',
      data: {
        isCorrect,
        pointsEarned,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        session: {
          _id: session._id,
          score: session.score,
          currentQuestionIndex: session.currentQuestionIndex,
          totalQuestions: session.totalQuestions,
          progress: Math.round((session.currentQuestionIndex / session.totalQuestions) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengirim jawaban'
    });
  }
};

// Complete game session
export const completeGameSession = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { sessionId } = req.params;

    // Find active game session
    const session = await GameSession.findOne({
      _id: sessionId,
      userId,
      status: 'active'
    }).populate('characterId', 'name category difficulty');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesi permainan aktif tidak ditemukan'
      });
    }

    // Update session status
    session.status = 'completed';
    session.completedAt = new Date();
    
    // Calculate final score and experience
    const experienceGained = Math.floor(session.score * 0.1); // 10% of score as XP
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    
    await session.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      user.totalScore += session.score;
      user.experience += experienceGained;
      user.gamesPlayed += 1;
      
      // Update highest score if current score is higher
      if (session.score > user.highestScore) {
        user.highestScore = session.score;
      }
      
      await user.save();
    }

    res.json({
      success: true,
      message: 'Sesi permainan berhasil diselesaikan',
      data: {
        session: {
          _id: session._id,
          score: session.score,
          currentQuestionIndex: session.currentQuestionIndex,
          totalQuestions: session.totalQuestions,
          correctAnswers,
          progress: Math.round((session.currentQuestionIndex / session.totalQuestions) * 100),
          experienceGained,
          character: session.characterId,
          completedAt: session.completedAt
        },
        userStats: {
          totalScore: user?.totalScore || 0,
          experience: user?.experience || 0,
          level: user?.level || 1,
          gamesPlayed: user?.gamesPlayed || 0,
          highestScore: user?.highestScore || 0
        }
      }
    });
  } catch (error) {
    console.error('Complete game session error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID sesi tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat menyelesaikan sesi permainan'
    });
  }
};

// Get user's game sessions
export const getUserGameSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const {
      status,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get sessions with pagination
    const sessions = await GameSession.find(filter)
      .populate('characterId', 'name image category difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count
    const total = await GameSession.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Sesi permainan berhasil diambil',
      data: {
        sessions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user game sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil sesi permainan'
    });
  }
};

// Get game session details
export const getGameSessionDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const { sessionId } = req.params;

    const session = await GameSession.findOne({
      _id: sessionId,
      userId
    })
      .populate('characterId', 'name image category difficulty')
      .populate('answers.questionId', 'question options correctAnswer explanation points')
      .lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesi permainan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Detail sesi permainan berhasil diambil',
      data: {
        session
      }
    });
  } catch (error) {
    console.error('Get game session details error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID sesi tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil detail sesi permainan'
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const {
      period = 'all', // all, week, month
      limit = 10
    } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { updatedAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { updatedAt: { $gte: monthAgo } };
    }

    const limitNum = parseInt(limit as string, 10);

    // Get top users by total score
    const leaderboard = await User.find(dateFilter)
      .select('username totalScore totalExperience level gamesPlayed perfectGames')
      .sort({ totalScore: -1, totalExperience: -1 })
      .limit(limitNum)
      .lean();

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    res.json({
      success: true,
      message: 'Papan peringkat berhasil diambil',
      data: {
        leaderboard: rankedLeaderboard,
        period,
        count: rankedLeaderboard.length
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil papan peringkat'
    });
  }
};