import { useState } from 'react';
import { Box, Typography, Stack, Card, CardContent, IconButton, Grid } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import TradingViewWidget from '../components/TradingViewWidget';
import { mockCryptoData, mockStockData } from '../mockData';

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
  const [selectedSymbol, setSelectedSymbol] = useState("BINANCE:BTCUSDT");

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
                {...asset} 
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
                {...asset} 
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
