import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import express from 'express';
import supertest from 'supertest';
import { PrismaClient } from '@prisma/client';
import newsRoutes from '../routes/news';

// Create a test app with only news routes
const app = express();
app.use(express.json());
app.use('/api/v1/news', newsRoutes);

const prisma = new PrismaClient();
const request = supertest(app);

// Mock RSS parser
jest.mock('rss-parser', () => {
  return class Parser {
    parseURL() {
      return Promise.resolve({
        items: [
          {
            title: 'Test Article',
            contentSnippet: 'Test Summary',
            link: 'https://test.com/article',
            isoDate: '2024-01-20T12:00:00Z'
          }
        ]
      });
    }
  };
});

describe('News API', () => {
  beforeEach(async () => {
    await prisma.news.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('GET /api/v1/news', () => {
    it('should return empty array when no news exists', async () => {
      const response = await request.get('/api/v1/news');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return stored news articles', async () => {
      // Create test news article
      await prisma.news.create({
        data: {
          title: 'Test News',
          summary: 'Test Summary',
          url: 'https://test.com/news',
          source: 'CoinDesk',
          publishedAt: new Date()
        }
      });

      const response = await request.get('/api/v1/news');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        title: 'Test News',
        summary: 'Test Summary',
        url: 'https://test.com/news',
        source: 'CoinDesk'
      });
    });
  });

  describe('POST /api/v1/news/refresh', () => {
    it('should fetch and store news from RSS feed', async () => {
      const response = await request.post('/api/v1/news/refresh');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'News updated successfully'
      });

      // Verify news was stored
      const storedNews = await prisma.news.findMany();
      expect(storedNews).toHaveLength(1);
      expect(storedNews[0]).toMatchObject({
        title: 'Test Article',
        summary: 'Test Summary',
        url: 'https://test.com/article',
        source: 'CoinDesk'
      });
    });
  });
});
