import React from 'react';
import { NavItemId, NAV_ITEMS } from '../../config/constants';
import { 
  LayoutDashboard, 
  Compass, 
  Binary, 
  Wallet2, 
  Send, 
  Layers, 
  Zap, 
  Activity, 
  Terminal, 
  ArrowLeftRight, 
  Trophy,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavItemId;
  onSelectTab: (tab: NavItemId) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Compass: <Compass className="w-4 h-4" />,
  Binary: <Binary className="w-4 h-4" />,
  Wallet2: <Wallet2 className="w-4 h-4" />,
  Send: <Send className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  ArrowLeftRight: <ArrowLeftRight className="w-4 h-4" />,
  Trophy: <Trophy className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 z-40 flex flex-col h-[calc(100vh-4rem)] w-64 border-r border-cookie-500/15 bg-dark-950/95 lg:bg-dark-950/50 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-cookie-500/15 text-cookie-300 border border-cookie-500/30 shadow-cookie-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors ${isActive ? 'text-cookie-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {ICONS_MAP[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </div>

                {'badge' in item && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-cookie-500/25 text-cookie-200 border border-cookie-500/40'
                        : 'bg-dark-850 text-slate-500 group-hover:text-slate-400 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer ecosystem links */}
        <div className="p-3 border-t border-slate-850 bg-dark-950/80">
          <div className="p-2.5 rounded-xl bg-dark-900/60 border border-cookie-500/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SVM RPC</span>
              <span className="text-emerald-400 font-semibold">rpc.cookiescan.io</span>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
              <a
                href="https://cookiescan.io"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cookie-400 flex items-center gap-1 transition-colors"
              >
                <span>CookieScan</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <a
                href="https://docs.cookiechain.wtf"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cookie-400 flex items-center gap-1 transition-colors"
              >
                <span>Docs</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
