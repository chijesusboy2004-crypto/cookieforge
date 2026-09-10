import React, { useState, useEffect } from 'react';
import { Search, Compass, ExternalLink, ArrowRight, CheckCircle2, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { cookieScan, AccountReport, TransactionReport } from '../../services/cookieScanService';
import { shortenAddress, formatCook } from '../../lib/utils';

interface ExplorerViewProps {
  initialQuery?: string;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [accountData, setAccountData] = useState<AccountReport | null>(null);
  const [txData, setTxData] = useState<TransactionReport | null>(null);
  const [detectedType, setDetectedType] = useState<string>('');

  const executeSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setAccountData(null);
    setTxData(null);

    const type = cookieScan.detectQueryType(searchTerm);
    setDetectedType(type);

    try {
      if (type === 'address') {
        const report = await cookieScan.getAddressDetails(searchTerm.trim());
        setAccountData(report);
      } else if (type === 'tx') {
        const report = await cookieScan.getTransactionDetails(searchTerm.trim());
        setTxData(report);
      } else {
        // Default to address lookup fallback
        const report = await cookieScan.getAddressDetails(searchTerm.trim());
        setAccountData(report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cookie-500/15 border border-cookie-500/30 text-cookie-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-cookie-400" />
            <span>COOKIESCAN UNIVERSAL EXPLORER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Universal <span className="bg-gradient-to-r from-cookie-400 to-amber-500 bg-clip-text text-transparent">Chain Explorer</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Real-time on-chain search for Cookie Chain accounts, transaction signatures, smart contracts, and slots.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-dark-900/80 p-6 shadow-cyber space-y-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Address (e.g. 7x4F...9A2), Transaction Signature, or Slot..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs font-mono text-white focus:border-cookie-500/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>

        {/* Account Data View */}
        {accountData && (
          <div className="rounded-xl bg-dark-950/80 border border-slate-800 p-6 space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-cookie-500/10 text-cookie-400 border border-cookie-500/25">
                  ACCOUNT / WALLET
                </span>
                <h3 className="text-sm sm:text-base font-bold font-mono text-white mt-1 break-all">
                  {accountData.address}
                </h3>
              </div>
              <a
                href={`https://cookiescan.io/account/${accountData.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 text-xs font-mono self-start"
              >
                <span>View on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <span className="text-slate-500">COOK BALANCE</span>
                <p className="text-lg font-bold text-cookie-300 mt-1">{formatCook(accountData.cookBalance)} COOK</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <span className="text-slate-500">PROGRAM OWNER</span>
                <p className="text-xs font-bold text-slate-300 truncate mt-1">{accountData.owner}</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800">
                <span className="text-slate-500">EXECUTABLE CODE</span>
                <p className="text-xs font-bold text-emerald-400 mt-1">{accountData.executable ? 'Program (Yes)' : 'Standard Account (No)'}</p>
              </div>
            </div>

            {accountData.signatures && accountData.signatures.length > 0 && (
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cookie-400" />
                  <span>RECENT ON-CHAIN SIGNATURES</span>
                </h4>
                <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden">
                  {accountData.signatures.map((sig, idx) => (
                    <div key={idx} className="p-3 bg-dark-900/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-cookie-300">{shortenAddress(sig.signature, 8)}</span>
                      <span className="text-slate-400">Slot #{sig.slot?.toLocaleString()}</span>
                      <span className="text-emerald-400 font-bold">Confirmed</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Transaction Data View */}
        {txData && (
          <div className="rounded-xl bg-dark-950/80 border border-slate-800 p-6 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cookie-400 font-bold">TRANSACTION REPORT</span>
              <span className="text-xs font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                STATUS: {txData.status.toUpperCase()}
              </span>
            </div>
            <div className="text-xs font-mono space-y-2 text-slate-300">
              <div>Signature: <strong className="text-white break-all">{txData.signature}</strong></div>
              <div>Slot: <strong className="text-white">#{txData.slot.toLocaleString()}</strong></div>
              <div>Fee: <strong className="text-emerald-400">{txData.fee} COOK</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};