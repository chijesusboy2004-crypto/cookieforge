import { PublicKey, Transaction } from '@solana/web3.js';
import { NightlySolanaProvider, WalletState } from '../types';
import { cookieRpc } from './cookieRpc';

declare global {
  interface Window {
    nightly?: {
      solana?: NightlySolanaProvider;
    };
    solana?: any;
  }
}

export class WalletService {
  private static instance: WalletService;

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Check if Nightly wallet is injected into the browser window
   */
  public isNightlyInstalled(): boolean {
    return typeof window !== 'undefined' && !!(window.nightly?.solana || window.solana?.isNightly);
  }

  /**
   * Get the active Solana / Nightly provider
   */
  public getProvider(): any {
    if (typeof window === 'undefined') return null;
    if (window.nightly?.solana) return window.nightly.solana;
    if (window.solana?.isNightly) return window.solana;
    if (window.solana) return window.solana; // Standard Solana provider fallback
    return null;
  }

  /**
   * Connect to Nightly Wallet
   */
  public async connect(): Promise<{ publicKey: PublicKey; balance: number }> {
    const provider = this.getProvider();
    if (!provider) {
      throw new Error('Nightly Wallet not detected. Please install Nightly from nightly.app or explore in Demo Mode.');
    }

    try {
      const resp = await provider.connect();
      const rawPubkey = provider.publicKey || resp?.publicKey;
      if (!rawPubkey) throw new Error('Failed to retrieve public key from wallet');

      const pubkey = rawPubkey instanceof PublicKey ? rawPubkey : new PublicKey(rawPubkey.toString());

      const balance = await cookieRpc.getBalance(pubkey);
      return { publicKey: pubkey, balance };
    } catch (err: any) {
      throw new Error(err.message || 'User rejected wallet connection');
    }
  }

  /**
   * Disconnect wallet
   */
  public async disconnect(): Promise<void> {
    const provider = this.getProvider();
    if (provider && provider.disconnect) {
      try {
        await provider.disconnect();
      } catch (e) {
        // Silently handle
      }
    }
  }

  /**
   * Sign transaction
   */
  public async signTransaction(tx: Transaction): Promise<Transaction> {
    const provider = this.getProvider();
    if (!provider) throw new Error('Wallet not connected');
    return await provider.signTransaction(tx);
  }
}

export const walletService = WalletService.getInstance();