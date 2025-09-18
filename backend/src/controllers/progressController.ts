import { Response } from 'express';
import { UserProgress, Character } from '../models';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Get user progress
export const getUserProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    let userProgress = await UserProgress.findOne({ userId }).populate('currentCharacter');
    
    if (!userProgress) {
      // Create new progress if not exists
      userProgress = new UserProgress({
        userId,
        currentLevel: 1,
        totalScore: 0,
        totalGamesPlayed: 0,
        totalGamesCompleted: 0,
        characters: [],
        lastPlayedAt: new Date()
      });
      await userProgress.save();
    }

    res.status(200).json({
      success: true,
      data: userProgress
    });
  } catch (error) {
    console.error('Error getting user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil progress user'
    });
  }
};

// Select character
export const selectCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { characterId } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!characterId || !mongoose.Types.ObjectId.isValid(characterId)) {
      return res.status(400).json({
        success: false,
        message: 'Character ID tidak valid'
      });
    }

    // Verify character exists
    const character = await Character.findById(characterId);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Karakter tidak ditemukan'
      });
    }

    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      userProgress = new UserProgress({
        userId,
        currentLevel: 1,
        totalScore: 0,
        totalGamesPlayed: 0,
        totalGamesCompleted: 0,
        characters: [],
        lastPlayedAt: new Date()
      });
    }

    // Select character using the method
    (userProgress as any).selectCharacter(new mongoose.Types.ObjectId(characterId), character.name);
    userProgress.lastPlayedAt = new Date();
    
    await userProgress.save();

    res.status(200).json({
      success: true,
      message: `Karakter ${character.name} berhasil dipilih`,
      data: userProgress
    });
  } catch (error) {
    console.error('Error selecting character:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memilih karakter'
    });
  }
};

// Get character progress
export const getCharacterProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { characterId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!characterId || !mongoose.Types.ObjectId.isValid(characterId)) {
      return res.status(400).json({
        success: false,
        message: 'Character ID tidak valid'
      });
    }

    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress user tidak ditemukan'
      });
    }

    const characterProgress = userProgress.characters.find(
      (char: any) => char.characterId.toString() === characterId
    );

    if (!characterProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress karakter tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: characterProgress
    });
  } catch (error) {
    console.error('Error getting character progress:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil progress karakter'
    });
  }
};

// Update level progress
export const updateLevelProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { characterId, level, score, completed } = req.body;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!characterId || !mongoose.Types.ObjectId.isValid(characterId)) {
      return res.status(400).json({
        success: false,
        message: 'Character ID tidak valid'
      });
    }

    if (!level || level < 1 || level > 4) {
      return res.status(400).json({
        success: false,
        message: 'Level harus antara 1-4'
      });
    }

    if (score === undefined || score < 0) {
      return res.status(400).json({
        success: false,
        message: 'Score tidak valid'
      });
    }

    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        message: 'Progress user tidak ditemukan'
      });
    }

    // Update total stats
    userProgress.totalGamesPlayed += 1;
    userProgress.totalScore += score;
    userProgress.lastPlayedAt = new Date();
    
    if (completed) {
      userProgress.totalGamesCompleted += 1;
      // Complete level using the method
      (userProgress as any).completeLevel(
        new mongoose.Types.ObjectId(characterId), 
        level, 
        score
      );
    }
    
    await userProgress.save();

    res.status(200).json({
      success: true,
      message: 'Progress level berhasil diupdate',
      data: userProgress
    });
  } catch (error) {
    console.error('Error updating level progress:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate progress level'
    });
  }
};

// Get available levels for character
export const getAvailableLevels = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { characterId } = req.params;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!characterId || !mongoose.Types.ObjectId.isValid(characterId)) {
      return res.status(400).json({
        success: false,
        message: 'Character ID tidak valid'
      });
    }

    const userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      return res.status(200).json({
        success: true,
        data: {
          levels: [
            { level: 1, isUnlocked: true, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 2, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 3, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 4, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 }
          ]
        }
      });
    }

    const characterProgress = userProgress.characters.find(
      (char: any) => char.characterId.toString() === characterId
    );

    if (!characterProgress) {
      return res.status(200).json({
        success: true,
        data: {
          levels: [
            { level: 1, isUnlocked: true, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 2, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 3, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
            { level: 4, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 }
          ]
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        levels: characterProgress.levels
      }
    });
  } catch (error) {
    console.error('Error getting available levels:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil level yang tersedia'
    });
  }
};

// Get leaderboard
export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await UserProgress.find({})
      .populate('userId', 'username email')
      .sort({ totalScore: -1 })
      .limit(parseInt(limit as string))
      .select('userId totalScore totalGamesCompleted lastPlayedAt');

    res.status(200).json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil leaderboard'
    });
  }
};