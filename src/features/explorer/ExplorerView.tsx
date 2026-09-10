import React, { useState } from 'react';
import { Search, Compass, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ExplorerViewProps {
  initialQuery?: string;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searched, setSearched] = useState(!!initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  const isAddress = query.length >= 32 && query.length <= 44;
  const isTx = query.length > 44;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cookie-500/15 border border-cookie-500/30 text-cookie-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-cookie-400" />
            <span>COOKIESCAN EXPLORER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Universal <span className="bg-gradient-to-r from-cookie-400 to-amber-500 bg-clip-text text-transparent">Chain Explorer</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Inspect addresses, smart contracts, transactions, tokens, and slots on Cookie Chain with automatic type resolution.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-dark-900/80 p-6 shadow-cyber">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Address (e.g. 5wQ8...A91), Transaction Signature, or Slot..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs font-mono text-white focus:border-cookie-500/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all"
          >
            Search
          </button>
        </form>

        {searched && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                QUERY TYPE: <strong className="text-cookie-400">{isAddress ? 'ACCOUNT / ADDRESS' : isTx ? 'TRANSACTION SIGNATURE' : 'GENERAL QUERY'}</strong>
              </span>
              <a
                href={isAddress ? `https://cookiescan.io/account/${query}` : `https://cookiescan.io/tx/${query}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cookie-500/10 text-cookie-300 border border-cookie-500/30 text-xs font-mono hover:bg-cookie-500/20"
              >
                <span>Open in CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-dark-950/70 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Identifier:</span>
                <span className="text-slate-200 truncate max-w-md">{query || '5wQ8...A91'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Network:</span>
                <span className="text-emerald-400">Cookie Chain SVM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400">Indexed & Confirmed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
