import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, ShieldCheck, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useWallet } from '../wallet/WalletContext';
import { formatCook } from '../../lib/utils';

interface CookieCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  actionProposal?: {
    type: 'send' | 'proof' | 'stream' | 'explore';
    label: string;
    details: string;
  };
}

export const CookieCopilotModal: React.FC<CookieCopilotModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  if (!isOpen) return null;

  const { balance, address, connected } = useWallet();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Cookie Copilot, your on-chain AI assistant for Cookie Chain SVM. I can diagnose transaction simulation errors, explain gas fee mechanics, or formulate structured transaction payloads for you to review and sign with Nightly.",
    },
  ]);

  const quickPrompts = [
    'Why did my transaction fail?',
    'Explain sub-second finality',
    'Prepare 5 COOK transfer',
    'Check network health',
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setInput('');

    const lower = query.toLowerCase();

    setTimeout(() => {
      if (lower.includes('fail') || lower.includes('error')) {
        newMessages.push({
          role: 'assistant',
          content: `### 🔍 On-Chain Error Diagnostics
Common reasons for failed transactions on Cookie Chain SVM:
1. **Insufficient Balance for Rent/Fees:** Even though Cookie Chain fees are tiny (~0.00005 COOK), your account must hold enough to cover both transfer amount + minimum account rent exemption (~0.00089 COOK).
2. **Blockhash Expired:** In high-speed SVM chains, blockhashes expire in ~150 slots (~60-90 seconds).
3. **Slippage Exceeded:** On CookieSwap pools, high volatility can cause swaps to revert if minimum output tokens are not received.`,
        });
      } else if (lower.includes('finality') || lower.includes('sub-second')) {
        newMessages.push({
          role: 'assistant',
          content: `### ⚡ Cookie Chain Sub-Second Finality
Cookie Chain utilizes the **Solana Virtual Machine (SVM)** architecture with:
* **~100ms Block Times** (compared to Ethereum's 12 seconds or Bitcoin's 10 minutes).
* **Parallel Transaction Execution (Sealevel):** Non-overlapping transactions execute simultaneously on multi-core validators.
* **Proof-of-History Clock:** Deterministic slot timestamps eliminate slow multi-round consensus delays.`,
          actionProposal: {
            type: 'proof',
            label: 'Run Proof-of-Cookie Benchmark',
            details: 'Measure actual live latency with the stopwatch',
          },
        });
      } else if (lower.includes('transfer') || lower.includes('send') || lower.includes('5 cook')) {
        newMessages.push({
          role: 'assistant',
          content: `I have prepared a structured transaction for human review:\n\n* **Asset:** COOK (Native SVM)\n* **Amount:** 5.0 COOK\n* **Estimated Fee:** ~0.00005 COOK\n* **Status:** Ready for human review (AI never signs directly)`,
          actionProposal: {
            type: 'send',
            label: 'Open Transfer in Send Terminal',
            details: 'Pre-fills 5 COOK in Send window for your review',
          },
        });
      } else {
        newMessages.push({
          role: 'assistant',
          content: `Cookie Chain is operating normally. Your connected wallet balance is **${formatCook(balance)} COOK**. You can test live on-chain operations using the Proof-of-Cookie latency engine or the Cookie Stream multi-sender.`,
        });
      }
      setMessages([...newMessages]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-dark-900 border border-cookie-500/35 p-6 shadow-2xl space-y-4 flex flex-col h-[560px]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cookie-500/20 to-amber-500/10 border border-cookie-500/30 text-cookie-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Cookie Copilot</h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cookie-500/20 text-cookie-300 border border-cookie-500/30">
                  AI ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Structured SVM Diagnostics & Payloads</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full bg-dark-950 border border-slate-800 hover:border-cookie-500/40 text-slate-300 hover:text-cookie-300 whitespace-nowrap transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cookie-500/20 border border-cookie-500/30 text-cookie-100 font-mono'
                    : 'bg-dark-950/80 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Structured Action Proposal (Strict Human-in-the-Loop) */}
                {m.actionProposal && (
                  <div className="mt-3 p-3 rounded-lg bg-dark-900 border border-cookie-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-cookie-400 font-bold font-mono text-[11px]">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PROPOSED ON-CHAIN ACTION</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">{m.actionProposal.details}</p>
                    <button
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab(m.actionProposal!.type);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-cookie-500/20 hover:bg-cookie-500/30 text-cookie-300 border border-cookie-500/40 font-bold text-[11px] transition-all"
                    >
                      <span>{m.actionProposal.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about Cookie Chain, gas fees, or error codes..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-xs font-mono text-white focus:border-cookie-500/60 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cookie-500 hover:bg-cookie-400 text-dark-950 font-bold transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};