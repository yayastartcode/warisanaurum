import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
}

// Generate JWT tokens
export const generateTokens = (user: IUser) => {
  const payload: JWTPayload = {
    userId: (user as any)._id.toString(),
    email: user.email,
    username: user.username
  };

  const accessToken = jwt.sign(payload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRES_IN
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET as string, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

// Verify JWT token
export const verifyToken = (token: string, secret: string): JWTPayload | null => {
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    return null;
  }
};

// Authentication middleware
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token akses diperlukan'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyToken(token, config.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token akses tidak valid atau sudah kedaluwarsa'
      });
    }

    // Get user from database
    const user = await User.findById(decoded['userId']).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Kesalahan server internal saat autentikasi'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token, config.JWT_SECRET);

    if (decoded) {
      const user = await User.findById(decoded['userId']).select('-password');
      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without user even if error occurs
  }
};

// Refresh token validation
export const validateRefreshToken = (refreshToken: string): JWTPayload | null => {
  return verifyToken(refreshToken, config.JWT_REFRESH_SECRET);
};

// Check if user owns resource
export const checkOwnership = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.params['userId'] || req.body.userId;
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autentikasi diperlukan'
    });
  }

  if ((req.user as any)._id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Akses ditolak: Anda hanya dapat mengakses sumber daya Anda sendiri'
    });
  }

  next();
};

// Rate limiting for auth endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi, silakan coba lagi nanti'
  },
  standardHeaders: true,
  legacyHeaders: false
};