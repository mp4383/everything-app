import { PrismaClient } from '@prisma/client';
import Parser from 'rss-parser';
import { prisma } from './prisma';

const parser = new Parser();
const RSS_URL = 'https://www.coindesk.com/arc/outboundfeeds/rss/';

export const fetchAndStoreNews = async () => {
  try {
    const feed = await parser.parseURL(RSS_URL);
    const newsItems = feed.items.map(item => ({
      title: item.title!,
      summary: item.contentSnippet || item.content || '',
      url: item.link!,
      source: 'CoinDesk',
      publishedAt: new Date(item.isoDate || item.pubDate!),
    }));

    // Upsert each news item
    for (const item of newsItems) {
      await prisma.news.upsert({
        where: { url: item.url },
        update: item,
        create: item,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error fetching and storing news:', error);
    return { success: false, error };
  }
};

export const getLatestNews = async (limit = 20) => {
  try {
    return await prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  } catch (error) {
    console.error('Error fetching news from database:', error);
    return [];
  }
};
