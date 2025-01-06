import { PublicKey } from '@solana/web3.js';
import { sign } from 'tweetnacl';
import { decode as base58Decode } from 'bs58';

export const generateChallenge = (walletAddress: string): string => {
  const timestamp = new Date().toISOString();
  return `Sign this message to authenticate with Everything App.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
};

export const verifySignature = (message: string, signature: string, walletAddress: string): boolean => {
  try {
    // Convert the message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);

    // Convert the signature from base64 to Uint8Array
    const signatureBytes = Buffer.from(signature, 'base64');

    // Convert the public key from base58 to Uint8Array
    const publicKeyBytes = base58Decode(walletAddress);

    // Verify the signature
    return sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

export const validateWalletAddress = (walletAddress: string): boolean => {
  try {
    new PublicKey(walletAddress);
    return true;
  } catch {
    return false;
  }
};
