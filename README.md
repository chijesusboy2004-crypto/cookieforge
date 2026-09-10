# 🍪 CookieForge | The Command Center for Cookie Chain SVM

![CookieForge Banner](https://raw.githubusercontent.com/cookieforge/brand/main/banner.png)

> **High-performance portal, universal explorer, multi-recipient stream, Digital Asset Standard (DAS) inspector, and sub-second telemetry terminal built exclusively for Cookie Chain (SVM).**

---

## ⚡ Overview

**CookieForge** was engineered to showcase the full power, sub-second transaction finality, and low-fee micro-execution of **Cookie Chain**, a community-driven Solana Virtual Machine (SVM) network.

Unlike standard explorers or basic wallets, **CookieForge is a complete command center**:
1. **Live SVM Telemetry:** Real-time slot height, block times, and sub-second RPC latency directly connected to `https://rpc.cookiescan.io`.
2. **Proof-of-Cookie Latency Engine:** A live stopwatch that measures true on-chain roundtrip execution time from transaction generation to slot commitment (~680ms).
3. **Cookie Stream (Multi-Send):** Atomic multi-recipient distribution engine that routes COOK to dozens of community addresses with individual on-chain verification.
4. **DAS Asset Inspector:** Deep query tool for compressed NFTs, Token-2022 standards, and metadata trees via `api.cookiescan.io`.
5. **Nightly Wallet Native Support:** Built-in connection state handling, address formatting, balance tracking, and transaction signing.
6. **Interactive Developer Terminal:** Built-in bash-style CLI for developers to query slots, network stats, account balances, and run benchmarks directly from the command line.
7. **Zero-Friction Demo Mode:** Allows evaluators and judges without Nightly installed to explore all features safely with simulated state.

---

## 🏗️ Architecture

```
                                  ┌─────────────────────────────┐
                                  │      Nightly Wallet         │
                                  │  (Solana SVM Provider)      │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COOKIEFORGE CLIENT (SPA)                         │
│  ┌───────────────────┐   ┌────────────────────┐   ┌──────────────────────┐  │
│  │  Command Center   │   │  Proof-of-Cookie   │   │   Cookie Stream      │  │
│  │   (Telemetry)     │   │  (Latency Engine)  │   │   (Multi-Send)       │  │
│  └─────────┬─────────┘   └─────────┬──────────┘   └──────────┬───────────┘  │
│            │                       │                         │              │
│            ▼                       ▼                         ▼              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Cookie RPC & Wallet Service                       │  │
│  │                  (@solana/web3.js + Node Polyfills)                   │  │
│  └─────────────────────────────────┬─────────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    ┌─────────────────────────┐             ┌─────────────────────────┐
    │ Cookie Chain Core RPC   │             │   Cookie DAS API        │
    │  rpc.cookiescan.io      │             │   api.cookiescan.io     │
    │  (Sub-Second SVM)       │             │   (Token-2022 / Assets) │
    └─────────────────────────┘             └─────────────────────────┘
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on v20 & v24)
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/cookieforge.git
cd cookieforge

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to interact with CookieForge.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🍪 Key Features

### 1. ⏱️ Proof-of-Cookie
Measures true round-trip finality on Cookie Chain:
* Step 1: Payload Construction
* Step 2: Nightly Wallet Signature
* Step 3: Broadcast to `rpc.cookiescan.io`
* Step 4: Slot Inclusion & Confirmation
* Displays real-time latency clock, benchmark history, and slot verification.

### 2. 🌊 Cookie Stream (Multi-Recipient Dispatch)
* Add arbitrary recipient addresses
* Configure per-recipient COOK allocations
* Live total calculation and fee estimation
* Sequential atomic execution with live visual status per wallet

### 3. 🛡️ DAS Inspector
* Inspect Token-2022 and Metaplex Digital Asset Standard tokens
* View compression Merkle proofs, authorities, and collection details
* Direct links to `cookiescan.io`

### 4. 💻 Developer CLI Terminal
* Commands: `help`, `wallet`, `balance`, `slot`, `network`, `proof`, `clear`
* Direct interactive access for builders testing on Cookie Chain

---

## 🌐 Ecosystem Links
- **Cookie Chain:** [https://www.cookiechain.wtf](https://www.cookiechain.wtf/)
- **CookieScan Explorer:** [https://cookiescan.io](https://cookiescan.io/)
- **RPC Endpoint:** `https://rpc.cookiescan.io`
- **DAS API:** `https://api.cookiescan.io`
- **CookieSwap:** [https://cookieswap.fun](https://cookieswap.fun/)
- **CookieBox:** [https://cookiebox.app](https://cookiebox.app/)

---

## 📜 License
MIT © 2026 CookieForge Contributors