import { z } from 'zod';

export const createPostSchema = z.object({
  content: z.string().min(1).max(1000),
  symbols: z.array(z.string()).optional().default([]),
  mentions: z.array(z.string()).optional().default([]),
  tradeShare: z.object({
    symbol: z.string(),
    type: z.enum(['buy', 'sell']),
    amount: z.number().positive(),
    price: z.number().positive(),
    platform: z.string(),
    proofUrl: z.string().url().optional(),
  }).optional(),
}).strict();

export const createCommentSchema = z.object({
  content: z.string().min(1).max(500),
  parentId: z.string().optional(),
}).strict();

export const paginationSchema = z.object({
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => Math.min(parseInt(val || '20'), 100)),
}).strict();

export const postIdParamSchema = z.object({
  id: z.string().uuid(),
}).strict().transform(data => ({
  id: data.id as string // Assert id is string after validation
}));

export const postFiltersSchema = z.object({
  symbols: z.array(z.string()).optional(),
  authorId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).strict();

// Combined query schema for posts endpoint
export const postsQuerySchema = paginationSchema.merge(postFiltersSchema);

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type PostFilters = z.infer<typeof postFiltersSchema>;
