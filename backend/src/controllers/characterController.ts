import { Request, Response } from 'express';
import { Character, ICharacter } from '../models';
import { AuthRequest } from '../middleware/auth';

// Get all characters with filtering and pagination
export const getCharacters = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      search,
      isActive = true
    } = req.query;

    // Build filter object
    const filter: any = { isActive };
    
    if (category) {
      filter.category = category;
    }
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get characters with pagination
    const characters = await Character.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Character.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Karakter berhasil diambil',
      data: {
        characters,
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
    console.error('Get characters error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil karakter'
    });
  }
};

// Get character by ID
export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const character = await Character.findById(id);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Karakter tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Karakter berhasil diambil',
      data: {
        character
      }
    });
  } catch (error) {
    console.error('Get character by ID error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Format ID karakter tidak valid'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil karakter'
    });
  }
};

// Get random character for wheel spin
export const getRandomCharacter = async (req: Request, res: Response) => {
  try {
    const { difficulty, category } = req.query;

    // Build filter object
    const filter: any = { isActive: true };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (category) {
      filter.category = category;
    }

    // Get random character using aggregation
    const characters = await Character.aggregate([
      { $match: filter },
      { $sample: { size: 1 } }
    ]);

    if (characters.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tidak ada karakter yang sesuai dengan kriteria'
      });
    }

    res.json({
      success: true,
      message: 'Karakter acak berhasil diambil',
      data: {
        character: characters[0]
      }
    });
  } catch (error) {
    console.error('Get random character error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil karakter acak'
    });
  }
};

// Create new character (admin only)
export const createCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      origin,
      category,
      image,
      facts,
      difficulty
    } = req.body;

    // Validation
    if (!name || !description || !origin || !category || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, origin, category, and image are required'
      });
    }

    // Check if character with same name already exists
    const existingCharacter = await Character.findOne({ name });
    if (existingCharacter) {
      return res.status(409).json({
        success: false,
        message: 'Character with this name already exists'
      });
    }

    // Create new character
    const character = new Character({
      name,
      description,
      origin,
      category,
      image,
      facts: facts || [],
      difficulty: difficulty || 'medium'
    });

    await character.save();

    res.status(201).json({
      success: true,
      message: 'Character created successfully',
      data: {
        character
      }
    });
  } catch (error) {
    console.error('Create character error:', error);
    
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
      message: 'Internal server error while creating character'
    });
  }
};

// Update character (admin only)
export const updateCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const character = await Character.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.json({
      success: true,
      message: 'Character updated successfully',
      data: {
        character
      }
    });
  } catch (error) {
    console.error('Update character error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
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
      message: 'Internal server error while updating character'
    });
  }
};

// Delete character (admin only)
export const deleteCharacter = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const character = await Character.findByIdAndDelete(id);
    if (!character) {
      return res.status(404).json({
        success: false,
        message: 'Character not found'
      });
    }

    res.json({
      success: true,
      message: 'Character deleted successfully',
      data: {
        character
      }
    });
  } catch (error) {
    console.error('Delete character error:', error);
    
    // Handle invalid ObjectId
    if ((error as any).name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid character ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting character'
    });
  }
};

// Get character statistics
export const getCharacterStats = async (req: Request, res: Response) => {
  try {
    const stats = await Character.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$isActive', true] }, 1, 0]
            }
          },
          byCategory: {
            $push: {
              category: '$category',
              isActive: '$isActive'
            }
          },
          byDifficulty: {
            $push: {
              difficulty: '$difficulty',
              isActive: '$isActive'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          active: 1,
          categoryStats: {
            $reduce: {
              input: '$byCategory',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $cond: [
                      { $eq: ['$$this.isActive', true] },
                      {
                        $arrayToObject: [[
                          {
                            k: '$$this.category',
                            v: {
                              $add: [
                                { $ifNull: [{ $getField: { field: '$$this.category', input: '$$value' } }, 0] },
                                1
                              ]
                            }
                          }
                        ]]
                      },
                      '$$value'
                    ]
                  }
                ]
              }
            }
          },
          difficultyStats: {
            $reduce: {
              input: '$byDifficulty',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $cond: [
                      { $eq: ['$$this.isActive', true] },
                      {
                        $arrayToObject: [[
                          {
                            k: '$$this.difficulty',
                            v: {
                              $add: [
                                { $ifNull: [{ $getField: { field: '$$this.difficulty', input: '$$value' } }, 0] },
                                1
                              ]
                            }
                          }
                        ]]
                      },
                      '$$value'
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      categoryStats: {},
      difficultyStats: {}
    };

    res.json({
      success: true,
      message: 'Character statistics retrieved successfully',
      data: {
        stats: result
      }
    });
  } catch (error) {
    console.error('Get character stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving character statistics'
    });
  }
};