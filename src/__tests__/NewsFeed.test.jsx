import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import NewsFeed from '../components/NewsFeed';
import { fetchNews } from '../services/newsService';

vi.mock('../services/newsService', () => ({
  fetchNews: vi.fn()
}));

describe('NewsFeed', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    fetchNews.mockReset();
  });

  it('shows loading state initially', async () => {
    fetchNews.mockResolvedValue([]);
    render(<NewsFeed />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays news items after loading', async () => {
    const mockNews = [
      {
        id: 1,
        title: 'Bitcoin Reaches New High',
        summary: 'Bitcoin price reaches new heights.',
        url: 'https://example.com/bitcoin-news',
        source: 'CoinDesk',
        timestamp: new Date().toISOString()
      }
    ];
    fetchNews.mockResolvedValue(mockNews);
    render(<NewsFeed />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Verify news content
    expect(screen.getByText('Bitcoin Reaches New High')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin price reaches new heights.')).toBeInTheDocument();
    expect(screen.getByText(/CoinDesk/)).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    fetchNews.mockRejectedValue(new Error('Failed to fetch'));
    render(<NewsFeed />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Should show empty state (no news items)
    expect(screen.queryByText('Bitcoin Reaches New High')).not.toBeInTheDocument();
  });

  it('refreshes news periodically', async () => {
    const mockNews = [
      {
        id: 1,
        title: 'Bitcoin Reaches New High',
        summary: 'Bitcoin price reaches new heights.',
        url: 'https://example.com/bitcoin-news',
        source: 'CoinDesk',
        timestamp: new Date().toISOString()
      }
    ];
    
    // Setup timer mocks
    vi.useFakeTimers();
    fetchNews.mockResolvedValue(mockNews);
    
    render(<NewsFeed />);

    // Initial fetch
    expect(fetchNews).toHaveBeenCalledTimes(1);

    // Fast-forward 5 minutes
    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    
    // Should have called fetch again
    expect(fetchNews).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });
});
