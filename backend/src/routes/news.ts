import express from 'express';
import { fetchAndStoreNews, getLatestNews } from '../services/news';

const router = express.Router();

// GET /api/news
router.get('/', async (req, res) => {
  console.log('GET /api/v1/news - Fetching news');
  try {
    const news = await getLatestNews();
    res.json(news);
    console.log(`GET /api/v1/news - Found ${news.length} articles`);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// POST /api/news/refresh - manually trigger news fetch (can be called by cron)
router.post('/refresh', async (req, res) => {
  console.log('POST /api/v1/news/refresh - Refreshing news');
  try {
    const result = await fetchAndStoreNews();
    if (result.success) {
      console.log('POST /api/v1/news/refresh - Success');
      res.json({ message: 'News updated successfully' });
    } else {
      console.log('POST /api/v1/news/refresh - Failed');
      res.status(500).json({ error: 'Failed to update news' });
    }
  } catch (error) {
    console.error('Error refreshing news:', error);
    res.status(500).json({ error: 'Failed to refresh news' });
  }
});

export default router;
