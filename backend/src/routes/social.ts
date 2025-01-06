import { Router } from 'express';
import { authenticate, requireProfile } from '../middleware/auth';
import { AuthenticatedRequest, AppError } from '../types';
import prisma from '../services/prisma';
import { sendSuccess, sendPaginatedSuccess } from '../utils/response';
import { validateRequest, createValidationSchema } from '../middleware/validation';
import {
  createPostSchema,
  createCommentSchema,
  postIdParamSchema,
  postsQuerySchema,
} from '../validation/social';

const router = Router();

// Get feed posts (with filters)
router.get('/posts', authenticate, validateRequest(createValidationSchema(
  undefined,
  postsQuerySchema
)), async (req: AuthenticatedRequest, res, next) => {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = Math.min(parseInt(req.query['limit'] as string) || 20, 100);
    const offset = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
              avatarUrl: true,
              walletAddress: true,
            },
          },
          tradeShare: true,
          _count: {
            select: {
              commentList: true,
              interactions: {
                where: { type: 'like' },
              },
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    sendPaginatedSuccess(res, posts, page, limit, total);
  } catch (error) {
    next(error);
  }
});

// Create post
router.post('/posts', authenticate, requireProfile, validateRequest(createValidationSchema(
  createPostSchema
)), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { content, symbols = [], mentions = [], tradeShare } = req.body;
    const authorId = req.user!.profileId!;

    const post = await prisma.post.create({
      data: {
        authorId,
        content,
        symbols,
        mentions,
        ...(tradeShare && {
          tradeShare: {
            create: {
              ...tradeShare,
              authorId,
            },
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            walletAddress: true,
          },
        },
        tradeShare: true,
      },
    });

    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
});

// Get specific post
router.get('/posts/:id', authenticate, validateRequest(createValidationSchema(
  undefined,
  undefined,
  postIdParamSchema
)), async (req, res, next) => {
  try {
    const { id } = req.params as { id: string };
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            walletAddress: true,
          },
        },
        tradeShare: true,
        commentList: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatarUrl: true,
                walletAddress: true,
              },
            },
            _count: {
              select: {
                interactions: {
                  where: { type: 'like' },
                },
              },
            },
          },
        },
        _count: {
          select: {
            commentList: true,
            interactions: {
              where: { type: 'like' },
            },
          },
        },
      },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    sendSuccess(res, post);
  } catch (error) {
    next(error);
  }
});

// Add comment
router.post('/posts/:id/comments', authenticate, requireProfile, validateRequest(createValidationSchema(
  createCommentSchema,
  undefined,
  postIdParamSchema
)), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { content, parentId } = req.body;
    const authorId = req.user!.profileId!;
    const { id: postId } = req.params as { id: string };

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    // If this is a reply, verify parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        throw new AppError(404, 'Parent comment not found');
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            walletAddress: true,
          },
        },
      },
    });

    sendSuccess(res, comment);
  } catch (error) {
    next(error);
  }
});

// Like/unlike post
router.post('/posts/:id/like', authenticate, requireProfile, validateRequest(createValidationSchema(
  undefined,
  undefined,
  postIdParamSchema
)), async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id: postId } = req.params as { id: string };
    const userId = req.user!.profileId!;

    // Check if interaction already exists
    const existingLike = await prisma.interaction.findUnique({
      where: {
        userPostInteraction: {
          userId,
          postId,
          targetType: 'post',
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.interaction.delete({
        where: { id: existingLike.id },
      });
      sendSuccess(res, { liked: false });
    } else {
      // Like
      await prisma.interaction.create({
        data: {
          type: 'like',
          userId,
          postId,
          targetType: 'post',
        },
      });
      sendSuccess(res, { liked: true });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
