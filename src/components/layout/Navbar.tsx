import React, { useState } from 'react';
import { useWallet } from '../../features/wallet/WalletContext';
import { useNetworkHealth } from '../../hooks/useNetworkHealth';
import { shortenAddress, formatCook, copyToClipboard } from '../../lib/utils';
import { 
  Wallet, 
  Copy, 
  Check, 
  LogOut, 
  ExternalLink, 
  Sparkles, 
  Bot,
  Menu,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenMissions?: () => void;
  onOpenCopilot?: () => void;
  onOpenWalletModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onToggleSidebar, 
  onOpenMissions, 
  onOpenCopilot, 
  onOpenWalletModal 
}) => {
  const { connected, connecting, address, balance, disconnect, isDemoMode, enableDemoMode, isNightlyInstalled } = useWallet();
  const { health } = useNetworkHealth();
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCopy = async () => {
    if (address) {
      await copyToClipboard(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cookie-500/15 bg-dark-950/85 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-slate-300 border border-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cookie-500/20 to-cookie-700/10 border border-cookie-500/30 shadow-cookie-glow">
              <span className="text-2xl">🍪</span>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-cookie-400 to-amber-500 bg-clip-text text-transparent">
                  COOKIEFORGE
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cookie-500/15 text-cookie-300 border border-cookie-500/25">
                  SVM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">Command Center</p>
            </div>
          </div>
        </div>

        {/* Center: Live Chain Status Badge & AI Copilot */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-900 border border-cookie-500/20 text-xs font-mono">
            <span className={`w-2 h-2 rounded-full ${health.status === 'online' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`} />
            <span className="font-semibold text-slate-200">COOKIE CHAIN</span>
            <span className="text-slate-500">|</span>
            <span className="text-cookie-400">Slot #{health.slot.toLocaleString()}</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400">{health.rpcLatencyMs}ms</span>
          </div>

          {onOpenCopilot && (
            <button
              onClick={onOpenCopilot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-cookie-500/15 to-purple-500/15 hover:from-cookie-500/25 hover:to-purple-500/25 border border-cookie-500/30 text-xs font-medium text-cookie-300 transition-colors shadow-cookie-glow"
            >
              <Bot className="w-3.5 h-3.5 text-cookie-400" />
              <span>AI Copilot</span>
            </button>
          )}

          {onOpenMissions && (
            <button
              onClick={onOpenMissions}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cookie-500/10 hover:bg-cookie-500/20 border border-cookie-500/30 text-xs font-medium text-cookie-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cookie-400" />
              <span>Quests</span>
            </button>
          )}
        </div>

        {/* Right: Balance & Nightly Wallet Actions */}
        <div className="flex items-center gap-2.5">
          {connected && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/90 border border-cookie-500/25 text-xs font-mono shadow-inner">
              <span className="text-slate-400 font-sans">Balance:</span>
              <span className="font-bold text-cookie-300">{formatCook(balance)} COOK</span>
            </div>
          )}

          {!connected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={enableDemoMode}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-dark-850 hover:bg-dark-800 border border-slate-700/80 transition-colors"
                title="Preview app with simulated balance"
              >
                Explore Demo
              </button>

              <button
                onClick={onOpenWalletModal}
                disabled={connecting}
                className="relative group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs tracking-wide shadow-cookie-glow transition-all active:scale-95 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{connecting ? 'Connecting...' : 'Connect Nightly'}</span>
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-900 hover:bg-dark-850 border border-cookie-500/30 text-xs font-mono text-slate-200 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{address ? shortenAddress(address) : ''}</span>
                {isDemoMode && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded font-sans">
                    DEMO
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-dark-900 border border-cookie-500/30 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400">Connected to Cookie Chain</p>
                    <p className="text-xs font-bold text-cookie-300 truncate mt-0.5">{address}</p>
                    <p className="text-xs font-mono text-slate-300 mt-1">{formatCook(balance)} COOK</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-dark-800 text-slate-300 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied Address!' : 'Copy Address'}</span>
                    </button>

                    <a
                      href={`https://cookiescan.io/account/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-dark-800 text-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View on CookieScan</span>
                    </a>

                    <button
                      onClick={() => {
                        disconnect();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};