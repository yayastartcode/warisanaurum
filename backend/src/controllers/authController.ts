import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { User, IUser } from '../models';
import { generateTokens, validateRefreshToken, AuthRequest } from '../middleware/auth';
import { config } from '../config/env';

// Rate limiting for auth endpoints
// Disable rate limiting for development
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 0, // 0 means no limit
  skip: () => true, // Skip all requests
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nama pengguna, email, dan kata sandi wajib diisi'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Kata sandi harus minimal 6 karakter'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'nama pengguna';
      return res.status(409).json({
        success: false,
        message: `Pengguna dengan ${field} ini sudah ada`
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Remove password from response
    const userResponse = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Pengguna berhasil didaftarkan',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        success: false,
        message: 'Error validasi',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat registrasi'
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan kata sandi wajib diisi'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak valid'
      });
    }

    // Check password
    const isPasswordValid = await (user as any)['comparePassword'](password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak valid'
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Remove password from response
    const userResponse = user.toJSON();

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userResponse,
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat login'
    });
  }
};

// Refresh access token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token wajib diisi'
      });
    }

    // Validate refresh token
    const decoded = validateRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token tidak valid atau sudah kedaluwarsa'
      });
    }

    // Get user from database
    const user = await User.findById(decoded['userId']);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: {
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat memperbarui token'
    });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentikasi diperlukan'
      });
    }

    // Get fresh user data from database
    const user = await User.findById((req.user as any)._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Profil berhasil diambil',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat mengambil profil'
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autentikasi diperlukan'
      });
    }

    const { username, profilePicture } = req.body;
    const userId = (req.user as any)._id;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Nama pengguna sudah digunakan'
        });
      }
    }

    // Update user
    const updateData: any = {};
    if (username) updateData.username = username;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        user: updatedUser.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle mongoose validation errors
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(
        (err: any) => err.message
      );
      return res.status(400).json({
        success: false,
        message: 'Error validasi',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat memperbarui profil'
    });
  }
};

// Logout (client-side token removal)
export const logout = async (_req: AuthRequest, res: Response) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the tokens from storage
    res.json({
      success: true,
      message: 'Logout berhasil. Silakan hapus token dari penyimpanan klien.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat logout'
    });
  }
};