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

  // Debug logs
  useEffect(() => {
    console.log('Auth state changed:', {
      isAuthenticated: authState.isAuthenticated,
      walletAddress: authState.walletAddress,
      hasProfile: !!authState.profile,
      hasHeaders: !!authState.headers,
    });
  }, [authState]);

  // Attempt to restore session
  useEffect(() => {
    console.log('Attempting to restore session...');
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        console.log('Found stored auth:', parsed);
        setAuthState(parsed);
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Save auth state changes
  useEffect(() => {
    if (authState.isAuthenticated && authState.headers) {
      console.log('Saving auth state to localStorage');
      localStorage.setItem('auth', JSON.stringify(authState));
    } else {
      console.log('Removing auth state from localStorage');
      localStorage.removeItem('auth');
    }
  }, [authState]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected && authState.isAuthenticated) {
      console.log('Wallet disconnected, logging out');
      logout();
    }
  }, [connected]);

  const login = useCallback(async () => {
    try {
      console.log('Starting login process...');
      if (!publicKey) {
        throw new Error('Wallet not connected');
      }

      const { headers, walletAddress } = await auth.connect();
      console.log('Got auth headers:', headers);
      
      // Try to get existing profile
      try {
        console.log('Fetching profile...');
        const profileResponse = await api.getProfile(headers);
        console.log('Profile found:', profileResponse.data);
        setAuthState({
          isAuthenticated: true,
          walletAddress,
          profile: profileResponse.data,
          headers,
        });
      } catch (error) {
        console.log('No profile found, setting authenticated without profile');
        // No profile yet, but still authenticated
        setAuthState({
          isAuthenticated: true,
          walletAddress,
          profile: null,
          headers,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [publicKey]);

  const logout = useCallback(async () => {
    try {
      console.log('Starting logout process...');
      await auth.disconnect();
      await disconnect();
      setAuthState({
        isAuthenticated: false,
        walletAddress: null,
        profile: null,
        headers: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, [disconnect]);

  const createProfile = useCallback(async (data: { nickname: string; bio: string }) => {
    if (!authState.headers) {
      throw new Error('Not authenticated');
    }

    try {
      console.log('Creating profile:', data);
      const response = await api.createProfile(data, authState.headers);
      console.log('Profile created:', response.data);
      setAuthState(prev => ({
        ...prev,
        profile: response.data,
      }));
    } catch (error) {
      console.error('Create profile error:', error);
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
