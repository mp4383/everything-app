import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Stack, Card, CardContent, IconButton, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import TradingViewWidget from '../components/TradingViewWidget';
import { mockCryptoData, mockStockData } from '../mockData';
import { useLiveTickers } from '../hooks/useLiveTickers';

const AssetCard = ({ symbol, name, price, change24h, marketCap, onClick, exchange = "BINANCE" }) => (
  <Card 
    variant="outlined" 
    sx={{ 
      mb: 2, 
      cursor: 'pointer',
      '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }
    }}
    onClick={() => onClick(exchange === 'BINANCE' ? `${exchange}:${symbol}USDT` : `NASDAQ-${symbol}`)}
  >
    <CardContent>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" fontWeight="bold">{symbol}</Typography>
          <Typography variant="body2" color="text.secondary">{name}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2">${price.toLocaleString()}</Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {change24h >= 0 ? (
              <TrendingUp color="success" fontSize="small" />
            ) : (
              <TrendingDown color="error" fontSize="small" />
            )}
            <Typography
              variant="body2"
              color={change24h >= 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(change24h)}%
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          MCap: {marketCap}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

const MarketPage = () => {
  const location = useLocation();
  const [selectedSymbol, setSelectedSymbol] = useState(location.state?.symbol || "BINANCE:BTCUSDT");

  useEffect(() => {
    if (location.state?.symbol) {
      setSelectedSymbol(location.state.symbol);
    }
  }, [location.state?.symbol]);
  const symbols = [
    ...mockCryptoData.map(asset => `BINANCE:${asset.symbol}USDT`),
    ...mockStockData.map(asset => `NASDAQ-${asset.symbol}`)
  ];
  const { data: liveData, isLoading } = useLiveTickers(symbols);

  const getUpdatedAssetData = (asset, exchange) => {
    const symbol = exchange === 'BINANCE' ? `BINANCE:${asset.symbol}USDT` : `NASDAQ-${asset.symbol}`;
    const data = liveData[symbol] || {};
    return {
      ...asset,
      price: isLoading ? asset.price : (data.price || asset.price),
      change24h: isLoading ? asset.change24h : (data.change24h || asset.change24h)
    };
  };

  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol);
  };
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100%',
      width: '100%',
      bgcolor: 'background.default'
    }}>
      {/* Left Sidebar - Market Data */}
      <Box sx={{ 
        width: '300px',
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
        p: 2
      }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Crypto Assets</Typography>
            {mockCryptoData.map((asset) => (
              <AssetCard 
                key={asset.symbol} 
                {...getUpdatedAssetData(asset, 'BINANCE')}
                onClick={handleSymbolSelect}
                exchange="BINANCE"
              />
            ))}
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>Stock Market</Typography>
            {mockStockData.map((asset) => (
              <AssetCard 
                key={asset.symbol} 
                {...getUpdatedAssetData(asset, 'NASDAQ')}
                onClick={handleSymbolSelect}
                exchange="NASDAQ"
              />
            ))}
          </Box>
        </Stack>
      </Box>

      {/* Main Content - Trading Chart */}
      <Box sx={{ 
        flex: 1,
        height: '100%',
        position: 'relative'
      }}>
        <TradingViewWidget symbol={selectedSymbol} />
      </Box>
    </Box>
  );
};

export default MarketPage;
