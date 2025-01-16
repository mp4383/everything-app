import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box, CircularProgress } from '@mui/material';
import { WalletContextProvider } from './contexts/WalletContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { useWallet } from '@solana/wallet-adapter-react';
import LoginPage from './pages/LoginPage';
import CreateProfilePage from './pages/CreateProfilePage';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import SocialFeed from './components/SocialFeed';
import SocialPage from './pages/SocialPage';
import NewsFeed from './components/NewsFeed';
import MarketPage from './pages/MarketPage';
import WalletDisplay from './components/WalletDisplay';
import ScheduleWidget from './components/ScheduleWidget';
import SchedulePage from './pages/SchedulePage';
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
    <Box sx={{ width: '50%' }}>
      <Box sx={{ 
        height: '100%',
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <SocialFeed />
      </Box>
    </Box>

    {/* Middle column */}
    <Box sx={{ width: '25%' }}>
      <Box sx={{ 
        height: '100%',
        bgcolor: 'background.paper', 
        borderRadius: '8px',
        overflow: 'auto',
        border: 1,
        borderColor: '#e0e0e0'
      }}>
        <NewsFeed />
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
          <ScheduleWidget />
      </Box>
    </Box>
  </Box>
);

const AppContent = () => {
  const { publicKey, connecting } = useWallet();
  const { isAuthenticated, profile, login } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Reset drawer state when connection changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [publicKey]);

  // Attempt login when wallet is connected
  useEffect(() => {
    if (publicKey && !isAuthenticated) {
      login().catch(console.error);
    }
  }, [publicKey, isAuthenticated, login]);

  if (connecting) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!publicKey) {
    return <LoginPage />;
  }

  // Show loading while authenticating
  if (publicKey && !isAuthenticated) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to profile creation if no profile exists
  if (isAuthenticated && !profile) {
    return <CreateProfilePage />;
  }

  return (
    <>
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
          bgcolor: 'background.default',
          p: 1,
          overflow: 'auto'
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<SocialPage />} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/wallet" element={<WalletDisplay />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <ChatBar />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <WalletContextProvider>
          <AuthProvider>
            <ScheduleProvider>
            <AppContent />
            </ScheduleProvider>
          </AuthProvider>
        </WalletContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
