import { Request, Response } from 'express';
import { User, GameSession, Question, Character } from '../models';
import UserProgress from '../models/UserProgress';
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

    // Build search filter for userDetails
      const searchFilter: any = {};
      if (search) {
        searchFilter.$or = [
          { 'userDetails.username': { $regex: search, $options: 'i' } },
          { 'userDetails.email': { $regex: search, $options: 'i' } }
        ];
      }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Get users with analytics data
    const users = await UserProgress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'gamesessions',
          localField: 'userId',
          foreignField: 'userId',
          as: 'gameSessions'
        }
      },
      {
        $addFields: {
          userDetails: { $arrayElemAt: ['$userInfo', 0] },
          totalPlayTime: {
            $divide: [
              {
                $subtract: [
                  '$updatedAt',
                  '$createdAt'
                ]
              },
              60000
            ]
          },
          calculatedTotalScore: {
            $sum: '$gameSessions.score'
          },
          calculatedGamesPlayed: {
            $size: '$gameSessions'
          },
          calculatedHighestScore: {
            $max: '$gameSessions.score'
          },
          lastLogin: {
            $max: '$gameSessions.startedAt'
          },
          completedGames: {
            $size: {
              $filter: {
                input: '$gameSessions',
                cond: { $eq: ['$$this.status', 'completed'] }
              }
            }
          },
          highestScore: {
            $max: {
              $map: {
                input: '$characters',
                as: 'char',
                in: {
                  $max: {
                    $map: {
                      input: '$$char.levels',
                      as: 'level',
                      in: '$$level.bestScore'
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: searchFilter
      },
      {
        $project: {
          _id: '$userDetails._id',
          username: '$userDetails.username',
          email: '$userDetails.email',
          totalScore: '$totalScore',
          gamesPlayed: '$totalGamesPlayed',
          highestScore: 1,
          level: '$currentLevel',
          experience: '$userDetails.experience',
          completedGames: '$totalGamesCompleted',
          totalPlayTime: 1,
          lastLogin: '$lastPlayedAt',
          createdAt: '$userDetails.createdAt',
          updatedAt: '$userDetails.updatedAt'
        }
      },
      { $sort: sortObj },
      { $skip: skip },
      { $limit: limitNum }
    ]);

    // Get total count for pagination
    const totalUsers = await UserProgress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $addFields: {
          userDetails: { $arrayElemAt: ['$userInfo', 0] }
        }
      },
      {
        $match: searchFilter
      },
      {
        $count: 'total'
      }
    ]);
    const totalUsersCount = totalUsers[0]?.total || 0;

    // Calculate summary statistics
    const summaryStats = await UserProgress.aggregate([
      {
        $addFields: {
          highestScore: {
            $max: {
              $map: {
                input: '$characters',
                as: 'char',
                in: {
                  $max: {
                    $map: {
                      input: '$$char.levels',
                      as: 'level',
                      in: '$$level.bestScore'
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalScore: { $sum: '$totalScore' },
          totalGamesPlayed: { $sum: '$totalGamesPlayed' },
          totalGamesCompleted: { $sum: '$totalGamesCompleted' },
          averageScore: { $avg: '$totalScore' },
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
          totalPages: Math.ceil(totalUsersCount / limitNum),
          totalUsers: totalUsersCount,
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

    // Get top players from UserProgress
    const topPlayers = await UserProgress.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $lookup: {
          from: 'gamesessions',
          localField: 'userId',
          foreignField: 'userId',
          as: 'gameSessions'
        }
      },
      {
        $addFields: {
          username: '$userInfo.username',
          gamesPlayed: { $size: '$gameSessions' },
          highestScore: {
            $ifNull: [
              { $max: '$gameSessions.score' },
              0
            ]
          }
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          totalScore: 1,
          highestScore: 1,
          gamesPlayed: 1
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 5 }
    ]);

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

// Export user analytics data as CSV
export const exportUserAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const users = await UserProgress.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $lookup: {
            from: 'gamesessions',
            localField: 'userId',
            foreignField: 'userId',
            as: 'gameSessions'
          }
        },
        {
          $addFields: {
            userDetails: { $arrayElemAt: ['$userInfo', 0] },
            totalPlayTime: {
              $divide: [
                {
                  $subtract: [
                    '$updatedAt',
                    '$createdAt'
                  ]
                },
                60000
              ]
            },
            lastLogin: '$lastPlayedAt',
            highestScore: {
              $max: {
                $map: {
                  input: '$characters',
                  as: 'char',
                  in: {
                    $max: {
                      $map: {
                        input: '$$char.levels',
                        as: 'level',
                        in: '$$level.bestScore'
                      }
                    }
                  }
                }
              }
            }
          }
        },
      {
        $project: {
          _id: '$userDetails._id',
          username: '$userDetails.username',
          email: '$userDetails.email',
          totalScore: '$totalScore',
          gamesPlayed: '$totalGamesPlayed',
          highestScore: 1,
          level: '$currentLevel',
          experience: '$userDetails.experience',
          completedGames: '$totalGamesCompleted',
          totalPlayTime: 1,
          lastLogin: 1,
          createdAt: '$userDetails.createdAt'
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