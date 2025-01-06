# Changelog

## [Unreleased]

### Backend Configuration
- Fixed backend server port to run consistently on 3001
- Updated all frontend references to use port 3001 for API calls

### Upcoming Features
- Profile creation flow for new wallet addresses
- Automatic redirection to profile creation for unrecognized wallets
- Dashboard navigation after profile setup


### Added
- Initial project setup with React and Material-UI
- Basic layout with responsive grid system
- Component structure for modular development
- Mock data for development and testing

### Components Added
- TopBar: App header with BTC price indicator and hamburger menu
- Sidebar: Navigation drawer with menu items
- SocialFeed: Social media style feed with posts and interactions
- NewsFeed: News aggregation display
- MarketOverview: Crypto and stock market overview
- WalletDisplay: Wallet connection and token display
- Calendar: Event tracking and display
- ChatBar: Communication interface

### Recent Changes

#### Profile Features (Latest)
- Added profile button to TopBar:
  - Displays user's avatar from profile
  - Shows nickname initials as fallback
  - Added dropdown menu with Profile, Settings, and Logout options
  - Positioned to the right of the clock
  - Styled with subtle border and hover effect

#### Social Feed Improvements (Latest)
- Added nicknames to social posts
- Updated post layout:
  - Nickname displayed prominently with avatar
  - Avatar shows nickname initials
  - Wallet address moved to right side with monospace font
  - Improved visual hierarchy of post information

#### Dashboard Layout Updates (Latest)
- Removed market overview and wallet components from main dashboard view
- Reorganized dashboard layout to focus on core features:
  - SocialFeed (50% width)
  - NewsFeed (25% width)
  - Calendar (25% width)
- Market and wallet features now accessible through dedicated pages

#### TopBar Improvements (Latest)
- Fixed NASDAQ ticker values by updating symbol format (NASDAQ-AAPL → NASDAQ:AAPL)
- Improved ticker data handling for both crypto and stock symbols
- Removed mock data fallback in favor of live data
- Simplified symbol extraction logic for cleaner code

#### Authentication Flow (Latest)
- Added login page with Phantom wallet connection
- Restricted app access to authenticated users only
- Added wallet connection status checks
- Added installation guidance for new users
- Added proper error handling for connection
- Improved wallet connection UI/UX

#### Authentication Integration
- Added Phantom wallet integration for authentication
- Created wallet context for state management
- Updated WalletDisplay component with connection UI
- Added connection status indicators
- Added wallet address display
- Set up Solana devnet connection

#### Live Data Integration (Latest)
- Added TradingView WebSocket service for real-time data
- Implemented live ticker updates for crypto and stock assets
- Created custom hook for managing live market data
- Integrated live prices and changes in Market view

#### Project Setup Improvements
- Added comprehensive .gitignore file
- Configured ignore patterns for:
  - Dependencies and build artifacts
  - Environment and secret files
  - Editor-specific files
  - System files and logs

#### Market View Improvements
- Added interactive trading chart with TradingView widget
- Made asset cards clickable to update chart symbol
- Added support for both crypto and stock symbols
- Improved chart symbol handling for different exchanges

#### Architecture Improvements
- Created separate pages directory for full-page implementations
- Moved Market and Social views to dedicated pages with optimized layouts
- Implemented consistent full-page styling (scrollbars, backgrounds)
- Separated page-level components from reusable components
- Improved component organization and reusability
- Fixed viewport sizing and container layouts

#### Market Overview Improvements
- Added TradingView Advanced Charts widget for real-time crypto/stock charts
- Default chart shows BTCUSDT from Binance
- Split Market Overview into two sections: market data and trading chart
- Improved layout with scrollable market data and responsive chart

#### Router Implementation
- Implemented React Router for proper navigation and history support
- Added route configuration for all views
- Updated Sidebar to use router navigation
- Added visual feedback for active route in sidebar
- Added fallback route to home page

#### UI Improvements
- Fixed hamburger menu visibility by integrating it into TopBar component
- Added light gray borders (#e0e0e0) to individual component containers for better definition
- Set white background for main app with very light gray (#fafafa) for content areas
- Increased border radius to 8px for component containers
- Centered SocialFeed in its dedicated view with 600px width
- Removed border from main content container for cleaner look

### Current Focus
- Improving component isolation and reusability
- Enhancing visual hierarchy and spacing
- Optimizing layout for different screen sizes

### Planned Improvements
- Implement proper responsive design for mobile views
- Add loading states for data fetching
- Enhance interaction feedback
- Implement proper error handling
- Add proper TypeScript types
- Set up proper testing infrastructure

### Technical Decisions
1. Using Material-UI for:
   - Consistent component styling
   - Built-in responsiveness
   - Theme customization
   - Accessibility features

2. Component Structure:
   - Each component in separate file for maintainability
   - Shared styling through theme
   - Mock data separated for easy replacement with real data

3. Layout Strategy:
   - Grid-based layout for flexibility
   - Component containers with consistent styling
   - Sticky headers for better navigation
   - Scrollable content areas for overflow

### Notes
- Keep component backgrounds white for clean look
- Use consistent spacing (8px increments)
- Maintain border radius consistency (8px)
- Use light borders for subtle definition
- Center standalone views (like SocialFeed) at 600px width
