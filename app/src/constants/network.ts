export const NETWORK_MOCK = "mock" as const;
export const NETWORK_LOCALNET = "localnet" as const;
export const NETWORK_TESTNET = "testnet" as const;

export type NetworkType =
  | typeof NETWORK_MOCK
  | typeof NETWORK_LOCALNET
  | typeof NETWORK_TESTNET;

export const SOLANA_RPC_ENDPOINTS: Record<NetworkType, string> = {
  [NETWORK_MOCK]: "",
  [NETWORK_LOCALNET]: "http://127.0.0.1:8899",
  [NETWORK_TESTNET]: "https://api.devnet.solana.com",
};

export const SOLANA_WS_ENDPOINTS: Record<NetworkType, string> = {
  [NETWORK_MOCK]: "",
  [NETWORK_LOCALNET]: "ws://127.0.0.1:8900",
  [NETWORK_TESTNET]: "wss://api.devnet.solana.com",
};

export const NETWORK_LABELS: Record<NetworkType, string> = {
  [NETWORK_MOCK]: "Mock",
  [NETWORK_LOCALNET]: "Local",
  [NETWORK_TESTNET]: "Testnet",
};

export const NETWORK_COLORS: Record<NetworkType, string> = {
  [NETWORK_MOCK]: "bg-gray-500",
  [NETWORK_LOCALNET]: "bg-emerald-500",
  [NETWORK_TESTNET]: "bg-purple-500",
};
