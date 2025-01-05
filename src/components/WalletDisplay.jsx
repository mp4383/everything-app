import { Typography, Card, CardContent, Button, Stack, Box } from '@mui/material';
import { AccountBalanceWallet as WalletIcon } from '@mui/icons-material';

const WalletDisplay = () => {
  // Mock wallet address - in real app this would come from Solana wallet connection
  const mockAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  
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
        Wallet
      </Typography>
      <Box sx={{ overflow: 'auto', flex: 1, px: 2, bgcolor: '#fafafa' }}>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <WalletIcon color="secondary" />
                  <Typography variant="subtitle2">Connected Wallet</Typography>
                </Stack>
                
                <Typography variant="body2" color="text.secondary">
                  {mockAddress.slice(0, 6)}...{mockAddress.slice(-4)}
                </Typography>

                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  fullWidth
                >
                  Disconnect
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Platform Token
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coming soon
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Earn tokens by participating in the community
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
};

export default WalletDisplay;
