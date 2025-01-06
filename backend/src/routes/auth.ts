import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateProfile } from '../validation/social';
import { handleResponse } from '../utils/response';

const router = express.Router();
const prisma = new PrismaClient();

// Get profile for authenticated wallet
router.get('/profile', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
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

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        nickname: req.body.nickname,
        bio: req.body.bio,
        avatarUrl: req.body.avatarUrl,
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
