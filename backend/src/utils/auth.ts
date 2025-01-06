import { sign, verify } from '@noble/ed25519';
import bs58 from 'bs58';

export const generateChallenge = (walletAddress: string): string => {
  const timestamp = new Date().toISOString();
  return `Sign this message to authenticate with your wallet: ${walletAddress}\nTimestamp: ${timestamp}`;
};

export const verifySignature = async (message: string, signature: string, walletAddress: string): Promise<boolean> => {
  try {
    const publicKeyBytes = bs58.decode(walletAddress);
    const signatureBytes = Buffer.from(signature, 'base64');
    const messageBytes = new TextEncoder().encode(message);

    const isValid = await verify(signatureBytes, messageBytes, publicKeyBytes);
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};
