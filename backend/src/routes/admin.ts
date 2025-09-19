import { Router } from 'express';
import {
  getUserAnalytics,
  getAdminStats,
  bulkCreateQuestions,
  exportUserAnalytics
} from '../controllers/adminController';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats
} from '../controllers/questionController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Route khusus untuk membuat admin pertama (tanpa autentikasi)
router.post('/setup-first-admin', async (req, res) => {
  try {
    const { User } = await import('../models');
    const { username, email, password } = req.body;

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin sudah ada. Gunakan endpoint /create-admin untuk membuat admin tambahan'
      });
    }

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password diperlukan'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User dengan email atau username tersebut sudah ada'
      });
    }

    // Create first admin user
    const adminUser = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin pertama berhasil dibuat! Silakan login untuk mengakses panel admin',
      data: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat admin user',
      error: error.message
    });
  }
});

// Apply authentication middleware to all other admin routes
router.use(authenticate);
router.use(requireAdmin);

// Admin dashboard statistics
router.get('/stats', getAdminStats);

// User analytics routes
router.get('/users/analytics', getUserAnalytics);
router.get('/users/export', exportUserAnalytics);

// Question management routes
router.post('/questions', createQuestion);
router.post('/questions/bulk', bulkCreateQuestions);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/questions/stats', getQuestionStats);

// Admin user management
router.post('/create-admin', async (req, res) => {
  try {
    const { User } = await import('../models');
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, dan password diperlukan'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User dengan email atau username tersebut sudah ada'
      });
    }

    // Create admin user
    const adminUser = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin user berhasil dibuat',
      data: {
        id: adminUser._id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Gagal membuat admin user',
      error: error.message
    });
  }
});

export default router;