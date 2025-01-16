import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import socialRoutes from './routes/social';
import newsRoutes from './routes/news';
import { fetchAndStoreNews } from './services/news';

const app = express();
const port = process.env['PORT'] || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/social', socialRoutes);
app.use('/api/v1/news', newsRoutes);

// Refresh news every 5 minutes
setInterval(async () => {
  try {
    await fetchAndStoreNews();
    console.log('News refreshed successfully');
  } catch (error) {
    console.error('Error refreshing news:', error);
  }
}, 5 * 60 * 1000); // 5 minutes in milliseconds

// Initial news fetch on startup
fetchAndStoreNews().catch(console.error);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env['NODE_ENV'] === 'development' ? err.message : undefined,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
