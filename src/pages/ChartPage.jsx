import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import TradingViewWidget from '../components/TradingViewWidget';

function ChartPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Market Chart
      </Typography>
      <Paper sx={{ p: 2, height: 'calc(100vh - 180px)' }}>
        <TradingViewWidget />
      </Paper>
    </Box>
  );
}

export default ChartPage;
