import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
            Connect your Phantom wallet to get started
          </Typography>

          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <WalletMultiButton />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Make sure you're on Solana Devnet network
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
