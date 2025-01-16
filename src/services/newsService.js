import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

export const fetchNews = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/news`);
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
    throw error; // Let the component handle the error
  }
};
