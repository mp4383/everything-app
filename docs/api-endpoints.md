# API Endpoints

## User Service
Base URL: `/api/v1/users`

### Profile Management
```
GET    /profile/:walletAddress      # Get user profile
POST   /profile                     # Create profile
PUT    /profile/:walletAddress      # Update profile
POST   /profile/avatar              # Upload avatar
DELETE /profile/:walletAddress      # Delete profile

GET    /settings/:walletAddress     # Get user settings
PUT    /settings/:walletAddress     # Update settings
```

### Social Graph
```
GET    /followers/:walletAddress    # Get user's followers
GET    /following/:walletAddress    # Get accounts user follows
POST   /follow/:walletAddress       # Follow user
DELETE /follow/:walletAddress       # Unfollow user
```

## Social Service
Base URL: `/api/v1/social`

### Posts
```
GET    /posts                       # Get feed posts (with filters)
GET    /posts/:id                   # Get specific post
POST   /posts                       # Create post
PUT    /posts/:id                   # Edit post
DELETE /posts/:id                   # Delete post

GET    /posts/user/:walletAddress   # Get user's posts
GET    /posts/trending              # Get trending posts
GET    /posts/symbol/:symbol        # Get posts for market symbol
```

### Comments
```
GET    /posts/:postId/comments      # Get post comments
POST   /posts/:postId/comments      # Add comment
PUT    /comments/:id                # Edit comment
DELETE /comments/:id                # Delete comment
```

### Interactions
```
POST   /posts/:id/like             # Like post
DELETE /posts/:id/like             # Unlike post
POST   /posts/:id/share            # Share post
POST   /posts/:id/bookmark         # Bookmark post
DELETE /posts/:id/bookmark         # Remove bookmark
```

### Trade Sharing
```
POST   /trades                     # Share trade
GET    /trades/user/:walletAddress # Get user's shared trades
DELETE /trades/:id                 # Delete trade share
```

## News Service
Base URL: `/api/v1/news`

### Articles
```
GET    /articles                   # Get news articles (with filters)
GET    /articles/:id              # Get specific article
GET    /articles/trending         # Get trending articles
GET    /articles/symbol/:symbol   # Get articles for market symbol

GET    /sources                   # Get available news sources
PUT    /sources/preferences      # Update source preferences
```

### Interactions
```
POST   /articles/:id/share       # Share article
POST   /articles/:id/bookmark    # Bookmark article
DELETE /articles/:id/bookmark    # Remove bookmark
```

## Calendar Service
Base URL: `/api/v1/calendar`

### Events
```
GET    /events                   # Get calendar events (with filters)
POST   /events                   # Create event
PUT    /events/:id              # Update event
DELETE /events/:id              # Delete event

GET    /events/user/:walletAddress # Get user's events
GET    /events/symbol/:symbol   # Get events for market symbol
```

### Calendar Sources
```
GET    /sources                 # Get available calendar sources
POST   /sources/connect        # Connect calendar source
DELETE /sources/:id            # Disconnect calendar source
PUT    /sources/:id/settings   # Update source settings
```

## Notification Service
Base URL: `/api/v1/notifications`

```
GET    /notifications          # Get user notifications
PUT    /notifications/:id      # Mark notification as read
DELETE /notifications/:id      # Delete notification

PUT    /settings              # Update notification settings
POST   /subscribe             # Subscribe to push notifications
DELETE /unsubscribe          # Unsubscribe from push notifications
```

## WebSocket Endpoints
Base URL: `wss://api.example.com/ws/v1`

```
/feed                         # Real-time social feed updates
/market                       # Real-time market data
/notifications               # Real-time notifications
```

## Authentication & Authorization

All endpoints require authentication via:
1. Wallet signature verification
2. JWT token in Authorization header

### Example Authentication Flow
```
POST   /auth/challenge       # Get challenge message
POST   /auth/verify         # Verify signed challenge
POST   /auth/token          # Get JWT token
POST   /auth/refresh        # Refresh JWT token
```

## Rate Limiting

- Basic tier: 100 requests per minute
- Premium tier: 1000 requests per minute
- WebSocket connections: 1 per user

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      // Additional error details
    }
  }
}
```

## Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field and direction (e.g., "createdAt:desc")
- `search`: Search query string
- `filter`: JSON encoded filter object
- `include`: Related data to include (comma separated)

## Versioning

API versioning is handled through:
1. URL path versioning (e.g., `/api/v1/`)
2. Accept header: `Accept: application/vnd.api.v1+json`
