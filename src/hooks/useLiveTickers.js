import { useState, useEffect } from 'react';
import { tradingViewService } from '../services/tradingViewService';

export const useLiveTickers = (symbols) => {
  const [tickerData, setTickerData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleTickerUpdate = (data) => {
      setIsLoading(false);
      setTickerData(prev => ({
        ...prev,
        [data.symbol]: {
          price: data.price || prev[data.symbol]?.price,
          change24h: data.changePercent || prev[data.symbol]?.change24h
        }
      }));
    };

    const handleError = (err) => {
      setError(err);
    };

    let unsubscribe;
    const subscribe = async () => {
      try {
        unsubscribe = await tradingViewService.subscribeMultipleTickers(
          symbols,
          handleTickerUpdate
        );
      } catch (err) {
        handleError(err);
      }
    };

    if (symbols.length > 0) {
      subscribe();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [symbols]);

  return { data: tickerData, error, isLoading };
};
