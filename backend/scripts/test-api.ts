import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

// Create test wallet
const wallet = Keypair.generate();
const walletAddress = wallet.publicKey.toBase58();

async function getAuthHeaders() {
  // Get challenge
  const challengeResponse = await axios.post(`${API_URL}/auth/challenge`, {
    walletAddress
  });
  const message = challengeResponse.data.data.message;

  // Sign message
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, wallet.secretKey);
  const signature = bs58.encode(signatureBytes);

  return {
    'x-wallet-address': walletAddress,
    'x-signature': signature,
    'x-message': Buffer.from(message).toString('base64'),
  };
}

async function testAPI() {
  try {
    // Create profile
    const headers = await getAuthHeaders();
    const profileResponse = await axios.post(
      `${API_URL}/auth/profile`,
      {
        nickname: 'TestUser',
        bio: 'Testing the API',
      },
      { headers }
    );
    console.log('Profile created:', profileResponse.data);

    // Create post
    const newHeaders = await getAuthHeaders(); // Get fresh headers
    const postResponse = await axios.post(
      `${API_URL}/social/posts`,
      {
        content: 'Test post content',
        symbols: ['BTC', 'ETH'],
        mentions: [],
      },
      { headers: newHeaders }
    );
    console.log('Post created:', postResponse.data);
    const postId = postResponse.data.data.id;

    // Add comment
    const commentHeaders = await getAuthHeaders();
    const commentResponse = await axios.post(
      `${API_URL}/social/posts/${postId}/comments`,
      {
        content: 'Test comment',
      },
      { headers: commentHeaders }
    );
    console.log('Comment added:', commentResponse.data);

    // Like post
    const likeHeaders = await getAuthHeaders();
    const likeResponse = await axios.post(
      `${API_URL}/social/posts/${postId}/like`,
      {},
      { headers: likeHeaders }
    );
    console.log('Post liked:', likeResponse.data);

    // Unlike post
    const unlikeHeaders = await getAuthHeaders();
    const unlikeResponse = await axios.post(
      `${API_URL}/social/posts/${postId}/like`,
      {},
      { headers: unlikeHeaders }
    );
    console.log('Post unliked:', unlikeResponse.data);

    // Add nested comment
    const nestedCommentHeaders = await getAuthHeaders();
    const nestedCommentResponse = await axios.post(
      `${API_URL}/social/posts/${postId}/comments`,
      {
        content: 'Nested comment test',
        parentId: commentResponse.data.data.id,
      },
      { headers: nestedCommentHeaders }
    );
    console.log('Nested comment added:', nestedCommentResponse.data);

    // Get feed
    const feedHeaders = await getAuthHeaders();
    const feedResponse = await axios.get(
      `${API_URL}/social/posts`,
      { headers: feedHeaders }
    );
    console.log('Feed posts:', feedResponse.data);

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error:', error);
    }
  }
}

testAPI();
