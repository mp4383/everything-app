import express from 'express';
import { prisma } from '../services/prisma';
import { authMiddleware } from '../middleware/auth';
import { validateProfile } from '../middleware/validation';

const router = express.Router();

// Get all posts
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          include: {
            profile: true
          }
        },
        comments: true,
        likes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Create a post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { content, symbols = [], mentions = [] } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const post = await prisma.post.create({
      data: {
        content,
        symbols,
        mentions,
        authorId
      },
      include: {
        author: {
          include: {
            profile: true
          }
        }
      }
    });

    res.json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Like a post
router.post('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const like = await prisma.like.create({
      data: {
        userId,
        postId
      }
    });

    // Update post like count
    await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1
        }
      }
    });

    res.json(like);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
router.delete('/posts/:postId/like', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    // Update post like count
    await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          decrement: 1
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

export default router;
