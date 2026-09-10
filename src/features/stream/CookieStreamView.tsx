import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import { StreamRecipient } from '../../types';
import { formatCook } from '../../lib/utils';
import { Layers, Plus, Trash2, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send } from 'lucide-react';

export const CookieStreamView: React.FC = () => {
  const { connected, balance, enableDemoMode } = useWallet();
  const [recipients, setRecipients] = useState<StreamRecipient[]>([
    { id: '1', address: '7x4FD2B9A21C8dE7F893aB4C2eF1A9b3D7e8F9aB', amount: '1.0', status: 'pending' },
    { id: '2', address: '8x9D11B7C33aE5E9F103bC5D3eF2B8c4E8e9F1aC', amount: '2.0', status: 'pending' },
    { id: '3', address: '9P2AC3D8E44bF6F0A214cD6E4fF3C9d5F9f0A2bE', amount: '5.0', status: 'pending' },
  ]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionFinished, setExecutionFinished] = useState(false);
  const [totalTimeMs, setTotalTimeMs] = useState<number | null>(null);

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      { id: Date.now().toString(), address: '', amount: '1.0', status: 'pending' },
    ]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    setRecipients(recipients.filter(r => r.id !== id));
  };

  const updateRecipient = (id: string, field: 'address' | 'amount', value: string) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const totalCook = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0);
  const estimatedFee = 0.00005 * recipients.length;

  const handleExecuteStream = async () => {
    if (!connected) {
      enableDemoMode();
    }
    setIsExecuting(true);
    setExecutionFinished(false);
    const start = performance.now();

    // Step by step confirmation animation for each recipient
    for (let i = 0; i < recipients.length; i++) {
      setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'signing' } : r));
      await new Promise(res => setTimeout(res, 220));

      setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'submitted' } : r));
      await new Promise(res => setTimeout(res, 200));

      setRecipients(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'confirmed', signature: '4b' + Math.random().toString(36).substring(2, 8) } : r));
    }

    const duration = Math.round(performance.now() - start);
    setTotalTimeMs(duration);
    setIsExecuting(false);
    setExecutionFinished(true);
  };

  const resetStream = () => {
    setExecutionFinished(false);
    setTotalTimeMs(null);
    setRecipients(recipients.map(r => ({ ...r, status: 'pending', signature: undefined })));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 sm:p-8 shadow-cyber">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cookie-500/15 border border-cookie-500/30 text-cookie-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5 text-cookie-400" />
              <span>ATOMIC MULTI-RECIPIENT DISPATCH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cookie Stream <span className="bg-gradient-to-r from-cookie-400 to-amber-500 bg-clip-text text-transparent">Multi-Sender</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Distribute COOK to multiple community addresses in a single coordinated pipeline. Real-time individual verification on Cookie Chain.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Total Stream Outflow</div>
            <div className="text-2xl font-extrabold font-mono text-cookie-300">
              {formatCook(totalCook)} COOK
            </div>
          </div>
        </div>
      </div>

      {/* Main Recipient Builder */}
      <div className="rounded-2xl border border-cookie-500/20 bg-dark-900/90 p-6 shadow-cyber space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold font-mono text-slate-200">
            RECIPIENT PIPELINE ({recipients.length})
          </h2>
          <button
            onClick={addRecipient}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-850 hover:bg-dark-800 text-xs font-semibold text-cookie-300 border border-cookie-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Recipient</span>
          </button>
        </div>

        <div className="space-y-3">
          {recipients.map((recipient, index) => (
            <div
              key={recipient.id}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl bg-dark-950/70 border border-slate-800/80 hover:border-cookie-500/30 transition-colors"
            >
              <span className="text-xs font-mono text-slate-500 w-6">#{index + 1}</span>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={recipient.address}
                  onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                  placeholder="Recipient Solana/Cookie Address (Base58)"
                  disabled={isExecuting || executionFinished}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono text-slate-200 focus:border-cookie-500/60 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-36 flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={recipient.amount}
                  onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                  placeholder="Amount"
                  disabled={isExecuting || executionFinished}
                  className="w-full px-3 py-2 rounded-lg bg-dark-900 border border-slate-800 text-xs font-mono text-cookie-300 text-right focus:border-cookie-500/60 focus:outline-none"
                />
                <span className="text-xs font-mono text-slate-400">COOK</span>
              </div>

              {/* Status Badge */}
              <div className="w-full sm:w-28 flex justify-end">
                {recipient.status === 'confirmed' ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                  </span>
                ) : recipient.status === 'signing' || recipient.status === 'submitted' ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Pending
                  </span>
                ) : (
                  <button
                    onClick={() => removeRecipient(recipient.id)}
                    disabled={recipients.length <= 1 || isExecuting || executionFinished}
                    className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stream Summary & Execution Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div>Recipients: <span className="text-white font-bold">{recipients.length}</span></div>
            <div>Total: <span className="text-cookie-300 font-bold">{formatCook(totalCook)} COOK</span></div>
            <div>Estimated Fee: <span className="text-emerald-400 font-bold">~{estimatedFee.toFixed(5)} COOK</span></div>
          </div>

          {!executionFinished ? (
            <button
              onClick={handleExecuteStream}
              disabled={isExecuting || totalCook <= 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all active:scale-95 disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Streaming Transfers...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Cookie Stream</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-xs font-mono text-emerald-400 font-bold">
                ✓ COMPLETED IN {totalTimeMs || 814}ms
              </div>
              <button
                onClick={resetStream}
                className="px-4 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-200 border border-slate-700 text-xs font-mono transition-all"
              >
                Reset Stream
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
