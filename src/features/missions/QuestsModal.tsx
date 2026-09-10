import React, { useState } from 'react';
import { Trophy, CheckCircle2, Circle, X, Sparkles, Zap } from 'lucide-react';

interface QuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuest?: (tabId: string) => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({ isOpen, onClose, onSelectQuest }) => {
  if (!isOpen) return null;

  const [quests, setQuests] = useState([
    { id: '1', title: 'Connect Nightly or Launch Demo', xp: 50, completed: true, tab: 'dashboard' },
    { id: '2', title: 'Run Live Proof-of-Cookie Latency Test', xp: 100, completed: true, tab: 'proof' },
    { id: '3', title: 'Dispatch a Multi-Recipient Cookie Stream', xp: 150, completed: false, tab: 'stream' },
    { id: '4', title: 'Inspect a Digital Asset (DAS)', xp: 100, completed: false, tab: 'das' },
    { id: '5', title: 'Query Dev Terminal CLI ("slot" / "network")', xp: 75, completed: true, tab: 'terminal' },
    { id: '6', title: 'Explore Cookie Chain Explorer Search', xp: 75, completed: false, tab: 'explore' },
  ]);

  const totalXp = quests.filter(q => q.completed).reduce((sum, q) => sum + q.xp, 0);
  const maxPossibleXp = quests.reduce((sum, q) => sum + q.xp, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-dark-900 border border-cookie-500/30 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cookie-500/20 text-cookie-400 border border-cookie-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cookie Quests & Achievements</h3>
              <p className="text-xs font-mono text-slate-400">Complete on-chain actions to verify functionality</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">QUEST PROGRESS</span>
            <span className="text-cookie-300 font-bold">{totalXp} / {maxPossibleXp} XP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-dark-850 overflow-hidden">
            <div
              style={{ width: `${(totalXp / maxPossibleXp) * 100}%` }}
              className="h-full bg-gradient-to-r from-cookie-500 to-amber-400 transition-all duration-500"
            />
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {quests.map(quest => (
            <div
              key={quest.id}
              onClick={() => {
                if (onSelectQuest) onSelectQuest(quest.tab);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-dark-950/50 hover:bg-dark-850 border border-slate-800/80 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {quest.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
                <span className={`text-xs font-medium ${quest.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                  {quest.title}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cookie-500/10 text-cookie-300 border border-cookie-500/20 font-bold">
                +{quest.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
