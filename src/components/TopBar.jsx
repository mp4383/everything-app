import { AppBar, Box, Typography, Stack, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Menu as MenuIcon } from '@mui/icons-material';
import { mockTickers } from '../mockData';
import { useLiveTickers } from '../hooks/useLiveTickers';
import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const symbols = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:SOLUSDT', 'NASDAQ-AAPL', 'NASDAQ-MSFT'];
  const { data: liveData, isLoading } = useLiveTickers(symbols);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTicker = (symbol) => {
    const baseSymbol = symbol.split(':')[1]?.split('USDT')[0] || 
                      symbol.split('-')[1] || 
                      symbol;
    const mockData = mockTickers.find(t => t.symbol === baseSymbol) || {};
    const data = liveData[symbol] || {};
    
    // Use mock data while loading or as fallback
    const price = isLoading ? mockData.price : (data.price?.toLocaleString() || mockData.price);
    const change = isLoading ? mockData.change : (data.change24h ? `${data.change24h > 0 ? '+' : ''}${data.change24h.toFixed(2)}%` : mockData.change);
    return {
      symbol: baseSymbol,
      price,
      change
    };
  };

  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        height: '40px',
        backgroundColor: 'background.paper'
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: '100%', px: 2 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: '4px',
              padding: '4px'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', overflow: 'hidden' }}>
            {symbols.map((symbol) => {
              const ticker = getTicker(symbol);
              return (
                <Stack 
                  key={symbol} 
                  direction="row" 
                  spacing={1} 
                  alignItems="center"
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => navigate('/market', { state: { symbol } })}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {ticker.symbol}
                  </Typography>
                  <Typography variant="body2">
                    ${ticker.price}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={ticker.change.startsWith('+') ? 'success.main' : 'error.main'}
                  >
                    {ticker.change}
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <WalletMultiButton />
          <Typography variant="body2">
            {time.toLocaleTimeString()}
          </Typography>
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default TopBar;
