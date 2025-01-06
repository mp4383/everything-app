import axios from 'axios';
import { PhantomProvider } from '../types';

const API_URL = 'http://localhost:3001/api/v1';

// Get Phantom provider
const getProvider = (): PhantomProvider | undefined => {
  if ('phantom' in window) {
    const provider = (window as any).phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return undefined;
};

// Get auth headers
const getAuthHeaders = async (message: string, signature: string, walletAddress: string) => {
  return {
    'x-wallet-address': walletAddress,
    'x-signature': signature,
    'x-message': Buffer.from(message).toString('base64'),
  };
};

// API Service
export const api = {
  // Auth
  getChallenge: async (walletAddress: string) => {
    console.log('Getting challenge for wallet:', walletAddress);
    try {
      const response = await axios.post(`${API_URL}/auth/challenge`, { walletAddress });
      console.log('Challenge response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Challenge error:', error);
      throw error;
    }
  },

  verifySignature: async (walletAddress: string, signature: string, message: string) => {
    console.log('Verifying signature for wallet:', walletAddress);
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, {
        walletAddress,
        signature,
        message,
      });
      console.log('Verify response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Verify error:', error);
      throw error;
    }
  },

  createProfile: async (data: { nickname: string; bio: string }, headers: any) => {
    console.log('Creating profile:', data);
    try {
      const response = await axios.post(`${API_URL}/auth/profile`, data, { headers });
      console.log('Create profile response:', response.data);
      return response;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  },

  getProfile: async (headers: any) => {
    console.log('Getting profile');
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, { headers });
      console.log('Get profile response:', response.data);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};

// Auth helper
export const auth = {
  connect: async () => {
    try {
      console.log('Starting auth connection...');
      const provider = getProvider();
      if (!provider) throw new Error('Phantom wallet not found');

      console.log('Connecting to wallet...');
      const resp = await provider.connect();
      const walletAddress = resp.publicKey.toString();
      console.log('Connected to wallet:', walletAddress);

      // Get challenge
      console.log('Getting challenge...');
      const { message } = await api.getChallenge(walletAddress);
      console.log('Got challenge message:', message);

      // Sign message
      console.log('Signing message...');
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
      const signature = Buffer.from(signedMessage.signature).toString('base64');
      console.log('Message signed');

      // Verify signature
      console.log('Verifying signature...');
      const verifyResponse = await api.verifySignature(walletAddress, signature, message);
      console.log('Signature verified');

      // Get auth headers
      console.log('Getting auth headers...');
      const headers = await getAuthHeaders(message, signature, walletAddress);
      console.log('Auth headers created:', headers);

      return { headers, walletAddress };
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  },

  disconnect: async () => {
    console.log('Disconnecting...');
    const provider = getProvider();
    if (provider) {
      await provider.disconnect();
      console.log('Disconnected from wallet');
    }
  },
};
