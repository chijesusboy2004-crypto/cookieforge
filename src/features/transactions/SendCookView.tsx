import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import { formatCook } from '../../lib/utils';
import { txEngine, TransactionStepUpdate } from '../../services/transactionEngine';
import { Send, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';

export const SendCookView: React.FC = () => {
  const { connected, balance, publicKey, enableDemoMode, isDemoMode } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStepUpdate | null>(null);
  const [completedResult, setCompletedResult] = useState<{ signature: string; slot: number; durationMs: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setCompletedResult(null);

    if (!connected || !publicKey) {
      enableDemoMode();
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.');
      return;
    }

    const validation = txEngine.validateAddress(recipient);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid recipient address.');
      return;
    }

    setIsProcessing(true);

    try {
      const activePubkey = publicKey || validation.pubkey!;
      const tx = await txEngine.buildCookTransfer(activePubkey, recipient, numAmount);

      const result = await txEngine.executePipeline(
        tx,
        (update) => setCurrentStep(update),
        isDemoMode || !window.nightly?.solana
      );

      setCompletedResult(result);
    } catch (err: any) {
      setErrorMessage(err.message || 'Transaction was canceled or failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const stepsList = ['BUILD', 'VALIDATE', 'REVIEW', 'NIGHTLY_SIGN', 'SUBMIT', 'CONFIRM', 'SUCCESS'] as const;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 shadow-cyber">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-cookie-400" />
          <span>Send COOK</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct native transfer across Cookie Chain with sub-second execution & transparent pipeline tracking.
        </p>
      </div>

      <div className="rounded-2xl border border-cookie-500/20 bg-dark-900/90 p-6 shadow-cyber">
        {completedResult ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Transfer Confirmed!</h3>
            <p className="text-xs font-mono text-slate-400">
              Dispatched {amount} COOK in <strong className="text-emerald-400">{completedResult.durationMs}ms</strong> at Slot #{completedResult.slot.toLocaleString()}
            </p>
            <div className="pt-2">
              <a
                href={`https://cookiescan.io/tx/${completedResult.signature}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cookie-500/20 text-cookie-300 border border-cookie-500/30 text-xs font-mono hover:bg-cookie-500/30"
              >
                <span>View on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <button
              onClick={() => { setCompletedResult(null); setCurrentStep(null); setRecipient(''); setAmount(''); }}
              className="mt-4 text-xs text-slate-400 hover:text-white underline block mx-auto font-mono"
            >
              Send Another Transfer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            {/* Visual Pipeline Bar */}
            {isProcessing && currentStep && (
              <div className="p-4 rounded-xl bg-dark-950 border border-cookie-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cookie-300 font-bold flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>{currentStep.step}: {currentStep.message}</span>
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {stepsList.slice(0, 6).map((stepName, i) => {
                    const activeIdx = stepsList.indexOf(currentStep.step as any);
                    const isDone = i < activeIdx;
                    const isCurrent = i === activeIdx;
                    return (
                      <div
                        key={stepName}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isDone
                            ? 'bg-emerald-400'
                            : isCurrent
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Recipient Address</label>
              <input
                type="text"
                required
                disabled={isProcessing}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Cookie Chain / Solana Address (Base58)"
                className="w-full px-4 py-3 rounded-xl bg-dark-950/80 border border-slate-800 text-xs font-mono text-white focus:border-cookie-500/60 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-300">Amount</span>
                <span className="text-slate-400">Available: {formatCook(balance)} COOK</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  required
                  disabled={isProcessing}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 pr-16 rounded-xl bg-dark-950/80 border border-slate-800 text-xs font-mono text-white focus:border-cookie-500/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAmount(Math.max(0, balance - 0.0001).toFixed(4))}
                  className="absolute right-3 top-2.5 px-2 py-1 rounded bg-cookie-500/20 text-cookie-300 text-[10px] font-mono font-bold"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 text-xs font-mono space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Network</span>
                <span className="text-slate-200">Cookie Chain SVM (Sub-Second)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Network Fee</span>
                <span className="text-emerald-400">~0.00005 COOK ($0.00001)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? 'Executing Transaction Pipeline...' : 'Review & Sign with Nightly'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};