import { Typography, Card, CardContent, Link, Stack, Box, CircularProgress } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
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

  const loadNews = useCallback(async () => {
    try {
      const newsItems = await fetchNews();
      setNews(newsItems);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();

    let intervalId;
    // Only set up interval in production, not in tests
    if (process.env.NODE_ENV !== 'test') {
      intervalId = setInterval(loadNews, 5 * 60 * 1000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loadNews]);

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
        ) : (
          <Stack spacing={2}>
            {news.map((news) => (
              <Card key={news.id} variant="outlined">
                <CardContent>
                  <Link
                    href={news.url}
                    underline="hover"
                    color="primary"
                    variant="subtitle2"
                    sx={styles.link}
                  >
                    {news.title}
                  </Link>
                  <Typography variant="body2" mb={2}>
                    {news.summary}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {news.source} • {new Date(news.timestamp).toLocaleString()}
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
