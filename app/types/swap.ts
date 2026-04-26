export type SwapStatus = "pending" | "completed" | "failed";

export interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: Date;
  status: SwapStatus;
  txHash?: string;
}

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: number;
  decimals: number;
}

export interface SwapRequest {
  fromToken: string;
  toToken: string;
  amount: number;
  slippageTolerance?: number;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  priceImpact: number;
  minimumReceived: number;
  gasEstimate?: number;
}

export interface SwapError {
  code: number;
  message: string;
  details?: string;
}
