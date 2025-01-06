import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletDisplay = () => {
  const { publicKey } = useWallet();

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

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Wallet Connected
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
          {publicKey.toString()}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <WalletMultiButton />
      </Box>
    </Paper>
  );
};

export default WalletDisplay;
