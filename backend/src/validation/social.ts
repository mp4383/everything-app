import { Request, Response, NextFunction } from 'express';
import { handleResponse } from '../utils/response';

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
  const { nickname, bio } = req.body;

  const errors = [];

  if (!nickname || typeof nickname !== 'string' || nickname.trim().length < 3) {
    errors.push({
      field: 'nickname',
      message: 'Nickname must be at least 3 characters long',
    });
  }

  if (!bio || typeof bio !== 'string' || bio.trim().length < 3) {
    errors.push({
      field: 'bio',
      message: 'Bio must be at least 3 characters long',
    });
  }

  if (errors.length > 0) {
    return handleResponse(res, 400, { errors });
  }

  // Clean the data
  req.body.nickname = nickname.trim();
  req.body.bio = bio.trim();
  req.body.avatarUrl = req.body.avatarUrl || null;

  next();
};
