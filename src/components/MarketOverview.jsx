import { Typography, Card, CardContent, Grid, Stack, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { mockCryptoData, mockStockData } from '../mockData';
import { useLiveTickers } from '../hooks/useLiveTickers';

const AssetCard = ({ symbol, name, price, change24h, marketCap, onClick }) => (
  <Card 
    variant="outlined"
    sx={{ 
      cursor: 'pointer',
      '&:hover': {
        bgcolor: 'rgba(0, 0, 0, 0.02)'
      }
    }}
    onClick={onClick}
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

const MarketOverview = () => {
  const navigate = useNavigate();
  const symbols = [
    ...mockCryptoData.map(asset => `BINANCE:${asset.symbol}USDT`),
    ...mockStockData.map(asset => `NASDAQ-${asset.symbol}`)
  ];
  const { data: liveData, isLoading } = useLiveTickers(symbols);

  const getUpdatedAssetData = (asset, exchange) => {
    const symbol = exchange === 'BINANCE' ? `BINANCE:${asset.symbol}USDT` : `NASDAQ-${asset.symbol}`;
    const data = liveData[symbol] || {};
    
    // Format price to match mock data format
    const formattedPrice = data.price ? parseFloat(data.price).toFixed(2) : asset.price;
    
    return {
      ...asset,
      price: isLoading ? asset.price : formattedPrice,
      change24h: isLoading ? asset.change24h : (data.change24h || asset.change24h)
    };
  };

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
        Market Overview
      </Typography>
      <Box sx={{ 
        overflow: 'auto', 
        flex: 1, 
        px: 2, 
        bgcolor: '#fafafa' 
      }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Crypto Assets</Typography>
            <Grid container spacing={2}>
              {mockCryptoData.map((asset) => (
                <Grid item xs={6} key={asset.symbol}>
                  <AssetCard 
                    {...getUpdatedAssetData(asset, 'BINANCE')} 
                    onClick={() => navigate(`/market`, { state: { symbol: `BINANCE:${asset.symbol}USDT` } })}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>Stock Market</Typography>
            <Grid container spacing={2}>
              {mockStockData.map((asset) => (
                <Grid item xs={6} key={asset.symbol}>
                  <AssetCard 
                    {...getUpdatedAssetData(asset, 'NASDAQ')} 
                    onClick={() => navigate(`/market`, { state: { symbol: `NASDAQ-${asset.symbol}` } })}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MarketOverview;
