export { default as User, IUser } from './User';
export { default as Character, ICharacter } from './Character';
export { default as Question, IQuestion } from './Question';
export { default as GameSession, IGameSession, IGameAnswer } from './GameSession';
export { default as UserProgress, IUserProgress, ICharacterProgress, ILevelProgress } from './UserProgress';

// Re-export mongoose types for convenience
export { Document, Schema, Types } from 'mongoose';