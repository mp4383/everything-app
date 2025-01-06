import express from 'express';
import { PrismaClient } from '@prisma/client';
import { generateChallenge, verifySignature } from '../utils/auth';
import { generateToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';
import { validateProfile } from '../middleware/validation';

const router = express.Router();
const prisma = new PrismaClient();

// Get challenge message
router.post('/challenge', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const message = generateChallenge(walletAddress);
    res.json({ message });
  } catch (error) {
    console.error('Challenge error:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

// Verify signature and authenticate
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isValid = verifySignature(message, signature, walletAddress);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { profile: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
        include: { profile: true },
      });
    }

    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Create or update profile
router.post('/profile', [authMiddleware, validateProfile], async (req, res) => {
  try {
    const userId = req.user.id;
    const { nickname, bio } = req.body;

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { nickname, bio },
      create: {
        userId,
        nickname,
        bio,
      },
      include: {
        user: true,
      },
    });

    res.json(profile);
  } catch (error) {
    console.error('Create/update profile error:', error);
    res.status(500).json({ error: 'Failed to create/update profile' });
  }
});

export default router;
