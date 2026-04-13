import { useState } from "react";
import type { SwapTransaction } from "../types";
import { mockSwapTransactions } from "../mock/swap";

interface TokenBalance {
  [key: string]: number;
}

interface ExchangeRates {
  [key: string]: number;
}

interface UseSwapDataReturn {
  fromAmount: string;
  toAmount: string;
  fromToken: string;
  toToken: string;
  isSwapping: boolean;
  tokenBalances: TokenBalance;
  exchangeRates: ExchangeRates;
  swapHistory: SwapTransaction[];
  exchangeRate: number;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  handleSwap: () => void;
}

const MOCK_TOKEN_BALANCES: TokenBalance = {
  GREENMOVE: 1000000,
  SOL: 45.5,
  USDC: 12500,
  USDT: 12800,
};

const MOCK_EXCHANGE_RATES: ExchangeRates = {
  "GREENMOVE-SOL": 0.000045,
  "GREENMOVE-USDC": 0.0125,
  "GREENMOVE-USDT": 0.0128,
  "SOL-GREENMOVE": 22222.22,
  "USDC-GREENMOVE": 80,
  "USDT-GREENMOVE": 78.13,
};

export const useSwapData = (): UseSwapDataReturn => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("GREENMOVE");
  const [toToken, setToToken] = useState("SOL");
  const [isSwapping, setIsSwapping] = useState(false);

  const swapHistory = mockSwapTransactions;

  const getExchangeRate = (): number => {
    const key = `${fromToken}-${toToken}` as keyof typeof MOCK_EXCHANGE_RATES;
    return MOCK_EXCHANGE_RATES[key] || 0;
  };

  const exchangeRate = getExchangeRate();

  const calculateToAmount = (amount: string): string => {
    if (!amount) return "";
    const rate = getExchangeRate();
    return (Number(amount) * rate).toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const handleFromTokenChange = (value: string) => {
    setFromToken(value);
    setToAmount(calculateToAmount(fromAmount));
  };

  const handleToTokenChange = (value: string) => {
    setToToken(value);
    setToAmount(calculateToAmount(fromAmount));
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  return {
    fromAmount,
    toAmount,
    fromToken,
    toToken,
    isSwapping,
    tokenBalances: MOCK_TOKEN_BALANCES,
    exchangeRates: MOCK_EXCHANGE_RATES,
    swapHistory,
    exchangeRate,
    setFromAmount: handleFromAmountChange,
    setToAmount,
    setFromToken: handleFromTokenChange,
    setToToken: handleToTokenChange,
    handleSwap,
  };
};
