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
    'x-message': btoa(message),
  };
};

// API Service
export const api = {
  // Auth
  getChallenge: async (walletAddress: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/challenge`, { walletAddress });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifySignature: async (walletAddress: string, signature: string, message: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, {
        walletAddress,
        signature,
        message,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProfile: async (data: { nickname: string; bio: string }, headers: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/profile`, data, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (headers: any) => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, { headers });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Auth helper
export const auth = {
  connect: async () => {
    try {
      const provider = getProvider();
      if (!provider) throw new Error('Phantom wallet not found');

      const resp = await provider.connect();
      const walletAddress = resp.publicKey.toString();

      // Get challenge
      const { message } = await api.getChallenge(walletAddress);

      // Sign message
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
      const signature = btoa(String.fromCharCode(...signedMessage.signature));

      // Verify signature
      await api.verifySignature(walletAddress, signature, message);

      // Get auth headers
      const headers = await getAuthHeaders(message, signature, walletAddress);

      return { headers, walletAddress };
    } catch (error) {
      throw error;
    }
  },

  disconnect: async () => {
    const provider = getProvider();
    if (provider) {
      await provider.disconnect();
    }
  },
};
