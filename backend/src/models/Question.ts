import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  characterId: mongoose.Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  category: 'origin' | 'history' | 'culture' | 'facts' | 'general';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  characterId: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: [true, 'ID karakter diperlukan']
  },
  question: {
    type: String,
    required: [true, 'Teks pertanyaan diperlukan'],
    trim: true,
    maxlength: [500, 'Pertanyaan tidak boleh lebih dari 500 karakter']
  },
  options: [{
    type: String,
    required: true,
    trim: true,
    maxlength: [200, 'Setiap opsi tidak boleh lebih dari 200 karakter']
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Indeks jawaban benar diperlukan'],
    min: [0, 'Indeks jawaban benar minimal 0'],
    max: [3, 'Indeks jawaban benar tidak boleh lebih dari 3']
  },
  explanation: {
    type: String,
    required: [true, 'Penjelasan diperlukan'],
    trim: true,
    maxlength: [1000, 'Penjelasan tidak boleh lebih dari 1000 karakter']
  },
  difficulty: {
    type: String,
    required: [true, 'Tingkat kesulitan diperlukan'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Tingkat kesulitan harus salah satu dari: easy, medium, hard'
    },
    default: 'medium'
  },
  points: {
    type: Number,
    required: [true, 'Nilai poin diperlukan'],
    min: [1, 'Poin minimal 1'],
    max: [1000, 'Poin tidak boleh lebih dari 1000']
  },
  category: {
    type: String,
    required: [true, 'Kategori pertanyaan diperlukan'],
    enum: {
      values: ['origin', 'history', 'culture', 'facts', 'general'],
      message: 'Kategori harus salah satu dari: origin, history, culture, facts, general'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validation for options array
QuestionSchema.pre('save', function(next) {
  if ((this as any)['options'].length !== 4) {
    return next(new Error('Question must have exactly 4 options'));
  }
  
  const correctIndex = (this as any)['correctAnswer'];
  if (correctIndex < 0 || correctIndex >= (this as any)['options'].length) {
    return next(new Error('Correct answer index is out of range'));
  }
  
  next();
});

// Set points based on difficulty
QuestionSchema.pre('save', function(next) {
  if (!this.isModified('difficulty') && !this.isNew) return next();
  
  const difficulty = (this as any)['difficulty'];
  switch (difficulty) {
    case 'easy':
      (this as any)['points'] = 10;
      break;
    case 'medium':
      (this as any)['points'] = 20;
      break;
    case 'hard':
      (this as any)['points'] = 30;
      break;
    default:
      (this as any)['points'] = 20;
  }
  
  next();
});

// Index for better query performance
QuestionSchema.index({ characterId: 1 });
QuestionSchema.index({ difficulty: 1 });
QuestionSchema.index({ category: 1 });
QuestionSchema.index({ isActive: 1 });
QuestionSchema.index({ points: -1 });

export default mongoose.model<IQuestion>('Question', QuestionSchema);