import request from 'supertest';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../index';
import prisma from '../services/prisma';

describe('Social Routes', () => {
  // Create test users
  const user1 = Keypair.generate();
  const user2 = Keypair.generate();
  let testPostId: string;

  const createAuthHeaders = async (wallet: Keypair) => {
    const walletAddress = wallet.publicKey.toBase58();
    
    // Get challenge
    const challengeResponse = await request(app)
      .post('/api/v1/auth/challenge')
      .send({ walletAddress });

    const message = challengeResponse.body.data.message;
    
    // Sign message
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, wallet.secretKey);
    const signature = bs58.encode(signatureBytes);

    return {
      'x-wallet-address': walletAddress,
      'x-signature': signature,
      'x-message': Buffer.from(message).toString('base64'),
    };
  };

  beforeAll(async () => {
    // Clean up existing test data
    await prisma.interaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.userProfile.deleteMany({
      where: {
        walletAddress: {
          in: [user1.publicKey.toBase58(), user2.publicKey.toBase58()],
        },
      },
    });

    // Create test profiles
    const headers1 = await createAuthHeaders(user1);
    const profile1Response = await request(app)
      .post('/api/v1/auth/profile')
      .set(headers1)
      .send({
        nickname: 'TestUser1',
        bio: 'Test bio 1',
      });
    // Store user1's profile for reference
    await profile1Response;

    const headers2 = await createAuthHeaders(user2);
    const profile2Response = await request(app)
      .post('/api/v1/auth/profile')
      .set(headers2)
      .send({
        nickname: 'TestUser2',
        bio: 'Test bio 2',
      });
    // Store user2's profile for reference
    await profile2Response;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a post', async () => {
    const headers = await createAuthHeaders(user1);
    const response = await request(app)
      .post('/api/v1/social/posts')
      .set(headers)
      .send({
        content: 'Test post content',
        symbols: ['BTC', 'ETH'],
        mentions: [],
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.content).toBe('Test post content');
    expect(response.body.data.symbols).toEqual(['BTC', 'ETH']);
    expect(response.body.data.author.nickname).toBe('TestUser1');

    testPostId = response.body.data.id;
  });

  it('should get feed posts', async () => {
    const headers = await createAuthHeaders(user1);
    const response = await request(app)
      .get('/api/v1/social/posts')
      .set(headers)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.meta.total).toBeGreaterThan(0);
  });

  it('should add a comment to a post', async () => {
    const headers = await createAuthHeaders(user2);
    const response = await request(app)
      .post(`/api/v1/social/posts/${testPostId}/comments`)
      .set(headers)
      .send({
        content: 'Test comment content',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.content).toBe('Test comment content');
    expect(response.body.data.author.nickname).toBe('TestUser2');
  });

  it('should like and unlike a post', async () => {
    const headers = await createAuthHeaders(user2);
    
    // Like post
    const likeResponse = await request(app)
      .post(`/api/v1/social/posts/${testPostId}/like`)
      .set(headers)
      .expect(200);

    expect(likeResponse.body.success).toBe(true);
    expect(likeResponse.body.data.liked).toBe(true);

    // Get new auth headers for unlike operation
    const newHeaders = await createAuthHeaders(user2);

    // Unlike post
    const unlikeResponse = await request(app)
      .post(`/api/v1/social/posts/${testPostId}/like`)
      .set(newHeaders)
      .expect(200);

    expect(unlikeResponse.body.success).toBe(true);
    expect(unlikeResponse.body.data.liked).toBe(false);
  });

  it('should get a specific post with comments', async () => {
    const headers = await createAuthHeaders(user1);
    const response = await request(app)
      .get(`/api/v1/social/posts/${testPostId}`)
      .set(headers)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBe(testPostId);
    expect(response.body.data.content).toBe('Test post content');
    expect(Array.isArray(response.body.data.commentList)).toBe(true);
    expect(response.body.data.commentList.length).toBeGreaterThan(0);
    expect(response.body.data._count.commentList).toBeGreaterThan(0);
  });
});
