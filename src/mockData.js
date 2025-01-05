export const mockPosts = [
  {
    id: 1,
    author: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    content: "Just deployed my first Solana smart contract! #blockchain #development",
    timestamp: "2024-01-10T15:30:00Z",
    likes: 12
  },
  {
    id: 2,
    author: "0x123d35Cc6634C0532925a3b844Bc454e4438f123",
    content: "Anyone interested in collaborating on a DeFi project? Looking for developers!",
    timestamp: "2024-01-10T14:20:00Z",
    likes: 8
  },
  {
    id: 3,
    author: "0x456d35Cc6634C0532925a3b844Bc454e4438f456",
    content: "Great community meetup today! Thanks everyone who joined. #community",
    timestamp: "2024-01-10T12:15:00Z",
    likes: 15
  }
];

export const mockNews = [
  {
    id: 1,
    title: "Bitcoin Surges Past Previous Resistance Level",
    source: "CryptoNews",
    url: "#",
    timestamp: "2024-01-10T16:00:00Z",
    summary: "Bitcoin shows strong momentum as it breaks through key resistance levels..."
  },
  {
    id: 2,
    title: "New Solana DeFi Protocol Gains Traction",
    source: "BlockchainDaily",
    url: "#",
    timestamp: "2024-01-10T15:45:00Z",
    summary: "A new DeFi protocol on Solana has attracted significant attention..."
  },
  {
    id: 3,
    title: "Tech Stocks Rally Continues",
    source: "MarketWatch",
    url: "#",
    timestamp: "2024-01-10T15:30:00Z",
    summary: "Major tech stocks continue their upward trend as market sentiment improves..."
  }
];

export const mockCryptoData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 42000.50,
    change24h: 2.5,
    marketCap: "800B"
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 2250.75,
    change24h: 1.8,
    marketCap: "270B"
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 85.20,
    change24h: 4.2,
    marketCap: "35B"
  }
];

export const mockStockData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 185.50,
    change24h: 0.8,
    marketCap: "3T"
  },
  {
    symbol: "MSFT",
    name: "Microsoft",
    price: 375.20,
    change24h: 1.2,
    marketCap: "2.8T"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.75,
    change24h: -0.5,
    marketCap: "1.8T"
  }
];

export const mockGroupChats = [
  {
    id: 1,
    name: "DeFi Developers",
    lastMessage: "Anyone up for testing the new protocol?",
    timestamp: "2024-01-10T15:55:00Z",
    unread: 3,
    participants: 12
  },
  {
    id: 2,
    name: "Solana Trading",
    lastMessage: "Looking bullish on the 4h chart",
    timestamp: "2024-01-10T15:45:00Z",
    unread: 0,
    participants: 156
  },
  {
    id: 3,
    name: "NFT Collectors",
    lastMessage: "New drop coming this weekend",
    timestamp: "2024-01-10T15:30:00Z",
    unread: 5,
    participants: 89
  }
];

export const mockAiChat = [
  {
    id: 1,
    role: "user",
    content: "What's your analysis of the current market conditions?",
    timestamp: "2024-01-10T15:50:00Z"
  },
  {
    id: 2,
    role: "assistant",
    content: "Based on recent data, we're seeing strong momentum in both crypto and traditional markets. Bitcoin's break above resistance suggests continued bullish sentiment, while tech stocks maintain their upward trend. Key metrics to watch include...",
    timestamp: "2024-01-10T15:50:05Z"
  },
  {
    id: 3,
    role: "user",
    content: "Any specific trading opportunities you've identified?",
    timestamp: "2024-01-10T15:51:00Z"
  },
  {
    id: 4,
    role: "assistant",
    content: "Several altcoins are showing promising setups, particularly in the DeFi sector. Additionally, keep an eye on AI-related stocks as they've been outperforming the broader market...",
    timestamp: "2024-01-10T15:51:05Z"
  }
];

export const mockTickers = [
  { symbol: "BTC", price: "42,000.50", change: "+2.5%" },
  { symbol: "ETH", price: "2,250.75", change: "+1.8%" },
  { symbol: "SOL", price: "85.20", change: "+4.2%" },
  { symbol: "AAPL", price: "185.50", change: "+0.8%" },
  { symbol: "MSFT", price: "375.20", change: "+1.2%" },
  { symbol: "GOOGL", price: "142.75", change: "-0.5%" }
];

export const mockCalendarEvents = [
  {
    id: 1,
    date: "2024-01-10",
    events: [
      {
        id: 1,
        time: "09:00",
        title: "Team Standup",
        type: "meeting",
        description: "Daily team sync and progress updates"
      },
      {
        id: 2,
        time: "11:30",
        title: "DeFi Protocol Launch",
        type: "event",
        description: "New yield farming protocol goes live"
      },
      {
        id: 3,
        time: "14:00",
        title: "Market Analysis Call",
        type: "meeting",
        description: "Weekly market review with trading team"
      },
      {
        id: 4,
        time: "16:30",
        title: "NFT Collection Mint",
        type: "event",
        description: "Limited edition community NFT launch"
      }
    ]
  },
  {
    id: 2,
    date: "2024-01-11",
    events: [
      {
        id: 5,
        time: "10:00",
        title: "Community AMA",
        type: "event",
        description: "Monthly ask-me-anything session"
      },
      {
        id: 6,
        time: "13:00",
        title: "Technical Workshop",
        type: "meeting",
        description: "Smart contract security best practices"
      },
      {
        id: 7,
        time: "15:30",
        title: "Governance Vote",
        type: "event",
        description: "Protocol parameter adjustment proposal"
      }
    ]
  },
  {
    id: 3,
    date: "2024-01-12",
    events: [
      {
        id: 8,
        time: "09:30",
        title: "Product Review",
        type: "meeting",
        description: "New feature planning and roadmap"
      },
      {
        id: 9,
        time: "12:00",
        title: "Token Distribution",
        type: "event",
        description: "Monthly community rewards distribution"
      },
      {
        id: 10,
        time: "16:00",
        title: "Developer Meetup",
        type: "event",
        description: "Local blockchain developer networking"
      }
    ]
  }
];
