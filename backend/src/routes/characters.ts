import { Router } from 'express';
import {
  getCharacters,
  getCharacterById,
  getRandomCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getCharacterStats
} from '../controllers/characterController';
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
router.get('/', rateLimitModerate, getCharacters);
router.get('/random', rateLimitModerate, getRandomCharacter);
router.get('/stats', rateLimitModerate, getCharacterStats);
router.get('/:id', rateLimitModerate, getCharacterById);

// Protected routes (admin only)
router.post('/', rateLimitStrict, authenticate, authorizeAdmin, createCharacter);
router.put('/:id', rateLimitStrict, authenticate, authorizeAdmin, updateCharacter);
router.delete('/:id', rateLimitStrict, authenticate, authorizeAdmin, deleteCharacter);

export default router;