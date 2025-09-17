import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { database } from './config/database';
import apiRoutes from './routes';

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.PORT;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting - Disabled for development
    const limiter = rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: 0, // Disable rate limiting
      skip: () => true, // Skip all requests
      message: {
        error: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti.',
        retryAfter: Math.ceil(config.RATE_LIMIT_WINDOW_MS / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compression middleware
    this.app.use(compression());

    // Request logging middleware
    this.app.use((req, _res, next) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', async (_req, res) => {
      try {
        const dbHealth = await database.healthCheck();
        res.status(200).json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          database: dbHealth,
          environment: config.NODE_ENV,
        });
      } catch (error) {
        res.status(503).json({
          status: 'Service Unavailable',
          timestamp: new Date().toISOString(),
          error: 'Database connection failed',
        });
      }
    });

    // API routes
    this.app.use('/api', apiRoutes);

    // Root endpoint
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'WARISAN API Server',
        version: '1.0.0',
        description: 'Backend API for WARISAN - Javanese Culture Learning Game',
        endpoints: {
          health: '/health',
          api: '/api',
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Tidak Ditemukan',
        message: `Rute ${req.originalUrl} tidak ditemukan`,
        timestamp: new Date().toISOString(),
      });
    });

    // Global error handler
    this.app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Global error handler:', error);
      
      const status = error.status || error.statusCode || 500;
      const message = error.message || 'Kesalahan Server Internal';
      
      res.status(status).json({
        error: config.NODE_ENV === 'production' ? 'Kesalahan Server Internal' : error.name || 'Error',
        message: config.NODE_ENV === 'production' ? 'Terjadi kesalahan' : message,
        ...(config.NODE_ENV !== 'production' && { stack: error.stack }),
        timestamp: new Date().toISOString(),
      });
    });
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await database.connect();
      
      // Start server
      this.app.listen(this.port, () => {
        console.log(`🚀 WARISAN API Server running on port ${this.port}`);
        console.log(`🌍 Environment: ${config.NODE_ENV}`);
        console.log(`📡 Health check: http://localhost:${this.port}/health`);
        console.log(`🎮 API Base URL: http://localhost:${this.port}/api`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  await database.disconnect();
  process.exit(0);
});

export default Server;