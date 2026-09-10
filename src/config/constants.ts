export const COOKIE_CHAIN_CONFIG = {
  name: 'Cookie Chain',
  symbol: 'COOK',
  decimals: 9,
  rpcUrl: 'https://rpc.cookiescan.io',
  wsUrl: 'wss://rpc.cookiescan.io',
  explorerUrl: 'https://cookiescan.io',
  apiUrl: 'https://api.cookiescan.io',
  cookieBoxUrl: 'https://cookiebox.app',
  cookieSwapUrl: 'https://cookieswap.fun',
  docsUrl: 'https://docs.cookiechain.wtf',
  bridgeUrl: 'https://cookiechain.wtf',
  commitment: 'confirmed' as const,
  defaultBlockTimeMs: 100, // Sub-second finality
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: 'Core' },
  { id: 'explore', label: 'Explorer', icon: 'Compass', badge: 'CookieScan' },
  { id: 'das', label: 'DAS Inspector', icon: 'Binary', badge: 'Assets' },
  { id: 'portfolio', label: 'Portfolio', icon: 'Wallet2' },
  { id: 'send', label: 'Send COOK', icon: 'Send' },
  { id: 'stream', label: 'Cookie Stream', icon: 'Layers', badge: 'Multi-Send' },
  { id: 'proof', label: 'Proof-of-Cookie', icon: 'Zap', badge: 'Latency' },
  { id: 'network', label: 'Observatory', icon: 'Activity', badge: 'Telemetry' },
  { id: 'terminal', label: 'Dev Terminal', icon: 'Terminal', badge: 'CLI' },
  { id: 'swap', label: 'CookieSwap', icon: 'ArrowLeftRight' },
  { id: 'missions', label: 'Cookie Quests', icon: 'Trophy', badge: 'XP' },
] as const;

export type NavItemId = typeof NAV_ITEMS[number]['id'];
