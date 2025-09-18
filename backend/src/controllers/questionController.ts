import { Request, Response } from 'express';
import { Question, Character, IQuestion } from '../models';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';
import { validateEssayAnswer } from '../utils/textMatching';

// Get questions by character ID
export const getQuestionsByCharacter = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params;
    const {
      difficulty,
      category,
      limit = 10,
      random = false
    } = req.query;

    // Validate character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Karakter tidak ditemukan'
      });
    }

    // Build filter object
    const filter: any = {
      characterId: new mongoose.Types.ObjectId(characterId),
      isActive: true
    };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (category) {
      filter.category = category;
    }

    let questions;
    const limitNum = parseInt(limit as string, 10);

    if (random === 'true') {
      // Get random questions using aggregation
      questions = await Question.aggregate([
        { $match: filter },
        { $sample: { size: limitNum } },
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
        }
      ]);
    } else {
      // Get questions with normal query
      questions = await Question.find(filter)
        .populate('characterId', 'name image category')
        .limit(limitNum)
        .sort({ createdAt: -1 })
        .lean();
    }

    res.json({
      success: true,
      message: 'Pertanyaan berhasil diambil',
      data: {
        questions,
        character: {
          _id: character._id,
          name: character.name,
          category: character.category,
          difficulty: character.difficulty
        },
        count: questions.length
      }
    });
  } catch (error) {
    console.error('Get questions by character error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID karakter tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil pertanyaan'
    });
  }
};

// Get question by ID
export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('characterId', 'name image category difficulty')
      .lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question retrieved successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Get question by ID error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving question'
    });
  }
};

// Get quiz questions for a character (game mode)
export const getQuizQuestions = async (req: Request, res: Response) => {
  try {
    const { characterId } = req.params;
    const {
      count = 5,
      difficulty,
      excludeIds
    } = req.query;

    // Validate character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    // Build filter object
    const filter: any = {
      characterId: new mongoose.Types.ObjectId(characterId),
      isActive: true
    };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    // Exclude specific question IDs if provided
    if (excludeIds) {
      const excludeArray = Array.isArray(excludeIds) ? excludeIds : [excludeIds];
      filter._id = { $nin: excludeArray.map(id => new mongoose.Types.ObjectId(id as string)) };
    }

    const countNum = parseInt(count as string, 10);

    // Get random questions for quiz
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: countNum } },
      {
        $project: {
          _id: 1,
          question: 1,
          questionType: 1,
          options: 1,
          correctAnswer: 1,
          correctAnswerText: 1,
          explanation: 1,
          difficulty: 1,
          points: 1,
          category: 1,
          characterId: 1
        }
      }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this character'
      });
    }

    res.json({
      success: true,
      message: 'Quiz questions retrieved successfully',
      data: {
        questions,
        character: {
          _id: character._id,
          name: character.name,
          category: character.category,
          difficulty: character.difficulty
        },
        count: questions.length
      }
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving quiz questions'
    });
  }
};

// Create new question (admin only)
export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const {
      characterId,
      question,
      options,
      correctAnswer,
      correctAnswerText,
      questionType = 'multiple_choice',
      explanation,
      difficulty,
      category
    } = req.body;

    // Basic validation
    if (!characterId || !question || !explanation) {
      return res.status(400).json({
        success: false,
        message: 'Character ID, question, and explanation are required'
      });
    }

    // Validate based on question type
    if (questionType === 'multiple_choice') {
      if (!options || correctAnswer === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Options and correct answer are required for multiple choice questions'
        });
      }

      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Options must be an array of exactly 4 items'
        });
      }

      if (correctAnswer < 0 || correctAnswer > 3) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer must be between 0 and 3'
        });
      }
    } else if (questionType === 'essay') {
      if (!correctAnswerText) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer text is required for essay questions'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Question type must be either multiple_choice or essay'
      });
    }

    // Validate character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    // Create new question
    const questionData: any = {
      characterId,
      question,
      questionType,
      explanation,
      difficulty: difficulty || 'medium',
      category: category || 'general'
    };

    if (questionType === 'multiple_choice') {
      questionData.options = options;
      questionData.correctAnswer = correctAnswer;
    } else if (questionType === 'essay') {
      questionData.correctAnswerText = correctAnswerText;
    }

    const newQuestion = new Question(questionData);

    await newQuestion.save();

    // Populate character data
    await newQuestion.populate('characterId', 'name category difficulty');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question: newQuestion
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    
    // Handle mongoose validation errors
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while creating question'
    });
  }
};

// Update question (admin only)
export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Get existing question to check type
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    const questionType = updateData.questionType || existingQuestion.questionType;

    // Validate based on question type
    if (questionType === 'multiple_choice') {
      if (updateData.options && (!Array.isArray(updateData.options) || updateData.options.length !== 4)) {
        return res.status(400).json({
          success: false,
          message: 'Options must be an array of exactly 4 items'
        });
      }

      if (updateData.correctAnswer !== undefined && (updateData.correctAnswer < 0 || updateData.correctAnswer > 3)) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer must be between 0 and 3'
        });
      }
    } else if (questionType === 'essay') {
      if (updateData.correctAnswerText !== undefined && !updateData.correctAnswerText.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Correct answer text cannot be empty for essay questions'
        });
      }
    }

    const question = await Question.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('characterId', 'name category difficulty');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Update question error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }
    
    // Handle mongoose validation errors
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating question'
    });
  }
};

// Delete question (admin only)
export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id)
      .populate('characterId', 'name category');

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully',
      data: {
        question
      }
    });
  } catch (error) {
    console.error('Delete question error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting question'
    });
  }
};

// Get question statistics
export const getQuestionStats = async (req: Request, res: Response) => {
  try {
    const stats = await Question.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0]
            }
          },
          byDifficulty: {
            $push: {
              difficulty: '$difficulty',
              isActive: '$isActive'
            }
          },
          byCategory: {
            $push: {
              category: '$category',
              isActive: '$isActive'
            }
          },
          avgPoints: { $avg: '$points' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      byDifficulty: [],
      byCategory: [],
      avgPoints: 0
    };

    // Count by character
    const characterStats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$characterId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'characters',
          localField: '_id',
          foreignField: '_id',
          as: 'character'
        }
      },
      {
        $unwind: '$character'
      },
      {
        $project: {
          _id: 1,
          count: 1,
          characterName: '$character.name',
          characterCategory: '$character.category'
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      message: 'Question statistics retrieved successfully',
      data: {
        stats: {
          ...result,
          characterStats
        }
      }
    });
  } catch (error) {
    console.error('Get question stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving question statistics'
    });
  }
};