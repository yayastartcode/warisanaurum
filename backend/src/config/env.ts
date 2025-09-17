import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  // Server
  PORT: number;
  NODE_ENV: string;
  
  // Database
  MONGODB_URI: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  
  // CORS
  CORS_ORIGIN: string;
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  
  // Security
  BCRYPT_SALT_ROUNDS: number;
  SESSION_SECRET: string;
  
  // Logging
  LOG_LEVEL: string;
  LOG_FILE: string;
  
  // Game
  WHEEL_SPIN_COOLDOWN: number;
  QUIZ_TIME_LIMIT: number;
  MAX_LIVES: number;
  SCORE_MULTIPLIER: number;
}

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config: Config = {
  // Server
  PORT: parseInt(process.env['PORT'] || '3000', 10),
  NODE_ENV: process.env['NODE_ENV'] || 'development',
  
  // Database
  MONGODB_URI: process.env['MONGODB_URI']!,
  
  // JWT
  JWT_SECRET: process.env['JWT_SECRET']!,
  JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET']!,
  JWT_EXPIRES_IN: process.env['JWT_EXPIRES_IN'] || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',
  
  // CORS
  CORS_ORIGIN: process.env['CORS_ORIGIN'] || 'http://localhost:5173',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
  
  // Security
  BCRYPT_SALT_ROUNDS: parseInt(process.env['BCRYPT_SALT_ROUNDS'] || '12', 10),
  SESSION_SECRET: process.env['SESSION_SECRET'] || 'default-session-secret',
  
  // Logging
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  LOG_FILE: process.env['LOG_FILE'] || 'logs/app.log',
  
  // Game
  WHEEL_SPIN_COOLDOWN: parseInt(process.env['WHEEL_SPIN_COOLDOWN'] || '300000', 10),
  QUIZ_TIME_LIMIT: parseInt(process.env['QUIZ_TIME_LIMIT'] || '30000', 10),
  MAX_LIVES: parseInt(process.env['MAX_LIVES'] || '3', 10),
  SCORE_MULTIPLIER: parseInt(process.env['SCORE_MULTIPLIER'] || '10', 10),
};

export default config;