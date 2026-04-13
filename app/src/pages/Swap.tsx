import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { ArrowRightLeft, History, RefreshCw } from "lucide-react";

interface SwapTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  received: number;
  timestamp: string;
  status: "completed" | "pending";
}

function Swap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState("GREENMOVE");
  const [toToken, setToToken] = useState("SOL");
  const [isSwapping, setIsSwapping] = useState(false);

  const tokenBalances = {
    GREENMOVE: 1000000,
    SOL: 45.5,
    USDC: 12500,
    USDT: 12800,
  };

  const exchangeRates = {
    "GREENMOVE-SOL": 0.000045,
    "GREENMOVE-USDC": 0.0125,
    "GREENMOVE-USDT": 0.0128,
  };

  const swapHistory: SwapTransaction[] = [
    {
      id: "swap-1",
      from: "GREENMOVE",
      to: "SOL",
      amount: 50000,
      received: 2.25,
      timestamp: "2025-01-10T14:30:00Z",
      status: "completed",
    },
    {
      id: "swap-2",
      from: "GREENMOVE",
      to: "USDC",
      amount: 100000,
      received: 1250,
      timestamp: "2025-01-08T09:15:00Z",
      status: "completed",
    },
  ];

  const getExchangeRate = () => {
    const key = `${fromToken}-${toToken}` as keyof typeof exchangeRates;
    return exchangeRates[key] || 0;
  };

  const calculateToAmount = (amount: string) => {
    if (!amount) return "";
    const rate = getExchangeRate();
    return (Number(amount) * rate).toFixed(6);
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    setToAmount(calculateToAmount(value));
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setFromAmount("");
      setToAmount("");
    }, 2000);
  };

  const rate = getExchangeRate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Token Swap
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Swap Tokens</CardTitle>
              <CardDescription>
                Exchange GREENMOVE tokens for other cryptocurrencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    From
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Balance:{" "}
                    {tokenBalances[
                      fromToken as keyof typeof tokenBalances
                    ]?.toLocaleString()}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="number"
                    value={fromAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleFromAmountChange(e.target.value)
                    }
                    placeholder="0.00"
                    className="text-lg"
                  />
                  <Select
                    value={fromToken}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFromToken(e.target.value);
                      setToAmount(calculateToAmount(fromAmount));
                    }}
                    options={[
                      { value: "GREENMOVE", label: "GREENMOVE" },
                      { value: "SOL", label: "SOL" },
                      { value: "USDC", label: "USDC" },
                      { value: "USDT", label: "USDT" },
                    ]}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    To
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Balance:{" "}
                    {tokenBalances[
                      toToken as keyof typeof tokenBalances
                    ]?.toLocaleString()}
                  </span>
                </div>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    type="number"
                    value={toAmount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setToAmount(e.target.value)
                    }
                    placeholder="0.00"
                    className="text-lg"
                    disabled
                  />
                  <Select
                    value={toToken}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setToToken(e.target.value);
                      setToAmount(calculateToAmount(fromAmount));
                    }}
                    options={[
                      { value: "SOL", label: "SOL" },
                      { value: "USDC", label: "USDC" },
                      { value: "USDT", label: "USDT" },
                      { value: "GREENMOVE", label: "GREENMOVE" },
                    ]}
                  />
                </div>
              </div>

              {rate > 0 && (
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Exchange Rate
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      1 {fromToken} = {rate} {toToken}
                    </span>
                  </div>
                </div>
              )}

              <Button
                className="w-full"
                disabled={!fromAmount || isSwapping}
                onClick={handleSwap}
              >
                {isSwapping ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap Now"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Swaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {swapHistory.map((swap) => (
                  <div
                    key={swap.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {swap.amount.toLocaleString()} {swap.from}
                        </span>
                        <ArrowRightLeft className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {swap.received} {swap.to}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(swap.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {swap.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Swap;
