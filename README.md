# Everything App

A comprehensive platform for crypto and stock market tracking, social interactions, and more.

## Features
- Real-time market data from TradingView
- Social feed for community interaction
- Calendar for event tracking
- Integrated wallet support
- News aggregation

## Wallet Setup

### Installing Phantom Wallet
1. Visit [Phantom Wallet](https://phantom.app/)
2. Click "Add to Browser" and install the extension
3. Create a new wallet or import existing one
4. Make sure to switch to Solana Devnet:
   - Click the gear icon in Phantom
   - Go to Settings -> Change Network -> Devnet

### Troubleshooting Wallet Connection

If you're having issues with wallet connection:

1. Reset Phantom Extension:
   - Click the Extensions icon in Chrome (puzzle piece)
   - Right-click on Phantom
   - Select "Manage Extension"
   - Toggle the extension off
   - Wait a few seconds
   - Toggle the extension back on

2. Clear Phantom Data:
   - Click the Phantom extension icon
   - Go to Settings (gear icon)
   - Go to Connected Apps
   - Remove all app connections
   - Switch to a different network
   - Switch back to Devnet

3. Clear Browser Data:
   - Open Chrome Settings
   - Go to Privacy and Security -> Clear browsing data
   - Select "All time" for time range
   - Check "Cookies and other site data" and "Cached images and files"
   - Click "Clear data"

4. Hard Reset:
   - Follow steps 1-3 above
   - Close Chrome completely
   - Reopen Chrome
   - Try connecting again

Note: You may need to reload the Phantom extension each time you disconnect to ensure a fresh connection.

### Connecting Your Wallet
1. Open the app
2. Find the Wallet section in the dashboard
3. Click "Connect Phantom"
4. Approve the connection in the Phantom popup
5. Your wallet address should now appear in the Wallet display

## Development

### Installation
```bash
npm install
```

### Running the app
```bash
npm run dev
```

### Environment Variables
```
# Add these to your .env file
VITE_SOLANA_NETWORK=devnet
```

## Architecture
- React + Vite for frontend
- Material-UI for components
- TradingView for market data
- Solana Web3.js for blockchain interaction
- React Router for navigation

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
