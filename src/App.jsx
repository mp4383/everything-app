import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import SocialFeed from './components/SocialFeed';
import SocialPage from './pages/SocialPage';
import NewsFeed from './components/NewsFeed';
import MarketOverview from './components/MarketOverview';
import MarketPage from './pages/MarketPage';
import WalletDisplay from './components/WalletDisplay';
import Calendar from './components/Calendar';
import TopBar from './components/TopBar';
import ChatBar from './components/ChatBar';
import Sidebar from './components/Sidebar';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35', // sunburnt orange
      contrastText: '#fff'
    },
    secondary: {
      main: '#00B4D8', // vibrant light blue
      contrastText: '#fff'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          color: '#ffffff', // white text for headers
          fontWeight: 600,
          padding: '8px 16px', // padding for headers
        }
      }
    }
  }
});

const Home = () => (
  <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 110px)' }}>
    {/* Left column */}
    <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ 
        flex: 1,
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <SocialFeed />
      </Box>
      <Box sx={{ 
        flex: 1,
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <MarketOverview />
      </Box>
    </Box>

    {/* Middle column */}
    <Box sx={{ width: '25%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ 
        flex: 7,
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <NewsFeed />
      </Box>
      <Box sx={{ 
        flex: 3,
        bgcolor: 'background.paper', 
        borderRadius: 'auto',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <WalletDisplay />
      </Box>
    </Box>

    {/* Right column */}
    <Box sx={{ width: '25%' }}>
      <Box sx={{ 
        height: '100%',
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <Calendar />
      </Box>
    </Box>
  </Box>
);

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar onMenuClick={handleDrawerToggle} />
        <Sidebar 
          open={drawerOpen} 
          onClose={() => setDrawerOpen(false)}
        />
        <Box 
          component="main"
          sx={{ 
            position: 'fixed',
            top: '40px', // TopBar height
            left: 0,
            right: 0,
            bottom: '50px', // ChatBar height
            bgcolor: 'background.default'
          }}
        >
          <Routes>
            <Route path="/" element={<Box sx={{ p: 1 }}><Home /></Box>} />
            <Route path="/feed" element={<SocialPage />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/wallet" element={<WalletDisplay />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
        <ChatBar />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
