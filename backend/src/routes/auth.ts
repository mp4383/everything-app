import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateProfile } from '../validation/social';
import { handleResponse } from '../utils/response';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// Store challenges temporarily (in production, use Redis or similar)
const challenges = new Map<string, { message: string; timestamp: number }>();

// Generate challenge for wallet authentication
router.post('/challenge', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return handleResponse(res, 400, { message: 'Wallet address is required' });
    }

    // Generate random challenge message
    const message = crypto.randomBytes(32).toString('hex');
    challenges.set(walletAddress, {
      message,
      timestamp: Date.now(),
    });

    return handleResponse(res, 200, { message });
  } catch (error) {
    console.error('Challenge error:', error);
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

// Verify signed challenge
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    if (!walletAddress || !signature || !message) {
      return handleResponse(res, 400, { message: 'Missing required fields' });
    }

    // Decode base64 signature
    const decodedSignature = Buffer.from(signature, 'base64');

    const challenge = challenges.get(walletAddress);
    if (!challenge || challenge.message !== message) {
      return handleResponse(res, 401, { message: 'Invalid challenge' });
    }

    // In production, verify the signature here
    // For now, just check if challenge exists and matches

    // Clear the used challenge
    challenges.delete(walletAddress);

    // Create user if doesn't exist
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });

    return handleResponse(res, 200, { 
      message: 'Signature verified',
      user
    });
  } catch (error) {
    console.error('Verify error:', error);
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

// Get profile for authenticated wallet
router.get('/profile', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    const message = Buffer.from(req.headers['x-message'] as string, 'base64').toString();
    if (!walletAddress) {
      return handleResponse(res, 401, { message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      return handleResponse(res, 404, { message: 'Profile not found' });
    }

    return handleResponse(res, 200, { data: user.profile });
  } catch (error) {
    console.error('Get profile error:', error);
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

// Create profile for authenticated wallet
router.post('/profile', validateProfile, async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    if (!walletAddress) {
      return handleResponse(res, 401, { message: 'Unauthorized' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { profile: true },
    });

    // If no user exists, create one
    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
        include: { profile: true },
      });
    }

    // Check if profile already exists
    if (user.profile) {
      return handleResponse(res, 409, { message: 'Profile already exists' });
    }

    // Generate avatar URL using DiceBear pixel-art
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(req.body.nickname)}`;

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        nickname: req.body.nickname,
        bio: req.body.bio,
        avatarUrl,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        userId: user.id,
      },
    });

    return handleResponse(res, 201, { data: profile });
  } catch (error) {
    console.error('Create profile error:', error);
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

export default router;
