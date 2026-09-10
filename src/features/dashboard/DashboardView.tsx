import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import { useNetworkHealth } from '../../hooks/useNetworkHealth';
import { formatCook, formatMs, formatNumber } from '../../lib/utils';
import { NavItemId } from '../../config/constants';
import { 
  Zap, 
  Send, 
  Layers, 
  Search, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Timer, 
  ArrowUpRight, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: NavItemId) => void;
  onSearch: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onSearch }) => {
  const { connected, address, balance, connect, enableDemoMode, isDemoMode } = useWallet();
  const { health } = useNetworkHealth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner: Welcome / Status */}
      <div className="relative overflow-hidden rounded-2xl border border-cookie-500/25 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cookie-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cookie-500/15 border border-cookie-500/30 text-cookie-300 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>SUB-SECOND SVM FINALITY ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Cookie Chain <span className="bg-gradient-to-r from-cookie-400 to-amber-500 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              High-throughput terminal for Cookie Chain. Monitor real-time telemetry, execute multi-recipient streams, inspect DAS assets, and measure micro-second finality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!connected ? (
              <>
                <button
                  onClick={connect}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-sm shadow-cookie-glow transition-all active:scale-95"
                >
                  Connect Nightly
                </button>
                <button
                  onClick={enableDemoMode}
                  className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 border border-slate-700 text-sm font-medium transition-all"
                >
                  Launch Demo Mode
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('proof')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cookie-500/20 hover:bg-cookie-500/30 text-cookie-300 border border-cookie-500/40 text-sm font-semibold transition-all shadow-cookie-glow"
                >
                  <Zap className="w-4 h-4 text-cookie-400" />
                  <span>Run Proof-of-Cookie</span>
                </button>
                <button
                  onClick={() => onNavigate('stream')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-slate-700 text-sm font-medium transition-all"
                >
                  <Layers className="w-4 h-4" />
                  <span>Cookie Stream</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Telemetry Display (Exact Mockup Match) */}
      <div className="rounded-2xl border border-cookie-500/20 bg-dark-900/90 backdrop-blur-md p-6 shadow-cyber">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cookie-400" />
            <span className="font-bold text-slate-200 tracking-wider">LIVE SVM TELEMETRY</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HEARTBEAT ACTIVE</span>
          </div>
        </div>

        {/* Top 3 Primary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>CURRENT SLOT</span>
              <Cpu className="w-4 h-4 text-cookie-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
              {health.slot.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Epoch #{health.epoch}</p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>BLOCK TIME</span>
              <Timer className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">
              {formatMs(health.blockTimeMs)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Sub-second SVM finality</p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>RPC LATENCY</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
              {formatMs(health.rpcLatencyMs)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">Endpoint: rpc.cookiescan.io</p>
          </div>
        </div>

        {/* Bottom 3 Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-mono">NETWORK STATUS</p>
              <p className="text-sm font-bold text-slate-200">ONLINE (SVM)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cookie-500 shadow-[0_0_10px_#f59e0b]" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-mono">WALLET BALANCE</p>
              <p className="text-sm font-mono font-bold text-cookie-300">
                {connected ? `${formatCook(balance)} COOK` : 'Not Connected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-mono">THROUGHPUT (TPS)</p>
              <p className="text-sm font-mono font-bold text-cyan-300">~{health.tps} tx/s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/60 p-5 shadow-cyber">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search address, transaction signature, slot, or asset on Cookie Chain..."
            className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-dark-950/80 border border-slate-800 focus:border-cookie-500/60 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-lg bg-cookie-500/20 hover:bg-cookie-500/30 text-cookie-300 border border-cookie-500/40 text-xs font-semibold transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Quick Launchpad Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Proof-of-Cookie */}
        <div 
          onClick={() => onNavigate('proof')}
          className="group cursor-pointer rounded-2xl border border-cookie-500/20 bg-dark-900/80 p-5 hover:border-cookie-500/50 hover:bg-dark-850/90 transition-all shadow-cyber"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cookie-400 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cookie-300 transition-colors">
            Proof-of-Cookie
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Live stop-watch measuring sub-second on-chain confirmation latency directly from signing to slot validation.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>Average: ~700ms</span>
          </div>
        </div>

        {/* Card 2: Cookie Stream */}
        <div 
          onClick={() => onNavigate('stream')}
          className="group cursor-pointer rounded-2xl border border-cookie-500/20 bg-dark-900/80 p-5 hover:border-cookie-500/50 hover:bg-dark-850/90 transition-all shadow-cyber"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-cookie-500/10 border border-cookie-500/20 text-cookie-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cookie-400 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cookie-300 transition-colors">
            Cookie Stream (Multi-Send)
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Distribute COOK to multiple recipients in batch with atomic execution and real-time per-wallet confirmation tracking.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-cookie-300">
            <span>Batch Dispatch Engine</span>
          </div>
        </div>

        {/* Card 3: DAS Asset Inspector */}
        <div 
          onClick={() => onNavigate('das')}
          className="group cursor-pointer rounded-2xl border border-cookie-500/20 bg-dark-900/80 p-5 hover:border-cookie-500/50 hover:bg-dark-850/90 transition-all shadow-cyber"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cookie-400 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-cookie-300 transition-colors">
            DAS Inspector
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Deep Digital Asset Standard inspection for Token-2022, Metaplex NFTs, token authorities, proofs, and metadata.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-purple-400">
            <span>api.cookiescan.io integration</span>
          </div>
        </div>

      </div>

    </div>
  );
};
