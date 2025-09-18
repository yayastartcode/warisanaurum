import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  characterId: mongoose.Types.ObjectId;
  question: string;
  questionType: 'multiple_choice' | 'essay';
  options: string[];
  correctAnswer: number;
  correctAnswerText: string;
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
  questionType: {
    type: String,
    required: [true, 'Tipe pertanyaan diperlukan'],
    enum: {
      values: ['multiple_choice', 'essay'],
      message: 'Tipe pertanyaan harus salah satu dari: multiple_choice, essay'
    },
    default: 'multiple_choice'
  },
  options: [{
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Setiap opsi tidak boleh lebih dari 200 karakter']
  }],
  correctAnswer: {
    type: Number,
    required: false,
    min: [0, 'Indeks jawaban benar minimal 0'],
    max: [3, 'Indeks jawaban benar tidak boleh lebih dari 3']
  },
  correctAnswerText: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Jawaban benar tidak boleh lebih dari 1000 karakter']
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

// Validation for different question types
QuestionSchema.pre('save', function(next) {
  const questionType = (this as any)['questionType'];
  
  if (questionType === 'multiple_choice') {
    // Validate multiple choice questions
    if (!(this as any)['options'] || (this as any)['options'].length !== 4) {
      return next(new Error('Multiple choice questions must have exactly 4 options'));
    }
    
    const correctIndex = (this as any)['correctAnswer'];
    if (correctIndex === undefined || correctIndex < 0 || correctIndex >= (this as any)['options'].length) {
      return next(new Error('Multiple choice questions must have a valid correct answer index'));
    }
    
    // Clear correctAnswerText for multiple choice
    (this as any)['correctAnswerText'] = undefined;
  } else if (questionType === 'essay') {
    // Validate essay questions
    if (!(this as any)['correctAnswerText'] || (this as any)['correctAnswerText'].trim() === '') {
      return next(new Error('Essay questions must have a correct answer text'));
    }
    
    // Clear options and correctAnswer for essay
    (this as any)['options'] = [];
    (this as any)['correctAnswer'] = undefined;
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