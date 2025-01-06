import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.$transaction([
    prisma.calendarEvent.deleteMany(),
    prisma.tradeShare.deleteMany(),
    prisma.interaction.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.userSettings.deleteMany(),
    prisma.userProfile.deleteMany(),
  ]);

  // Create test users
  const user1 = await prisma.userProfile.create({
    data: {
      walletAddress: '8YUUdGdFQxaEPR4YLRBAjHeLFJ3HNzWtPJGUA4Zc5Nfo',
      nickname: 'CryptoWhale',
      bio: 'Crypto enthusiast and trader',
      avatarUrl: 'https://example.com/avatars/1.jpg',
      settings: {
        create: {
          cryptoWatchlist: ['BTC', 'ETH', 'SOL'],
          stockWatchlist: ['AAPL', 'TSLA'],
        },
      },
    },
  });

  const user2 = await prisma.userProfile.create({
    data: {
      walletAddress: '6Kn6PKuZKD1YUJpKxB6yEZ49ZZGmqpPuGtLAzS2xGf4B',
      nickname: 'TechTrader',
      bio: 'Full-time stock trader',
      avatarUrl: 'https://example.com/avatars/2.jpg',
      settings: {
        create: {
          cryptoWatchlist: ['BTC', 'ETH'],
          stockWatchlist: ['MSFT', 'GOOGL', 'AMZN'],
        },
      },
    },
  });

  // Create follow relationship
  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id,
    },
  });

  // Update follower counts
  await prisma.userProfile.update({
    where: { id: user1.id },
    data: { followerCount: 1 },
  });
  await prisma.userProfile.update({
    where: { id: user2.id },
    data: { followingCount: 1 },
  });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      authorId: user1.id,
      content: 'Just bought some $BTC! The market is looking bullish 🚀',
      symbols: ['BTC'],
      mentions: [],
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: user2.id,
      content: 'Great earnings report from $AAPL today!',
      symbols: ['AAPL'],
      mentions: [user1.walletAddress],
      tradeShare: {
        create: {
          authorId: user2.id,
          symbol: 'AAPL',
          type: 'buy',
          amount: 10,
          price: 150.50,
          platform: 'NYSE',
          verified: true,
        },
      },
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: user2.id,
      content: 'Great move! The technical analysis looks promising.',
    },
  });

  // Create interactions
  await prisma.interaction.create({
    data: {
      type: 'like',
      userId: user2.id,
      targetType: 'post',
      postId: post1.id,
    },
  });

  // Create calendar events
  await prisma.calendarEvent.create({
    data: {
      title: 'Bitcoin Halving',
      description: 'The next Bitcoin halving event',
      type: 'crypto',
      category: 'event',
      startDate: new Date('2024-04-01'),
      symbols: ['BTC'],
      createdById: user1.id,
    },
  });

  // Update post counts
  await prisma.userProfile.update({
    where: { id: user1.id },
    data: { postCount: 1 },
  });
  await prisma.userProfile.update({
    where: { id: user2.id },
    data: { postCount: 1 },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
