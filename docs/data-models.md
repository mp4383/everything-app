# Data Models

## User Profile
```typescript
interface UserProfile {
  walletAddress: string;  // Primary key, Solana wallet address
  nickname: string;       // User's display name
  avatarUrl: string;     // URL to profile picture
  bio?: string;          // Optional user bio
  socialStats: {
    followers: number;
    following: number;
    posts: number;
  };
  createdAt: Date;       // When profile was created
  updatedAt: Date;       // Last profile update
}
```

## User Settings
```typescript
interface UserSettings {
  walletAddress: string;  // Foreign key to UserProfile
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    priceAlerts: boolean;
    socialInteractions: boolean;
    mentions: boolean;
  };
  watchlist: {
    crypto: string[];    // Array of cryptocurrency symbols
    stocks: string[];    // Array of stock symbols
  };
  defaultView: {
    marketPage: 'crypto' | 'stocks';
    timeframe: '1D' | '1W' | '1M' | '1Y';
  };
  privacy: {
    showWatchlist: boolean;
    showPortfolio: boolean;
    showActivity: boolean;
  };
  updatedAt: Date;
}
```

## Social Feed Models
```typescript
interface Post {
  id: string;           // Unique identifier
  authorAddress: string;// Wallet address of author
  content: string;      // Post text content
  attachments?: {      // Optional media attachments
    type: 'image' | 'link' | 'trade';
    url: string;
    metadata?: any;    // Additional type-specific data
  }[];
  mentions?: string[]; // Array of mentioned wallet addresses
  symbols?: string[];  // Referenced market symbols
  metrics: {
    likes: number;
    comments: number;
    shares: number;
  };
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  postId: string;      // Foreign key to Post
  authorAddress: string;
  content: string;
  parentId?: string;   // For nested comments
  mentions?: string[];
  metrics: {
    likes: number;
    replies: number;
  };
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Interaction {
  id: string;
  type: 'like' | 'share' | 'bookmark';
  userAddress: string; // User who performed the interaction
  targetType: 'post' | 'comment';
  targetId: string;    // ID of post or comment
  createdAt: Date;
}

interface Follow {
  followerAddress: string;  // User following
  followingAddress: string; // User being followed
  createdAt: Date;
}

interface TradeShare {
  id: string;
  postId: string;      // Associated post
  symbol: string;      // Trading pair/symbol
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  platform: string;    // Trading platform used
  verified: boolean;   // Whether trade is verified on-chain
  proofUrl?: string;  // Link to transaction proof
  createdAt: Date;
}
```

## News Feed API Model
```typescript
interface NewsArticle {
  id: string;           // Unique identifier
  title: string;        // Article title
  summary: string;      // Brief summary/description
  content: string;      // Full article content
  source: string;       // News source name
  sourceUrl: string;    // Original article URL
  imageUrl?: string;    // Optional featured image
  categories: string[]; // e.g., ['crypto', 'stocks', 'technology']
  tags: string[];      // Related tags
  sentiment?: 'positive' | 'negative' | 'neutral';
  relatedSymbols?: string[]; // Related crypto/stock symbols
  metrics: {
    views: number;
    shares: number;
    comments: number;
  };
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NewsAPIResponse {
  articles: NewsArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface NewsAPIFilters {
  categories?: string[];
  symbols?: string[];
  sources?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sentiment?: 'positive' | 'negative' | 'neutral';
  searchQuery?: string;
}
```

## Calendar Events
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'crypto' | 'stocks' | 'personal';
  category: string;     // e.g., 'earnings', 'ico', 'conference'
  startDate: Date;
  endDate?: Date;      // Optional for single-day events
  allDay: boolean;
  location?: string;
  url?: string;        // Related link
  relatedSymbols?: string[];
  visibility: 'public' | 'private' | 'followers';
  attendees?: string[];// Array of wallet addresses
  createdBy: string;   // Wallet address of creator
  createdAt: Date;
  updatedAt: Date;
}

// Calendar Sources
enum CalendarSource {
  PERSONAL = 'personal',           // User's personal events
  GOOGLE = 'google_calendar',      // Google Calendar integration
  CRYPTO_EVENTS = 'crypto_events', // Cryptocurrency events API
  EARNINGS = 'earnings_calendar',  // Stock market earnings calendar
  ICO = 'ico_calendar',           // Initial Coin Offerings
}

interface CalendarSourceConfig {
  walletAddress: string;  // User's wallet address
  source: CalendarSource;
  enabled: boolean;
  credentials?: {         // Optional OAuth credentials
    accessToken: string;
    refreshToken: string;
    expiry: Date;
  };
  filters?: {            // Source-specific filters
    calendars?: string[];
    categories?: string[];
    symbols?: string[];
  };
  syncedAt?: Date;       // Last successful sync
  updatedAt: Date;
}
```

## Backend Services Required

1. **User Service**
   - Handle user profile and settings management
   - Wallet address verification
   - Profile picture upload/management
   - Social graph management (follows/followers)

2. **Social Service**
   - Post and comment management
   - Social interactions (likes, shares)
   - Feed generation and pagination
   - Real-time updates via WebSocket

3. **News Service**
   - Aggregate news from multiple sources
   - Filter and categorize articles
   - Sentiment analysis
   - Real-time updates via WebSocket

4. **Calendar Service**
   - Calendar source integration (Google Calendar, etc.)
   - Event aggregation and management
   - Sync management
   - Real-time updates via WebSocket

5. **Storage Service**
   - Handle profile picture storage
   - Post attachment storage
   - CDN integration for media delivery
   - Backup management

6. **Notification Service**
   - Handle all types of notifications
   - Push notification delivery
   - Email notifications
   - In-app notifications

## Data Storage Considerations

1. **Primary Database (PostgreSQL)**
   - User profiles
   - User settings
   - Social interactions
   - Calendar configurations
   - Relational data

2. **Cache Layer (Redis)**
   - Session data
   - Feed caching
   - Frequently accessed user settings
   - Real-time market data cache
   - Rate limiting

3. **Search Engine (Elasticsearch)**
   - News articles
   - Social posts
   - Calendar events
   - Full-text search capabilities

4. **File Storage (S3/CloudFront)**
   - Profile pictures
   - Post attachments
   - News article images
   - Static assets

## API Integration Points

1. **News Sources**
   - CryptoCompare News API
   - CoinGecko News
   - Stock Market News APIs
   - Custom RSS feeds

2. **Calendar Sources**
   - Google Calendar API
   - CoinGecko Events
   - Yahoo Finance Events
   - Custom event feeds

3. **Market Data**
   - TradingView integration
   - CoinGecko API
   - Yahoo Finance API
   - Custom market data providers

4. **Social Integrations**
   - Twitter API (for cross-posting)
   - Discord Webhooks
   - Telegram Bot API
