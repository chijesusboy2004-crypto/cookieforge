import React, { useState } from 'react';
import { Binary, Search, ShieldCheck, ExternalLink, Sparkles, Database } from 'lucide-react';

export const DasInspectorView: React.FC = () => {
  const [assetId, setAssetId] = useState('');
  const [inspected, setInspected] = useState(false);

  const sampleAsset = {
    id: assetId || 'CookiePuff#4821',
    name: 'CookiePuff Pioneer #4821',
    symbol: 'PUFF',
    owner: '7x4FD2B9A21C8dE7F893aB4C2eF1A9b3D7e8F9aB',
    creator: 'CookieDAO Authority',
    collection: 'Cookie Chain Genesis Citizens',
    standard: 'Token-2022 / Metaplex Core',
    mutable: false,
    supply: 1,
    decimals: 0,
    compression: {
      compressed: true,
      dataHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      creatorHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    },
  };

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    setInspected(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Binary className="w-3.5 h-3.5 text-purple-400" />
            <span>DIGITAL ASSET STANDARD (DAS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            DAS Asset <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">Inspector</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Query compressed NFTs, Token-2022 assets, and metadata trees directly through Cookie Chain's DAS API (api.cookiescan.io).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-dark-900/80 p-6 shadow-cyber space-y-6">
        <form onSubmit={handleInspect} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="Enter Asset ID / Mint Address / Owner..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-950/90 border border-slate-800 text-xs font-mono text-white focus:border-purple-500/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Inspect DAS
          </button>
        </form>

        {(inspected || !assetId) && (
          <div className="rounded-xl bg-dark-950/80 border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cookie-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
                  🍪
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{sampleAsset.name}</h3>
                  <p className="text-xs font-mono text-purple-400">{sampleAsset.collection}</p>
                </div>
              </div>

              <a
                href="https://cookiescan.io"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-700 text-xs font-mono self-start"
              >
                <span>Open in CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
                <span className="text-slate-500">Asset Standard</span>
                <p className="text-slate-200 font-bold">{sampleAsset.standard}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
                <span className="text-slate-500">Compression State</span>
                <p className="text-emerald-400 font-bold">State Compression Enabled</p>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
                <span className="text-slate-500">Owner</span>
                <p className="text-slate-300 truncate">{sampleAsset.owner}</p>
              </div>

              <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800 space-y-1">
                <span className="text-slate-500">Authority</span>
                <p className="text-slate-300 truncate">{sampleAsset.creator}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-dark-900/60 border border-purple-500/20 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Database className="w-4 h-4" />
                <span>DAS Merkle Proof & Hashes</span>
              </div>
              <div className="text-slate-400 break-all">
                Data Hash: <span className="text-slate-200">{sampleAsset.compression.dataHash}</span>
              </div>
              <div className="text-slate-400 break-all">
                Creator Hash: <span className="text-slate-200">{sampleAsset.compression.creatorHash}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
