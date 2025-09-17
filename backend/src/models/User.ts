import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  totalScore: number;
  gamesPlayed: number;
  highestScore: number;
  achievements: string[];
  level: number;
  experience: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, 'Username diperlukan'],
    unique: true,
    trim: true,
    minlength: [3, 'Username minimal 3 karakter'],
    maxlength: [20, 'Username tidak boleh lebih dari 20 karakter']
  },
  email: {
    type: String,
    required: [true, 'Email diperlukan'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Silakan berikan email yang valid']
  },
  password: {
    type: String,
    required: [true, 'Password diperlukan'],
    minlength: [6, 'Password minimal 6 karakter']
  },
  profilePicture: {
    type: String,
    default: ''
  },
  totalScore: {
    type: Number,
    default: 0,
    min: [0, 'Total skor tidak boleh negatif']
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    min: [0, 'Jumlah permainan tidak boleh negatif']
  },
  highestScore: {
    type: Number,
    default: 0,
    min: [0, 'Skor tertinggi tidak boleh negatif']
  },
  achievements: [{
    type: String,
    trim: true
  }],
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level minimal 1']
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'Pengalaman tidak boleh negatif']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      delete (ret as any)['password'];
      return ret;
    }
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    (this as any)['password'] = await bcrypt.hash((this as any)['password'], salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, (this as any)['password']);
};

// Calculate level based on experience
UserSchema.virtual('calculatedLevel').get(function() {
  return Math.floor((this as any)['experience'] / 1000) + 1;
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ totalScore: -1 });

export default mongoose.model<IUser>('User', UserSchema);