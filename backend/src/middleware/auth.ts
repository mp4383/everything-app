import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, AppError } from '../types';
import { verifySignature, validateNonce } from '../utils/auth';
import prisma from '../services/prisma';

export const authenticate = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const walletAddress = req.headers['x-wallet-address'];
    const signature = req.headers['x-signature'];
    const message = req.headers['x-message'];

    if (!walletAddress || !signature || !message || 
        typeof walletAddress !== 'string' || 
        typeof signature !== 'string' || 
        typeof message !== 'string') {
      throw new AppError(401, 'Missing authentication headers');
    }

    // Decode base64 message
    const decodedMessage = Buffer.from(message, 'base64').toString();

    // Validate the nonce in the message
    if (!validateNonce(walletAddress, decodedMessage)) {
      throw new AppError(401, 'Invalid or expired nonce');
    }

    // Verify the signature
    if (!verifySignature(decodedMessage, signature, walletAddress)) {
      throw new AppError(401, 'Invalid signature');
    }

    // Find user profile if it exists
    const profile = await prisma.userProfile.findUnique({
      where: { walletAddress }
    });

    req.user = {
      walletAddress,
      profileId: profile?.id
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, 'Authentication failed'));
    }
  }
};

export const requireProfile = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user?.profileId) {
    next(new AppError(403, 'Profile required for this action'));
    return;
  }
  next();
};
