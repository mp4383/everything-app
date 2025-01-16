import express from 'express';
import { PrismaClient } from '@prisma/client';
import { handleResponse } from '../utils/response';
import { settingsSchema } from '../validation/settings';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

// Get user settings
router.get('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    if (!walletAddress) {
      return handleResponse(res, 401, { message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { settings: true },
    });

    if (!user) {
      return handleResponse(res, 404, { message: 'User not found' });
    }

    return handleResponse(res, 200, { data: user.settings });
  } catch (error) {
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

// Update user settings
router.post('/', async (req, res) => {
  try {
    const walletAddress = req.headers['x-wallet-address'] as string;
    if (!walletAddress) {
      return handleResponse(res, 401, { message: 'Unauthorized' });
    }

    // Validate input
    const validatedData = settingsSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { settings: true },
    });

    if (!user) {
      return handleResponse(res, 404, { message: 'User not found' });
    }

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        openAiKey: validatedData.openAiKey,
      },
      create: {
        userId: user.id,
        openAiKey: validatedData.openAiKey,
      },
    });

    return handleResponse(res, 200, { data: settings });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleResponse(res, 400, { 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    return handleResponse(res, 500, { message: 'Internal server error' });
  }
});

export default router;
