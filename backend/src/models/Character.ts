import mongoose, { Document, Schema } from 'mongoose';

export interface ICharacter extends Document {
  name: string;
  description: string;
  origin: string;
  category: 'historical' | 'mythological' | 'cultural' | 'modern';
  image: string;
  facts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama karakter diperlukan'],
    trim: true,
    maxlength: [100, 'Nama karakter tidak boleh lebih dari 100 karakter']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi karakter diperlukan'],
    trim: true,
    maxlength: [1000, 'Deskripsi tidak boleh lebih dari 1000 karakter']
  },
  origin: {
    type: String,
    required: [true, 'Asal karakter diperlukan'],
    trim: true,
    maxlength: [100, 'Asal tidak boleh lebih dari 100 karakter']
  },
  category: {
    type: String,
    required: [true, 'Kategori karakter diperlukan'],
    enum: {
      values: ['historical', 'mythological', 'cultural', 'modern'],
      message: 'Kategori harus salah satu dari: historical, mythological, cultural, modern'
    }
  },
  image: {
    type: String,
    required: [true, 'Gambar karakter diperlukan'],
    trim: true
  },
  facts: [{
    type: String,
    trim: true,
    maxlength: [500, 'Setiap fakta tidak boleh lebih dari 500 karakter']
  }],
  difficulty: {
    type: String,
    required: [true, 'Tingkat kesulitan diperlukan'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Tingkat kesulitan harus salah satu dari: easy, medium, hard'
    },
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
CharacterSchema.index({ category: 1 });
CharacterSchema.index({ difficulty: 1 });
CharacterSchema.index({ isActive: 1 });
CharacterSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ICharacter>('Character', CharacterSchema);