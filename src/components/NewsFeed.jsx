import { Typography, Card, CardContent, Link, Stack, Box } from '@mui/material';
import { mockNews } from '../mockData';

const NewsFeed = () => {
  return (
    <Stack spacing={2} sx={{ height: '100%' }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          position: 'sticky', 
          top: 0,
          bgcolor: 'primary.main',
          zIndex: 1,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        News Feed
      </Typography>
      <Box sx={{ overflow: 'auto', flex: 1, px: 2, bgcolor: '#fafafa' }}>
        <Stack spacing={2}>
          {mockNews.map((news) => (
            <Card key={news.id} variant="outlined">
              <CardContent>
                <Link
                  href={news.url}
                  underline="hover"
                  color="primary"
                  variant="subtitle2"
                  sx={{ display: 'block', mb: 1 }}
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
      </Box>
    </Stack>
  );
};

export default NewsFeed;
