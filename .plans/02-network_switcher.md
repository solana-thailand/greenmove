# 02 - Network Switcher (Mock / Testnet)

## Status: ✅ Done

## Goal
Add a UI toggle to switch between mock data and Solana testnet for the entire app.

## Changes

### New Files
- `app/src/constants/network.ts` - Network type constants, RPC/WS endpoints, labels, colors
- `app/src/stores/networkStore.ts` - Zustand store: `network`, `rpcEndpoint`, `wsEndpoint`, `isMock`, `setNetwork`
- `app/src/components/ui/NetworkSwitcher.tsx` - Toggle button group (Mock | Testnet) with Live badge

### Modified Files
- `app/src/constants/index.ts` - Re-export `./network`
- `app/src/stores/index.ts` - Export `useNetworkStore`
- `app/src/components/ui/index.ts` - Export `NetworkSwitcher`
- `app/src/components/layout/Header.tsx` - Add `<NetworkSwitcher />` next to wallet button
- `app/src/components/layout/Sidebar.tsx` - Add `<NetworkSwitcher />` above wallet button
- `app/src/hooks/useDashboardData.ts` - Reads `isMock`/`rpcEndpoint` from store; fetches from RPC when testnet
- `app/src/hooks/useBlockchainData.ts` - Same pattern
- `app/src/hooks/useKYCData.ts` - Same pattern
- `app/src/hooks/useSwapData.ts` - Same pattern

## Architecture

```
NetworkSwitcher (UI) ──> useNetworkStore (zustand)
                              │
                              ├── network: "mock" | "testnet"
                              ├── rpcEndpoint: string
                              ├── wsEndpoint: string
                              ├── isMock: boolean
                              └── setNetwork()
                              
Each hook checks isMock:
  - true  → return mock data (existing behavior)
  - false → fetch from Solana RPC endpoint
```

## Build
- `vite build` ✅
- Dev server ✅