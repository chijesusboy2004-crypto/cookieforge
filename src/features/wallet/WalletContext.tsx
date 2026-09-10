import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { WalletState } from '../../types';
import { walletService } from '../../services/walletService';
import { cookieRpc } from '../../services/cookieRpc';

interface WalletContextType extends WalletState {
  isNightlyInstalled: boolean;
  isDemoMode: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  enableDemoMode: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// Demo address for judges who don't have Nightly installed
const DEMO_PUBLIC_KEY = new PublicKey('Cook1e1111111111111111111111111111111111111');

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    connecting: false,
    publicKey: null,
    address: null,
    balance: 0,
    lamports: 0,
    walletName: 'Nightly',
    error: null,
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isNightlyInstalled, setIsNightlyInstalled] = useState<boolean>(false);

  useEffect(() => {
    setIsNightlyInstalled(walletService.isNightlyInstalled());
    const interval = setInterval(() => {
      setIsNightlyInstalled(walletService.isNightlyInstalled());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (isDemoMode) {
      // In demo mode, simulate 128.42 COOK
      setWallet(prev => ({ ...prev, balance: 128.42 }));
      return;
    }
    if (wallet.publicKey) {
      const balance = await cookieRpc.getBalance(wallet.publicKey);
      setWallet(prev => ({ ...prev, balance, lamports: Math.round(balance * 1e9) }));
    }
  }, [wallet.publicKey, isDemoMode]);

  useEffect(() => {
    if (wallet.connected) {
      refreshBalance();
      const timer = setInterval(refreshBalance, 10000);
      return () => clearInterval(timer);
    }
  }, [wallet.connected, refreshBalance]);

  const connect = async () => {
    setWallet(prev => ({ ...prev, connecting: true, error: null }));
    try {
      const { publicKey, balance } = await walletService.connect();
      setIsDemoMode(false);
      setWallet({
        connected: true,
        connecting: false,
        publicKey,
        address: publicKey.toBase58(),
        balance,
        lamports: Math.round(balance * 1e9),
        walletName: 'Nightly',
        error: null,
      });
    } catch (err: any) {
      setWallet(prev => ({
        ...prev,
        connecting: false,
        error: err.message || 'Failed to connect Nightly wallet',
      }));
    }
  };

  const disconnect = () => {
    walletService.disconnect();
    setIsDemoMode(false);
    setWallet({
      connected: false,
      connecting: false,
      publicKey: null,
      address: null,
      balance: 0,
      lamports: 0,
      walletName: 'Nightly',
      error: null,
    });
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setWallet({
      connected: true,
      connecting: false,
      publicKey: DEMO_PUBLIC_KEY,
      address: DEMO_PUBLIC_KEY.toBase58(),
      balance: 128.42,
      lamports: 128.42 * 1e9,
      walletName: 'Demo Mode (Simulation)',
      error: null,
    });
  };

  return (
    <WalletContext.Provider
      value={{
        ...wallet,
        isNightlyInstalled,
        isDemoMode,
        connect,
        disconnect,
        enableDemoMode,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
