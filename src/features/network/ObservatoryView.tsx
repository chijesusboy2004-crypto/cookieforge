import React from 'react';
import { useNetworkHealth } from '../../hooks/useNetworkHealth';
import { formatMs } from '../../lib/utils';
import { Activity, Cpu, Server, Timer, ShieldCheck, ExternalLink } from 'lucide-react';

export const ObservatoryView: React.FC = () => {
  const { health } = useNetworkHealth();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>REAL-TIME SVM TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Network <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Observatory</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Live telemetry, block times, and validator metrics direct from Cookie Chain SVM infrastructure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-dark-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>SLOT HEIGHT</span>
            <Cpu className="w-4 h-4 text-cookie-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white">#{health.slot.toLocaleString()}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Block #{health.blockHeight.toLocaleString()}</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-dark-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>BLOCK DURATION</span>
            <Timer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">{formatMs(health.blockTimeMs)}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Sub-second slot commitment</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-dark-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>RPC LATENCY</span>
            <Server className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-300">{formatMs(health.rpcLatencyMs)}</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">rpc.cookiescan.io</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-dark-900/80 p-5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>EST. THROUGHPUT</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300">~{health.tps} TPS</div>
          <p className="text-[11px] text-slate-500 mt-1 font-mono">Parallel SVM execution</p>
        </div>
      </div>

      {/* Latency Wave Chart Visualization */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/80 p-6 shadow-cyber">
        <h3 className="text-sm font-mono font-bold text-slate-200 mb-4 flex items-center justify-between">
          <span>RPC RESPONSE LATENCY (MS)</span>
          <span className="text-xs text-emerald-400 font-normal">STABLE (Avg: 47ms)</span>
        </h3>

        <div className="h-40 flex items-end gap-2 pt-6 border-b border-slate-800 pb-2">
          {[42, 45, 51, 48, 44, 49, 43, 47, 50, 46, 42, 48, 45, 47, 44, 46, 52, 45, 43, 47].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                style={{ height: `${val * 1.8}px` }}
                className="w-full rounded-t bg-gradient-to-t from-cookie-600/30 to-amber-400/80 group-hover:to-emerald-400 transition-all"
              />
              <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-300">{val}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
          <span>-60 SECONDS</span>
          <span>NOW</span>
        </div>
      </div>
    </div>
  );
};
