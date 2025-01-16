import { api } from './api';

export const fetchNews = async () => {
  try {
    const { data } = await api.get('/news');
    return data.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source,
      timestamp: item.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
