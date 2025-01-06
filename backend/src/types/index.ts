import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    walletAddress: string;
    profileId?: string; // Optional since user might not have created a profile yet
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
