import mongoose, { Document, Schema } from 'mongoose';

export interface ILevelProgress {
  level: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore: number;
  completedAt?: Date;
  attempts: number;
}

export interface ICharacterProgress {
  characterId: mongoose.Types.ObjectId;
  characterName: string;
  isSelected: boolean;
  selectedAt?: Date;
  levels: ILevelProgress[];
}

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  currentCharacter?: mongoose.Types.ObjectId;
  currentLevel: number;
  totalScore: number;
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  characters: ICharacterProgress[];
  lastPlayedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LevelProgressSchema: Schema = new Schema({
  level: {
    type: Number,
    required: true,
    min: [1, 'Level minimal 1'],
    max: [4, 'Level maksimal 4']
  },
  isUnlocked: {
    type: Boolean,
    required: true,
    default: false
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false
  },
  bestScore: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Skor terbaik tidak boleh negatif']
  },
  completedAt: {
    type: Date
  },
  attempts: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Jumlah percobaan tidak boleh negatif']
  }
}, { _id: false });

const CharacterProgressSchema: Schema = new Schema({
  characterId: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  characterName: {
    type: String,
    required: true,
    trim: true
  },
  isSelected: {
    type: Boolean,
    required: true,
    default: false
  },
  selectedAt: {
    type: Date
  },
  levels: [LevelProgressSchema]
}, { _id: false });

const UserProgressSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID pengguna diperlukan'],
    unique: true
  },
  currentCharacter: {
    type: Schema.Types.ObjectId,
    ref: 'Character'
  },
  currentLevel: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Level saat ini minimal 1'],
    max: [4, 'Level saat ini maksimal 4']
  },
  totalScore: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total skor tidak boleh negatif']
  },
  totalGamesPlayed: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total permainan dimainkan tidak boleh negatif']
  },
  totalGamesCompleted: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total permainan selesai tidak boleh negatif']
  },
  characters: [CharacterProgressSchema],
  lastPlayedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
UserProgressSchema.index({ userId: 1 });
UserProgressSchema.index({ totalScore: -1 });
UserProgressSchema.index({ lastPlayedAt: -1 });
UserProgressSchema.index({ 'characters.characterId': 1 });

// Methods
UserProgressSchema.methods['unlockLevel'] = function(characterId: mongoose.Types.ObjectId, level: number): void {
  const character = this['characters'].find((char: any) => char.characterId.equals(characterId));
  if (character) {
    const levelProgress = character.levels.find((lvl: any) => lvl.level === level);
    if (levelProgress) {
      levelProgress.isUnlocked = true;
    }
  }
};

UserProgressSchema.methods['completeLevel'] = function(
  characterId: mongoose.Types.ObjectId, 
  level: number, 
  score: number
): void {
  const character = this['characters'].find((char: any) => char.characterId.equals(characterId));
  if (character) {
    const levelProgress = character.levels.find((lvl: any) => lvl.level === level);
    if (levelProgress) {
      levelProgress.isCompleted = true;
      levelProgress.completedAt = new Date();
      levelProgress.attempts += 1;
      
      if (score > levelProgress.bestScore) {
        levelProgress.bestScore = score;
      }
      
      // Unlock next level
      if (level < 4) {
        this['unlockLevel'](characterId, level + 1);
      }
    }
  }
};

UserProgressSchema.methods['selectCharacter'] = function(characterId: mongoose.Types.ObjectId, characterName: string): void {
  // Deselect all characters
  this['characters'].forEach((char: any) => {
    char.isSelected = false;
  });
  
  // Find and select the character
  let character = this['characters'].find((char: any) => char.characterId.equals(characterId));
  
  if (!character) {
    // Create new character progress if not exists
    character = {
      characterId,
      characterName,
      isSelected: true,
      selectedAt: new Date(),
      levels: [
        { level: 1, isUnlocked: true, isCompleted: false, bestScore: 0, attempts: 0 },
        { level: 2, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
        { level: 3, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 },
        { level: 4, isUnlocked: false, isCompleted: false, bestScore: 0, attempts: 0 }
      ]
    };
    this['characters'].push(character);
  } else {
    character.isSelected = true;
    character.selectedAt = new Date();
  }
  
  this['currentCharacter'] = characterId;
};

UserProgressSchema.methods['getCurrentCharacterProgress'] = function(): ICharacterProgress | null {
  return this['characters'].find((char: any) => char.isSelected) || null;
};

UserProgressSchema.methods['getOverallProgress'] = function(): number {
  const totalLevels = this['characters'].length * 4; // 4 levels per character
  const completedLevels = this['characters'].reduce((total: number, char: any) => {
    return total + char.levels.filter((lvl: any) => lvl.isCompleted).length;
  }, 0);
  
  return totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
};

export default mongoose.model<IUserProgress>('UserProgress', UserProgressSchema);