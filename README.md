# Everything App

A comprehensive web application that combines social feed, market overview, news feed, wallet management, and calendar functionality into a single, unified interface.

## Project Overview

The Everything App is designed to be a one-stop dashboard that brings together various functionalities typically spread across multiple applications. It features a clean, modern interface with a focus on usability and efficient information display.

## Features

- **Social Feed**: Post updates, like, comment, and share content
- **Market Overview**: Track crypto and stock market prices
- **News Feed**: Stay updated with latest news
- **Wallet Display**: Manage crypto wallet and tokens
- **Calendar**: Track events and schedules
- **Chat**: Communicate with other users

## Tech Stack

- React
- Material-UI
- Vite
- Mock data for development

## Project Structure

```
everything-app/
├── src/
│   ├── components/
│   │   ├── TopBar.jsx        # App header with BTC ticker
│   │   ├── Sidebar.jsx       # Navigation drawer
│   │   ├── SocialFeed.jsx    # Social media feed
│   │   ├── NewsFeed.jsx      # News aggregation
│   │   ├── MarketOverview.jsx# Market data display
│   │   ├── WalletDisplay.jsx # Wallet management
│   │   ├── Calendar.jsx      # Event calendar
│   │   └── ChatBar.jsx       # Chat interface
│   ├── mockData.js           # Development data
│   ├── theme.js             # MUI theme customization
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── CHANGELOG.md            # Project history
├── TODO.md                # Task tracking
└── README.md              # This file
```

## Setup

1. Clone the repository
```bash
git clone [repository-url]
cd everything-app
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

## Development Guidelines

### Styling
- Use Material-UI's `sx` prop for component-specific styling
- Follow 8px grid system for spacing
- Use theme colors for consistency
- Maintain border-radius consistency (8px)
- Use light borders (#e0e0e0) for subtle definition

### Component Structure
- Keep components focused and single-responsibility
- Use proper TypeScript types (planned)
- Include proper error handling
- Implement loading states
- Add proper documentation

### State Management
- Use React hooks for local state
- Implement proper error boundaries
- Handle loading states appropriately
- Plan for proper data fetching

## Contributing

1. Check TODO.md for planned improvements
2. Follow the existing code style
3. Update CHANGELOG.md with your changes
4. Test thoroughly before submitting PR

## Current Status

This project is under active development. See CHANGELOG.md for recent updates and TODO.md for planned improvements.

## License

[License Type] - See LICENSE file for details
