import { PublicKey, Transaction } from '@solana/web3.js';

export interface NetworkHealth {
  status: 'online' | 'degraded' | 'offline';
  slot: number;
  blockHeight: number;
  blockTimeMs: number;
  rpcLatencyMs: number;
  tps: number;
  epoch: number;
  lastChecked: number;
}

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  address: string | null;
  balance: number; // in COOK
  lamports: number;
  walletName: string;
  error: string | null;
}

export interface NightlySolanaProvider {
  publicKey: PublicKey | null;
  isConnected: boolean;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
}

export interface StreamRecipient {
  id: string;
  address: string;
  amount: string;
  status: 'pending' | 'signing' | 'submitted' | 'confirmed' | 'failed';
  error?: string;
  signature?: string;
}

export interface ProofRecord {
  id: string;
  timestamp: number;
  durationMs: number;
  slot: number;
  signature: string;
  status: 'confirmed' | 'failed';
}

export interface SearchResult {
  query: string;
  type: 'address' | 'tx' | 'block' | 'unknown';
  valid: boolean;
  data?: any;
}
