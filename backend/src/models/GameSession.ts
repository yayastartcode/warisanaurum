import mongoose, { Document, Schema } from 'mongoose';

export interface IGameAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer?: number; // for multiple choice
  textAnswer?: string; // for essay questions
  isCorrect: boolean;
  timeSpent: number; // in seconds
  pointsEarned: number;
}

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId;
  characterId: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: IGameAnswer[];
  score: number;
  lives: number;
  timeLimit: number; // in seconds
  timeRemaining: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GameAnswerSchema: Schema = new Schema({
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  selectedAnswer: {
    type: Number,
    required: false,
    min: [0, 'Jawaban yang dipilih minimal 0'],
    max: [3, 'Jawaban yang dipilih tidak boleh lebih dari 3']
  },
  textAnswer: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Jawaban text tidak boleh lebih dari 1000 karakter']
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  timeSpent: {
    type: Number,
    required: true,
    min: [0, 'Waktu yang dihabiskan tidak boleh negatif']
  },
  pointsEarned: {
    type: Number,
    required: true,
    min: [0, 'Poin yang diperoleh tidak boleh negatif']
  }
}, { _id: false });

const GameSessionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID pengguna diperlukan']
  },
  characterId: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: [true, 'ID karakter diperlukan']
  },
  status: {
    type: String,
    required: [true, 'Status permainan diperlukan'],
    enum: {
      values: ['active', 'completed', 'abandoned'],
      message: 'Status harus salah satu dari: active, completed, abandoned'
    },
    default: 'active'
  },
  currentQuestionIndex: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Indeks pertanyaan saat ini tidak boleh negatif']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total pertanyaan diperlukan'],
    min: [1, 'Total pertanyaan minimal 1'],
    max: [20, 'Total pertanyaan tidak boleh lebih dari 20']
  },
  answers: [GameAnswerSchema],
  score: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Skor tidak boleh negatif']
  },
  lives: {
    type: Number,
    required: true,
    default: 3,
    min: [0, 'Nyawa tidak boleh negatif'],
    max: [5, 'Nyawa tidak boleh lebih dari 5']
  },
  timeLimit: {
    type: Number,
    required: true,
    default: 300, // 5 minutes
    min: [60, 'Batas waktu minimal 60 detik']
  },
  timeRemaining: {
    type: Number,
    required: true,
    min: [0, 'Waktu tersisa tidak boleh negatif']
  },
  startedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Set initial time remaining
GameSessionSchema.pre('save', function(next) {
  if (this.isNew && !(this as any)['timeRemaining']) {
    (this as any)['timeRemaining'] = (this as any)['timeLimit'];
  }
  next();
});

// Update completion time when status changes to completed
GameSessionSchema.pre('save', function(next) {
  if (this.isModified('status') && (this as any)['status'] === 'completed' && !(this as any)['completedAt']) {
    (this as any)['completedAt'] = new Date();
  }
  next();
});

// Calculate final score based on answers
GameSessionSchema.methods['calculateFinalScore'] = function(): number {
  const answers = (this as any)['answers'] as IGameAnswer[];
  return answers.reduce((total, answer) => total + answer.pointsEarned, 0);
};

// Check if game is finished
GameSessionSchema.methods['isGameFinished'] = function(): boolean {
  const currentIndex = (this as any)['currentQuestionIndex'];
  const totalQuestions = (this as any)['totalQuestions'];
  const lives = (this as any)['lives'];
  const timeRemaining = (this as any)['timeRemaining'];
  
  return currentIndex >= totalQuestions || lives <= 0 || timeRemaining <= 0;
};

// Get game progress percentage
GameSessionSchema.methods['getProgress'] = function(): number {
  const currentIndex = (this as any)['currentQuestionIndex'];
  const totalQuestions = (this as any)['totalQuestions'];
  
  return Math.round((currentIndex / totalQuestions) * 100);
};

// Index for better query performance
GameSessionSchema.index({ userId: 1 });
GameSessionSchema.index({ characterId: 1 });
GameSessionSchema.index({ status: 1 });
GameSessionSchema.index({ score: -1 });
GameSessionSchema.index({ startedAt: -1 });
GameSessionSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IGameSession>('GameSession', GameSessionSchema);