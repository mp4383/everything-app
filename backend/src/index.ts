import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import type { AddressInfo } from 'net';
import { AppError } from './types';
import authRoutes from './routes/auth';
import socialRoutes from './routes/social';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' 
    ? process.env['FRONTEND_URL'] 
    : 'http://localhost:5173', // Vite's default port
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/social', socialRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// 404 handler
app.use((_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource does not exist',
    },
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON payload',
        details: process.env['NODE_ENV'] !== 'production' ? err.message : undefined,
      },
    });
  } else {
    next(err);
  }
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Unhandled error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.name,
        message: err.message,
        details: err.details,
      },
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env['NODE_ENV'] === 'production' 
          ? 'An unexpected error occurred' 
          : err.message,
      },
    });
  }
});

// Only start the server if this file is run directly
if (require.main === module) {
  const port = process.env['PORT'] || 3000;
  const server = app.listen(port, () => {
    const address = server.address() as AddressInfo;
    console.log(`Server running on port ${address.port} in ${process.env['NODE_ENV'] || 'development'} mode`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

export default app;
