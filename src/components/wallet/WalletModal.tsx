import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useWallet } from '../../features/wallet/WalletContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { connect, enableDemoMode, isNightlyInstalled, error } = useWallet();

  const handleConnectNightly = async () => {
    if (isNightlyInstalled) {
      await connect();
      onClose();
    } else {
      window.open('https://nightly.app/', '_blank');
    }
  };

  const handleLaunchDemo = () => {
    enableDemoMode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-dark-900 border border-cookie-500/35 p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍪</span>
            <div>
              <h3 className="text-base font-bold text-white">Connect to Cookie Chain</h3>
              <p className="text-xs font-mono text-slate-400">SVM Wallet & Demo Provider</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {/* Nightly Wallet (Required by Bounty) */}
          <div
            onClick={handleConnectNightly}
            className="flex items-center justify-between p-4 rounded-xl bg-dark-950/80 hover:bg-dark-850 border border-cookie-500/30 hover:border-cookie-500/60 cursor-pointer transition-all shadow-cookie-glow group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cookie-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                N
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-cookie-300 transition-colors">
                    Nightly Wallet
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cookie-500/20 text-cookie-300 border border-cookie-500/30">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isNightlyInstalled ? 'Detected in browser. Click to connect.' : 'Click to install from nightly.app'}
                </p>
              </div>
            </div>

            {isNightlyInstalled ? (
              <span className="text-xs font-mono text-emerald-400 font-bold">Connect</span>
            ) : (
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cookie-400 transition-colors" />
            )}
          </div>

          {/* Demo Mode for Evaluators & Judges */}
          <div
            onClick={handleLaunchDemo}
            className="flex items-center justify-between p-4 rounded-xl bg-dark-950/60 hover:bg-dark-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-800 border border-slate-700 flex items-center justify-center text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                    Explore Demo Mode
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-dark-800 text-slate-400 border border-slate-700">
                    SIMULATION
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Test all features with 128.42 simulated COOK (Zero wallet required)
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-cookie-400 font-bold group-hover:translate-x-0.5 transition-transform">
              Launch &rarr;
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[11px] font-mono text-slate-500">
            Cookie Chain SVM &bull; rpc.cookiescan.io &bull; Sub-Second Finality
          </p>
        </div>

      </div>
    </div>
  );
};