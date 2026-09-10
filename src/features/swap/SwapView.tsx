import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import { formatCook } from '../../lib/utils';
import { ArrowLeftRight, ArrowDown, ExternalLink, RefreshCw } from 'lucide-react';

export const SwapView: React.FC = () => {
  const { connected, balance, enableDemoMode } = useWallet();
  const [fromAmount, setFromAmount] = useState('10');
  const [swapping, setSwapping] = useState(false);
  const [swapped, setSwapped] = useState(false);

  const toAmount = (parseFloat(fromAmount) || 0) * 18.5;

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) enableDemoMode();
    setSwapping(true);
    await new Promise(r => setTimeout(r, 700));
    setSwapping(false);
    setSwapped(true);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 shadow-cyber">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-cookie-400" />
              <span>CookieSwap Terminal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Direct liquidity routing via cookieswap.fun</p>
          </div>
          <a
            href="https://cookieswap.fun"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cookie-400 hover:text-cookie-300 flex items-center gap-1 font-mono"
          >
            <span>cookieswap.fun</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-cookie-500/20 bg-dark-900/90 p-6 shadow-cyber space-y-4">
        {/* From Box */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>YOU PAY</span>
            <span>Balance: {formatCook(balance)} COOK</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 bg-transparent text-xl font-mono font-bold text-white focus:outline-none"
            />
            <span className="px-3 py-1.5 rounded-lg bg-cookie-500/20 text-cookie-300 font-bold font-mono text-xs">
              COOK
            </span>
          </div>
        </div>

        {/* Divider icon */}
        <div className="flex justify-center -my-2">
          <div className="p-2 rounded-full bg-dark-850 border border-slate-700 text-cookie-400">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* To Box */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800">
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
            <span>YOU RECEIVE (ESTIMATED)</span>
            <span>Route: Direct Pool</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={toAmount ? toAmount.toFixed(2) : '0.00'}
              className="flex-1 bg-transparent text-xl font-mono font-bold text-emerald-400 focus:outline-none"
            />
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono text-xs">
              CBOX
            </span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={swapping}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all active:scale-95 disabled:opacity-50"
        >
          {swapping ? 'Submitting Swap to Cookie Chain...' : swapped ? 'Swap Completed Successfully!' : 'Execute Swap on CookieSwap'}
        </button>
      </div>
    </div>
  );
};
