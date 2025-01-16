import { Typography, Card, CardContent, Link, Stack, Box, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { fetchNews } from '../services/newsService';

const styles = {
  root: {
    height: '100%'
  },
  header: {
    position: 'sticky',
    top: 0,
    bgcolor: 'primary.main',
    zIndex: 1,
    borderBottom: 1,
    borderColor: 'divider'
  },
  content: {
    overflow: 'auto',
    flex: 1,
    px: 2,
    bgcolor: '#fafafa'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    my: 4
  },
  link: {
    display: 'block',
    mb: 1
  }
};

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsItems = await fetchNews();
        setNews(newsItems);
        setError(null);
      } catch (error) {
        console.error('Error loading news:', error);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadNews();

    // Only set up interval in production, not in tests
    if (process.env.NODE_ENV !== 'test') {
      const interval = setInterval(loadNews, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Stack spacing={2} sx={styles.root}>
      <Typography 
        variant="subtitle1" 
        sx={styles.header}
      >
        News Feed
      </Typography>
      <Box sx={styles.content}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : news.length === 0 ? (
          <Alert severity="info" sx={{ m: 2 }}>No news articles available.</Alert>
        ) : (
          <Stack spacing={2}>
            {news.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Link
                    href={item.url}
                    underline="hover"
                    color="primary"
                    variant="subtitle2"
                    sx={styles.link}
                    target="_blank"
                    rel="noopener"
                  >
                    {item.title}
                  </Link>
                  <Typography variant="body2" mb={2}>
                    {item.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.source} • {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default NewsFeed;
