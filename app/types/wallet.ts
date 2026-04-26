export interface WalletData {
  isConnected: boolean;
  address?: string;
  balance: number;
  tokenSymbol: string;
}

export type WalletConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface WalletError {
  code: number;
  message: string;
  details?: string;
}

export interface TransactionInfo {
  signature: string;
  status: "pending" | "confirmed" | "finalized" | "failed";
  timestamp: Date;
  amount: number;
  token: string;
}

export interface WalletBalance {
  token: string;
  balance: number;
  decimals: number;
  symbol: string;
}
