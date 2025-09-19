import { Request, Response } from 'express';
import { User, GameSession, Question, Character } from '../models';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Get user analytics for admin dashboard
export const getUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'totalScore',
      sortOrder = 'desc',
      search = ''
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build search filter
    const searchFilter: any = {};
    if (search) {
      searchFilter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Get users with analytics data
    const users = await User.aggregate([
      { $match: searchFilter },
      {
        $lookup: {
          from: 'gamesessions',
          localField: '_id',
          foreignField: 'userId',
          as: 'gameSessions'
        }
      },
      {
        $addFields: {
          totalPlayTime: {
            $sum: {
              $map: {
                input: '$gameSessions',
                as: 'session',
                in: {
                  $subtract: [
                    { $ifNull: ['$$session.completedAt', '$$session.updatedAt'] },
                    '$$session.startedAt'
                  ]
                }
              }
            }
          },
          lastGameSession: {
            $max: '$gameSessions.startedAt'
          },
          completedGames: {
            $size: {
              $filter: {
                input: '$gameSessions',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          }
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          totalScore: 1,
          gamesPlayed: 1,
          highestScore: 1,
          level: 1,
          experience: 1,
          totalPlayTime: 1,
          lastLogin: '$lastGameSession',
          completedGames: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limitNum }
    ]);

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchFilter);

    // Calculate summary statistics
    const summaryStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          averageScore: { $avg: '$totalScore' },
          totalGamesPlayed: { $sum: '$gamesPlayed' },
          highestScore: { $max: '$highestScore' }
        }
      }
    ]);

    const summary = summaryStats[0] || {
      totalUsers: 0,
      averageScore: 0,
      totalGamesPlayed: 0,
      highestScore: 0
    };

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalUsers / limitNum),
          totalUsers,
          limit: limitNum
        },
        summary
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user analytics'
    });
  }
};

// Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    // Get basic counts
    const [userCount, questionCount, characterCount, gameSessionCount] = await Promise.all([
      User.countDocuments(),
      Question.countDocuments({ isActive: true }),
      Character.countDocuments(),
      GameSession.countDocuments()
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await GameSession.aggregate([
      {
        $match: {
          startedAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$startedAt'
            }
          },
          gamesPlayed: { $sum: 1 },
          totalScore: { $sum: '$score' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get top players
    const topPlayers = await User.find()
      .select('username totalScore highestScore gamesPlayed')
      .sort({ totalScore: -1 })
      .limit(5);

    // Get question statistics by character
    const questionStats = await Question.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: 'characters',
          localField: 'characterId',
          foreignField: '_id',
          as: 'character'
        }
      },
      {
        $unwind: '$character'
      },
      {
        $group: {
          _id: '$character.name',
          questionCount: { $sum: 1 },
          averagePoints: { $avg: '$points' }
        }
      },
      { $sort: { questionCount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: userCount,
          totalQuestions: questionCount,
          totalCharacters: characterCount,
          totalGameSessions: gameSessionCount
        },
        recentActivity,
        topPlayers,
        questionStats
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching admin statistics'
    });
  }
};

// Bulk create questions from admin panel
export const bulkCreateQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Questions array is required and cannot be empty'
      });
    }

    const createdQuestions = [];
    const errors = [];

    for (let i = 0; i < questions.length; i++) {
      try {
        const questionData = questions[i];
        
        // Validate required fields
        if (!questionData.characterId || !questionData.question || !questionData.explanation) {
          errors.push({
            index: i,
            message: 'Character ID, question, and explanation are required'
          });
          continue;
        }

        // Validate character exists
        const character = await Character.findById(questionData.characterId);
        if (!character) {
          errors.push({
            index: i,
            message: 'Character not found'
          });
          continue;
        }

        // Create question
        const newQuestion = new Question({
          ...questionData,
          difficulty: questionData.difficulty || 'medium',
          category: questionData.category || 'general',
          questionType: questionData.questionType || 'multiple_choice'
        });

        await newQuestion.save();
        await newQuestion.populate('characterId', 'name category difficulty');
        
        createdQuestions.push(newQuestion);
      } catch (error: any) {
        errors.push({
          index: i,
          message: error.message || 'Failed to create question'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdQuestions.length} questions`,
      data: {
        created: createdQuestions,
        errors
      }
    });
  } catch (error) {
    console.error('Bulk create questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating questions'
    });
  }
};

// Export user analytics data as CSV
export const exportUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'gamesessions',
          localField: '_id',
          foreignField: 'userId',
          as: 'gameSessions'
        }
      },
      {
        $addFields: {
          totalPlayTime: {
            $sum: {
              $map: {
                input: '$gameSessions',
                as: 'session',
                in: {
                  $subtract: [
                    { $ifNull: ['$$session.completedAt', '$$session.updatedAt'] },
                    '$$session.startedAt'
                  ]
                }
              }
            }
          },
          lastGameSession: {
            $max: '$gameSessions.startedAt'
          }
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          totalScore: 1,
          gamesPlayed: 1,
          highestScore: 1,
          level: 1,
          experience: 1,
          totalPlayTime: 1,
          lastLogin: '$lastGameSession',
          createdAt: 1
        }
      },
      { $sort: { totalScore: -1 } }
    ]);

    // Convert to CSV format
    const csvHeader = 'Username,Email,Total Score,Games Played,Highest Score,Level,Experience,Total Play Time (ms),Last Login,Created At\n';
    const csvData = users.map(user => {
      return [
        user.username,
        user.email,
        user.totalScore,
        user.gamesPlayed,
        user.highestScore,
        user.level,
        user.experience,
        user.totalPlayTime || 0,
        user.lastLogin ? new Date(user.lastLogin).toISOString() : '',
        new Date(user.createdAt).toISOString()
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=user-analytics.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while exporting user analytics'
    });
  }
};