import React, { useState } from 'react';
import { WalletProvider } from './features/wallet/WalletContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NavItemId } from './config/constants';
import { DashboardView } from './features/dashboard/DashboardView';
import { ExplorerView } from './features/explorer/ExplorerView';
import { DasInspectorView } from './features/das/DasInspectorView';
import { PortfolioView } from './features/portfolio/PortfolioView';
import { SendCookView } from './features/transactions/SendCookView';
import { CookieStreamView } from './features/stream/CookieStreamView';
import { ProofOfCookieView } from './features/proof/ProofOfCookieView';
import { ObservatoryView } from './features/network/ObservatoryView';
import { DevTerminalView } from './features/terminal/DevTerminalView';
import { SwapView } from './features/swap/SwapView';
import { QuestsModal } from './features/missions/QuestsModal';
import { CookieCopilotModal } from './features/ai/CookieCopilotModal';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItemId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [questsOpen, setQuestsOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentTab('explore');
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col antialiased selection:bg-cookie-500/30 selection:text-cookie-300">
        
        {/* Top Sticky Command Bar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenMissions={() => setQuestsOpen(true)}
          onOpenCopilot={() => setCopilotOpen(true)}
        />

        {/* Main Shell: Sidebar + Content Workspace */}
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
            {currentTab === 'dashboard' && (
              <DashboardView onNavigate={setCurrentTab} onSearch={handleSearch} />
            )}
            {currentTab === 'explore' && <ExplorerView initialQuery={searchQuery} />}
            {currentTab === 'das' && <DasInspectorView />}
            {currentTab === 'portfolio' && <PortfolioView />}
            {currentTab === 'send' && <SendCookView />}
            {currentTab === 'stream' && <CookieStreamView />}
            {currentTab === 'proof' && <ProofOfCookieView />}
            {currentTab === 'network' && <ObservatoryView />}
            {currentTab === 'terminal' && <DevTerminalView />}
            {currentTab === 'swap' && <SwapView />}
          </main>
        </div>

        {/* Quests / Achievements Modal */}
        <QuestsModal
          isOpen={questsOpen}
          onClose={() => setQuestsOpen(false)}
          onSelectQuest={(tab) => setCurrentTab(tab as NavItemId)}
        />

        {/* Cookie Copilot AI Modal */}
        <CookieCopilotModal
          isOpen={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          onNavigateTab={(tab) => setCurrentTab(tab as NavItemId)}
        />

      </div>
    </WalletProvider>
  );
};