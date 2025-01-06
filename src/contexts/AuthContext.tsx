import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { auth, api } from '../services/api';
import { AuthState, Profile, AuthHeaders } from '../types';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (data: { nickname: string; bio: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { connected, publicKey, disconnect } = useWallet();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    walletAddress: null,
    profile: null,
    headers: null,
  });

  // Attempt to restore session
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        setAuthState(parsed);
      } catch (error) {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Save auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.headers) {
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      localStorage.removeItem('auth');
    }
  }, [authState]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected && authState.isAuthenticated) {
      logout();
    }
  }, [connected]);

  const login = useCallback(async () => {
    try {
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      const { headers, walletAddress } = await auth.connect();
      
      // Try to get existing profile
      try {
        const profileResponse = await api.getProfile(headers);
        setAuthState({
          isAuthenticated: true,
          walletAddress,
          profile: profileResponse.data.data,
          headers,
        });
      } catch (error) {
        // No profile yet, but still authenticated
        setAuthState({
          isAuthenticated: true,
          walletAddress,
          profile: null,
          headers,
        });
      }
    } catch (error) {
      throw error;
    }
  }, [publicKey]);

  const logout = useCallback(async () => {
    try {
      await auth.disconnect();
      await disconnect();
      setAuthState({
        isAuthenticated: false,
        walletAddress: null,
        profile: null,
        headers: null,
      });
    } catch (error) {
      throw error;
    }
  }, [disconnect]);

  const createProfile = useCallback(async (data: { nickname: string; bio: string }) => {
    if (!authState.headers) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await api.createProfile(data, authState.headers);
      setAuthState(prev => ({
        ...prev,
        profile: response.data.data,
      }));
    } catch (error) {
      throw error;
    }
  }, [authState.headers]);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      createProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export default AuthProvider;
