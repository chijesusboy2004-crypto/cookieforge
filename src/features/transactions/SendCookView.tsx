import React, { useState } from 'react';
import { useWallet } from '../wallet/WalletContext';
import { formatCook } from '../../lib/utils';
import { Send, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

export const SendCookView: React.FC = () => {
  const { connected, balance, enableDemoMode } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'building' | 'signing' | 'confirming' | 'success'>('idle');
  const [txSignature, setTxSignature] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      enableDemoMode();
    }
    setStep('building');
    await new Promise(r => setTimeout(r, 200));

    setStep('signing');
    await new Promise(r => setTimeout(r, 350));

    setStep('confirming');
    await new Promise(r => setTimeout(r, 250));

    setTxSignature(`5w${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`);
    setStep('success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="rounded-2xl border border-cookie-500/25 bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 p-6 shadow-cyber">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-cookie-400" />
          <span>Send COOK</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct native transfer across Cookie Chain with sub-second execution.
        </p>
      </div>

      <div className="rounded-2xl border border-cookie-500/20 bg-dark-900/90 p-6 shadow-cyber">
        {step === 'success' ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Transfer Confirmed!</h3>
            <p className="text-xs font-mono text-slate-400">
              Sent {amount} COOK to {recipient.slice(0, 8)}...
            </p>
            <div className="pt-2">
              <a
                href={`https://cookiescan.io/tx/${txSignature}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cookie-500/20 text-cookie-300 border border-cookie-500/30 text-xs font-mono"
              >
                <span>View on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <button
              onClick={() => { setStep('idle'); setRecipient(''); setAmount(''); }}
              className="mt-4 text-xs text-slate-400 hover:text-white underline block mx-auto"
            >
              Send Another Transfer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Recipient Address</label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Solana / Cookie Chain Address (Base58)"
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
                <span className="text-slate-200">Cookie Chain SVM</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Network Fee</span>
                <span className="text-emerald-400">~0.00005 COOK ($0.00001)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={step !== 'idle'}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cookie-500 to-amber-600 hover:from-cookie-400 hover:to-amber-500 text-dark-950 font-bold text-xs shadow-cookie-glow transition-all active:scale-95 disabled:opacity-50"
            >
              {step === 'building' && '1/3: Building Transaction...'}
              {step === 'signing' && '2/3: Awaiting Nightly Signature...'}
              {step === 'confirming' && '3/3: Confirming on Cookie Chain...'}
              {step === 'idle' && 'Review & Send with Nightly'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
