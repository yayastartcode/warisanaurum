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
    const { characterId, level, score, completed, timeTaken } = req.body;
    
    // Add detailed logging
    console.log('=== UPDATE LEVEL PROGRESS ===');
    console.log('User ID:', userId);
    console.log('Request body:', req.body);
    console.log('Character ID:', characterId);
    console.log('Level:', level);
    console.log('Score:', score);
    console.log('Completed:', completed);
    console.log('Time Taken:', timeTaken);
    
    if (!userId) {
      console.log('ERROR: User tidak terautentikasi');
      return res.status(401).json({
        success: false,
        message: 'User tidak terautentikasi'
      });
    }

    if (!characterId || !mongoose.Types.ObjectId.isValid(characterId)) {
      console.log('ERROR: Character ID tidak valid:', characterId);
      return res.status(400).json({
        success: false,
        message: 'Character ID tidak valid'
      });
    }

    if (!level || level < 1 || level > 4) {
      console.log('ERROR: Level tidak valid:', level);
      return res.status(400).json({
        success: false,
        message: 'Level harus antara 1-4'
      });
    }

    if (score === undefined || score < 0) {
      console.log('ERROR: Score tidak valid:', score);
      return res.status(400).json({
        success: false,
        message: 'Score tidak valid'
      });
    }

    console.log('Mencari user progress untuk userId:', userId);
    let userProgress = await UserProgress.findOne({ userId });
    
    if (!userProgress) {
      console.log('UserProgress tidak ditemukan, membuat yang baru untuk userId:', userId);
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
      console.log('UserProgress baru berhasil dibuat');
    }

    console.log('User progress ditemukan:', {
      id: userProgress._id,
      totalGamesPlayed: userProgress.totalGamesPlayed,
      totalScore: userProgress.totalScore,
      charactersCount: userProgress.characters.length
    });

    // Pastikan character progress ada
    let characterProgress = userProgress.characters.find(
      (char: any) => char.characterId.toString() === characterId
    );

    if (!characterProgress) {
      console.log('Character progress tidak ditemukan, membuat yang baru untuk characterId:', characterId);
      // Ambil nama karakter
      const character = await Character.findById(characterId);
      if (!character) {
        console.log('ERROR: Character tidak ditemukan untuk characterId:', characterId);
        return res.status(404).json({
          success: false,
          message: 'Karakter tidak ditemukan'
        });
      }

      // Buat character progress baru
      const newCharacterProgress = {
        characterId: new mongoose.Types.ObjectId(characterId),
        characterName: character.name,
        isSelected: true,
        selectedAt: new Date(),
        levels: [
          { level: 1, isUnlocked: true, isCompleted: false, bestScore: 0, attempts: 0 },
          { level: 2, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
          { level: 3, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
          { level: 4, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 }
        ]
      };
      
      userProgress.characters.push(newCharacterProgress);
      userProgress.currentCharacter = new mongoose.Types.ObjectId(characterId);
      console.log('Character progress baru berhasil ditambahkan');
    }

    // Update total stats
    userProgress.totalGamesPlayed += 1;
    userProgress.totalScore += score;
    userProgress.lastPlayedAt = new Date();
    
    if (completed) {
      console.log('Level completed, updating progress...');
      userProgress.totalGamesCompleted += 1;
      // Complete level using the method
      (userProgress as any).completeLevel(
        new mongoose.Types.ObjectId(characterId), 
        level, 
        score
      );
    }
    
    console.log('Menyimpan user progress...');
    await userProgress.save();
    console.log('User progress berhasil disimpan');

    res.status(200).json({
      success: true,
      message: 'Progress level berhasil diupdate',
      data: userProgress
    });
  } catch (error) {
    console.error('=== ERROR UPDATING LEVEL PROGRESS ===');
    console.error('Error details:', error);
    console.error('Error message:', (error as Error).message);
    console.error('Error stack:', (error as Error).stack);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate progress level',
      error: process.env['NODE_ENV'] === 'development' ? (error as Error).message : undefined
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
      .populate('userId', 'username email profilePicture')
      .sort({ totalScore: -1 })
      .limit(parseInt(limit as string))
      .select('userId totalScore totalGamesCompleted lastPlayedAt');

    // Transform data to match frontend expectations
    const transformedLeaderboard = leaderboard.map(entry => ({
      _id: entry._id,
      username: (entry.userId as any)?.username || 'Unknown User',
      totalScore: entry.totalScore,
      totalGamesCompleted: entry.totalGamesCompleted,
      profilePicture: (entry.userId as any)?.profilePicture
    }));

    console.log('Leaderboard data being sent:', transformedLeaderboard);

    res.status(200).json({
      success: true,
      data: transformedLeaderboard
    });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil leaderboard'
    });
  }
};