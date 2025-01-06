import request from 'supertest';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../index';
import prisma from '../services/prisma';

describe('Auth Routes', () => {
  // Create a test wallet
  const wallet = Keypair.generate();
  const walletAddress = wallet.publicKey.toBase58();

  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.userProfile.deleteMany({
      where: {
        walletAddress,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should get a challenge message', async () => {
    const response = await request(app)
      .post('/api/v1/auth/challenge')
      .send({ walletAddress })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.message).toBeDefined();
    expect(response.body.data.message).toContain(walletAddress);
  });

  it('should create a profile', async () => {
    // First get a challenge message
    const challengeResponse = await request(app)
      .post('/api/v1/auth/challenge')
      .send({ walletAddress });

    const message = challengeResponse.body.data.message;
    
    // Sign the message
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, wallet.secretKey);
    const signature = bs58.encode(signatureBytes);

    // Create profile with the signature
    const profileData = {
      nickname: 'TestUser',
      bio: 'Test bio',
      avatarUrl: 'https://example.com/avatar.jpg',
    };

    const response = await request(app)
      .post('/api/v1/auth/profile')
      .set('x-wallet-address', walletAddress)
      .set('x-signature', signature)
      .set('x-message', Buffer.from(message).toString('base64'))
      .send(profileData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.nickname).toBe(profileData.nickname);
    expect(response.body.data.walletAddress).toBe(walletAddress);
  });

  it('should get the profile', async () => {
    // First get a new challenge message
    const challengeResponse = await request(app)
      .post('/api/v1/auth/challenge')
      .send({ walletAddress });

    const message = challengeResponse.body.data.message;
    
    // Sign the message
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, wallet.secretKey);
    const signature = bs58.encode(signatureBytes);

    // Get profile
    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('x-wallet-address', walletAddress)
      .set('x-signature', signature)
      .set('x-message', Buffer.from(message).toString('base64'))
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.walletAddress).toBe(walletAddress);
    expect(response.body.data.settings).toBeDefined();
  });
});
