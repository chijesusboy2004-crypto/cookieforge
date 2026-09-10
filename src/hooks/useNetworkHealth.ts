import { useState, useEffect } from 'react';
import { NetworkHealth } from '../types';
import { cookieRpc } from '../services/cookieRpc';

export function useNetworkHealth(refreshIntervalMs = 3500) {
  const [health, setHealth] = useState<NetworkHealth>({
    status: 'online',
    slot: 4821392,
    blockHeight: 4821392,
    blockTimeMs: 91,
    rpcLatencyMs: 47,
    tps: 840,
    epoch: 684,
    lastChecked: Date.now(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHealth = async () => {
      try {
        const data = await cookieRpc.getNetworkHealth();
        if (mounted) {
          setHealth(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, refreshIntervalMs);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [refreshIntervalMs]);

  return { health, loading };
}
