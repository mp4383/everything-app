import { PublicKey } from '@solana/web3.js';

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array, encoding: string) => Promise<{
    signature: Uint8Array;
    publicKey: PublicKey;
  }>;
}

export interface AuthHeaders {
  'x-wallet-address': string;
  'x-signature': string;
  'x-message': string;
}

export interface Profile {
  id: string;
  userId: string;
  nickname: string;
  bio: string;
  avatarUrl?: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  walletAddress: string | null;
  profile: Profile | null;
  headers: AuthHeaders | null;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: Profile;
  symbols?: string[];
  mentions?: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: Profile;
  postId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}
