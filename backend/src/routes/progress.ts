import { Router } from 'express';
import {
  getUserProgress,
  selectCharacter,
  getCharacterProgress,
  updateLevelProgress,
  getAvailableLevels,
  getLeaderboard
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting middleware
const rateLimitModerate = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// All progress routes require authentication
router.use(authenticate);

// Get user progress
router.get('/', rateLimitModerate, getUserProgress);

// Select character
router.post('/character/select', rateLimitModerate, selectCharacter);

// Get character progress
router.get('/character/:characterId', rateLimitModerate, getCharacterProgress);

// Update level progress
router.post('/level/update', rateLimitModerate, updateLevelProgress);

// Get available levels for character
router.get('/levels/:characterId', rateLimitModerate, getAvailableLevels);

// Get leaderboard
router.get('/leaderboard', rateLimitModerate, getLeaderboard);

export default router;