import { subDays } from "date-fns";
import type { SwapTransaction } from "../types";

export const generateSwapTransactions = (
  count: number = 10
): SwapTransaction[] => {
  const transactions: SwapTransaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = subDays(now, i);
    const fromAmount = Math.floor(Math.random() * 1000) + 100;
    const toToken = i % 2 === 0 ? "USDC" : "SOL";
    const rate = toToken === "USDC" ? 0.001 : 0.00001;

    transactions.push({
      id: `swap-${i}`,
      fromToken: "GREENMOVE",
      toToken,
      fromAmount,
      toAmount: parseFloat((fromAmount * rate).toFixed(6)),
      rate,
      timestamp: date,
      status: i === 0 ? "pending" : "completed",
      txHash: `0x${Math.random().toString(16).slice(2)}${Math.random()
        .toString(16)
        .slice(2)}`,
    });
  }

  return transactions;
};

export const mockSwapTransactions = generateSwapTransactions();
