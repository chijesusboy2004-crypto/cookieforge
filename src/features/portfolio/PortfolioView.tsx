import React from 'react';
import { useWallet } from '../wallet/WalletContext';
import { formatCook } from '../../lib/utils';
import { Wallet2, Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { connected, address, balance } = useWallet();

  const mockTokens = [
    { symbol: 'COOK', name: 'Cookie Chain Native', balance: formatCook(balance), usdValue: '$128.42', change: '+4.2%' },
    { symbol: 'CBOX', name: 'CookieBox Governance', balance: '2,400.00', usdValue: '$48.00', change: '+12.5%' },
    { symbol: 'CSWAP', name: 'CookieSwap LP Token', balance: '150.50', usdValue: '$75.25', change: '-1.2%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cookie-400 uppercase tracking-wider">Cookie Chain Assets</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Portfolio & Treasury</h1>
            <p className="text-xs font-mono text-slate-400 mt-1">{connected ? address : 'Connect wallet to view live balances'}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-slate-400">Total Net Worth</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {connected ? '$251.67 USD' : '$0.00'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-dark-900/80 p-6 shadow-cyber space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-200">TOKEN ASSETS</h3>
        <div className="divide-y divide-slate-800">
          {mockTokens.map((token) => (
            <div key={token.symbol} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-dark-850 border border-slate-800 flex items-center justify-center font-bold text-cookie-300 text-xs font-mono">
                  {token.symbol.slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{token.symbol}</h4>
                  <p className="text-[11px] text-slate-400">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-slate-200">{token.balance} {token.symbol}</p>
                <p className="text-[11px] font-mono text-slate-500">{token.usdValue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
