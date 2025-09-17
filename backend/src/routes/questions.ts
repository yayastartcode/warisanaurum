import { Router } from 'express';
import {
  getQuestionsByCharacter,
  getQuestionById,
  getQuizQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats
} from '../controllers/questionController';
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
  max: 10, // 10 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Admin authorization middleware
const authorizeAdmin = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

// Public routes (with rate limiting)
router.get('/character/:characterId', rateLimitModerate, getQuestionsByCharacter);
router.get('/character/:characterId/quiz', rateLimitModerate, getQuizQuestions);
router.get('/stats', rateLimitModerate, getQuestionStats);
router.get('/:id', rateLimitModerate, getQuestionById);

// Protected routes (admin only)
router.post('/', rateLimitStrict, authenticate, authorizeAdmin, createQuestion);
router.put('/:id', rateLimitStrict, authenticate, authorizeAdmin, updateQuestion);
router.delete('/:id', rateLimitStrict, authenticate, authorizeAdmin, deleteQuestion);

export default router;