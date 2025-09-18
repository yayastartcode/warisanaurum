import { Router } from 'express';
import authRoutes from './auth';
import characterRoutes from './characters';
import questionRoutes from './questions';
import gameRoutes from './game';
import progressRoutes from './progress';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Mount character routes
router.use('/characters', characterRoutes);

// Mount question routes
router.use('/questions', questionRoutes);

// Mount game routes
router.use('/game', gameRoutes);

// Mount progress routes
router.use('/progress', progressRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'WARISAN API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found',
    message: `Endpoint ${req.originalUrl} tidak ditemukan`,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

export default router;