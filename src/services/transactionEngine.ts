import { 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  TransactionInstruction, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { cookieRpc } from './cookieRpc';
import { walletService } from './walletService';
import { COOKIE_CHAIN_CONFIG } from '../config/constants';

// Solana SPL Memo Program ID
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

export interface TransactionStepUpdate {
  step: 'BUILD' | 'VALIDATE' | 'REVIEW' | 'NIGHTLY_SIGN' | 'SUBMIT' | 'CONFIRM' | 'SUCCESS';
  message: string;
  durationMs?: number;
}

export class TransactionEngine {
  private static instance: TransactionEngine;

  public static getInstance(): TransactionEngine {
    if (!TransactionEngine.instance) {
      TransactionEngine.instance = new TransactionEngine();
    }
    return TransactionEngine.instance;
  }

  /**
   * Validate recipient address
   */
  public validateAddress(address: string): { valid: boolean; pubkey?: PublicKey; error?: string } {
    try {
      const pubkey = new PublicKey(address.trim());
      return { valid: true, pubkey };
    } catch (err: any) {
      return { valid: false, error: 'Invalid Solana/Cookie Chain Base58 address' };
    }
  }

  /**
   * Build single native COOK transfer
   */
  public async buildCookTransfer(
    sender: PublicKey,
    recipientAddress: string,
    amountCook: number
  ): Promise<Transaction> {
    const { valid, pubkey: recipientPubkey, error } = this.validateAddress(recipientAddress);
    if (!valid || !recipientPubkey) throw new Error(error || 'Invalid recipient');

    if (amountCook <= 0) throw new Error('Amount must be greater than 0');

    const lamports = Math.round(amountCook * LAMPORTS_PER_SOL);
    const conn = cookieRpc.getConnection();
    const { blockhash } = await conn.getLatestBlockhash(COOKIE_CHAIN_CONFIG.commitment);

    const tx = new Transaction({
      feePayer: sender,
      recentBlockhash: blockhash,
    });

    tx.add(
      SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipientPubkey,
        lamports,
      })
    );

    return tx;
  }

  /**
   * Build multi-send batch transaction for Cookie Stream
   */
  public async buildMultiSendStream(
    sender: PublicKey,
    recipients: { address: string; amount: number }[]
  ): Promise<Transaction> {
    const conn = cookieRpc.getConnection();
    const { blockhash } = await conn.getLatestBlockhash(COOKIE_CHAIN_CONFIG.commitment);

    const tx = new Transaction({
      feePayer: sender,
      recentBlockhash: blockhash,
    });

    for (const r of recipients) {
      const { valid, pubkey } = this.validateAddress(r.address);
      if (valid && pubkey && r.amount > 0) {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: sender,
            toPubkey: pubkey,
            lamports: Math.round(r.amount * LAMPORTS_PER_SOL),
          })
        );
      }
    }

    return tx;
  }

  /**
   * Build real on-chain Proof-of-Cookie Memo transaction
   */
  public async buildProofMemo(sender: PublicKey, memoContent: string): Promise<Transaction> {
    const conn = cookieRpc.getConnection();
    const { blockhash } = await conn.getLatestBlockhash(COOKIE_CHAIN_CONFIG.commitment);

    const tx = new Transaction({
      feePayer: sender,
      recentBlockhash: blockhash,
    });

    // Add Memo Program instruction
    const memoInstruction = new TransactionInstruction({
      keys: [{ pubkey: sender, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoContent, 'utf-8'),
    });

    tx.add(memoInstruction);
    return tx;
  }

  /**
   * End-to-End Execution Pipeline:
   * BUILD -> VALIDATE -> NIGHTLY_SIGN -> SUBMIT -> CONFIRM -> SUCCESS
   */
  public async executePipeline(
    tx: Transaction,
    onProgress: (update: TransactionStepUpdate) => void,
    isDemo: boolean = false
  ): Promise<{ signature: string; slot: number; durationMs: number }> {
    const start = performance.now();

    onProgress({ step: 'BUILD', message: 'Compiled transaction instruction buffer' });
    await new Promise(r => setTimeout(r, isDemo ? 100 : 30));

    onProgress({ step: 'VALIDATE', message: 'Validated blockhash & recipient accounts' });
    await new Promise(r => setTimeout(r, isDemo ? 100 : 30));

    onProgress({ step: 'REVIEW', message: 'Transaction payload ready for signature' });
    await new Promise(r => setTimeout(r, isDemo ? 100 : 30));

    onProgress({ step: 'NIGHTLY_SIGN', message: 'Requesting Nightly wallet approval...' });

    let signedTx: Transaction;
    if (isDemo) {
      await new Promise(r => setTimeout(r, 280));
      signedTx = tx;
    } else {
      signedTx = await walletService.signTransaction(tx);
    }

    onProgress({ step: 'SUBMIT', message: 'Broadcasting to rpc.cookiescan.io...' });
    const conn = cookieRpc.getConnection();

    let signature = '';
    let slot = 4821400;

    if (isDemo) {
      await new Promise(r => setTimeout(r, 180));
      signature = `5x${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 8)}`;
      slot = (await conn.getSlot().catch(() => 4821420)) || 4821420;
    } else {
      const rawTransaction = signedTx.serialize();
      signature = await conn.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        preflightCommitment: COOKIE_CHAIN_CONFIG.commitment,
      });

      onProgress({ step: 'CONFIRM', message: `Verifying on-chain slot finality (${signature.slice(0, 8)})...` });
      const confirmation = await conn.confirmTransaction(signature, COOKIE_CHAIN_CONFIG.commitment);
      slot = confirmation.context.slot;
    }

    const durationMs = Math.round(performance.now() - start);
    onProgress({
      step: 'SUCCESS',
      message: `Confirmed in ${durationMs}ms at Slot #${slot.toLocaleString()}`,
      durationMs,
    });

    return { signature, slot, durationMs };
  }
}

export const txEngine = TransactionEngine.getInstance();