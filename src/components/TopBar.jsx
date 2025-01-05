import { AppBar, Box, Typography, Stack, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { mockTickers } from '../mockData';

const TopBar = ({ onMenuClick }) => {
  return (
    <AppBar 
      position="fixed" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        height: '40px',
        backgroundColor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1
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
          {mockTickers.map((ticker) => (
            <Stack key={ticker.symbol} direction="row" spacing={1} alignItems="center">
              <Typography variant="body2" fontWeight="bold">
                {ticker.symbol}
              </Typography>
              <Typography variant="body2">
                {ticker.price}
              </Typography>
              <Typography
                variant="body2"
                color={ticker.change.startsWith('+') ? 'success.main' : 'error.main'}
              >
                {ticker.change}
              </Typography>
            </Stack>
          ))}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ ml: 2 }}>
          {new Date().toLocaleTimeString()}
        </Typography>
      </Stack>
    </AppBar>
  );
};

export default TopBar;
