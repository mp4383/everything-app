import React from 'react';
import { Box, Button, Typography, Paper, Avatar, Divider } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '../contexts/AuthContext';

const WalletDisplay = () => {
  const { publicKey } = useWallet();
  const { isAuthenticated, profile, login, logout } = useAuth();

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (!publicKey) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Connect Wallet
        </Typography>
        <WalletMultiButton />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Authenticate
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConnect}
          fullWidth
        >
          Sign In
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      {profile ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profile.avatarUrl || undefined}
              alt={profile.nickname}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">{profile.nickname}</Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.bio}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Wallet Address
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
              {publicKey.toString()}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stats
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2">Posts</Typography>
                <Typography variant="h6">{profile.postCount}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">Followers</Typography>
                <Typography variant="h6">{profile.followerCount}</Typography>
              </Box>
              <Box>
                <Typography variant="body2">Following</Typography>
                <Typography variant="h6">{profile.followingCount}</Typography>
              </Box>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDisconnect}
            fullWidth
            sx={{ mt: 2 }}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            Loading profile...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default WalletDisplay;
