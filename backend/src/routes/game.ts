import { Router } from 'express';
import {
  spinWheel,
  startGameSession,
  submitAnswer,
  completeGameSession,
  getUserGameSessions,
  getGameSessionDetails,
  getLeaderboard
} from '../controllers/gameController';
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

const rateLimitStrict = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.get('/leaderboard', rateLimitModerate, getLeaderboard);

// Protected routes (require authentication)
router.post('/spin', rateLimitStrict, authenticate, spinWheel);
router.post('/session/start', rateLimitStrict, authenticate, startGameSession);
router.post('/session/answer', rateLimitStrict, authenticate, submitAnswer);
router.post('/session/:sessionId/complete', rateLimitStrict, authenticate, completeGameSession);
router.get('/sessions', rateLimitModerate, authenticate, getUserGameSessions);
router.get('/session/:sessionId', rateLimitModerate, authenticate, getGameSessionDetails);

export default router;