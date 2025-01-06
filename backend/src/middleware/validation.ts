import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const profileSchema = z.object({
  nickname: z.string().min(3).max(30),
  bio: z.string().min(1).max(500),
  avatarUrl: z.string().url().optional(),
});

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = profileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid profile data',
        details: result.error.issues,
      });
    }
    next();
  } catch (error) {
    console.error('Profile validation error:', error);
    res.status(400).json({ error: 'Invalid profile data' });
  }
};
