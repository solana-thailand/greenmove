import { useState, useEffect, useMemo } from "react";
import { mockDashboardData } from "../mock/dashboard";
import { useNetworkStore } from "../stores/networkStore";

export function useDashboardData() {
  const { isMock, rpcEndpoint } = useNetworkStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testnetData, setTestnetData] = useState<{
    totalSupply: number;
    totalSolarGeneration: number;
    totalTokensMinted: number;
    solarTrend: Array<{ date: string; value: number }>;
    tokensTrend: Array<{ date: string; value: number }>;
    solarChange: number;
    tokensChange: number;
    activeUsers: number;
    totalTransactions: number;
    recentActivity: Array<{
      id: string;
      type: string;
      amount: number;
      timestamp: string;
      status: string;
    }>;
  } | null>(null);

  useEffect(() => {
    if (isMock) return;

    let cancelled = false;

    async function fetchDashboardData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${rpcEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getHealth",
          }),
        });

        if (!response.ok) {
          throw new Error(`RPC request failed: ${response.status}`);
        }

        if (!cancelled) {
          setTestnetData(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch dashboard data"
          );
          setIsLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [isMock, rpcEndpoint]);

  const mockResult = useMemo(() => {
    const data = mockDashboardData;
    return {
      totalSupply: data.totalSupply,
      totalSolarGeneration: data.totalSolarGeneration,
      totalTokensMinted: data.totalTokensMinted,
      solarTrend: data.solarTrend,
      tokensTrend: data.tokensTrend,
      solarChange: data.solarChange,
      tokensChange: data.tokensChange,
      activeUsers: data.activeUsers,
      totalTransactions: data.totalTransactions,
      recentActivity: data.recentActivity,
      isLoading: false,
      error: null,
    };
  }, []);

  const testnetResult = useMemo(
    () => ({
      totalSupply: testnetData?.totalSupply ?? 0,
      totalSolarGeneration: testnetData?.totalSolarGeneration ?? 0,
      totalTokensMinted: testnetData?.totalTokensMinted ?? 0,
      solarTrend: testnetData?.solarTrend ?? [],
      tokensTrend: testnetData?.tokensTrend ?? [],
      solarChange: testnetData?.solarChange ?? 0,
      tokensChange: testnetData?.tokensChange ?? 0,
      activeUsers: testnetData?.activeUsers ?? 0,
      totalTransactions: testnetData?.totalTransactions ?? 0,
      recentActivity: testnetData?.recentActivity ?? [],
      isLoading,
      error,
    }),
    [testnetData, isLoading, error]
  );

  return isMock ? mockResult : testnetResult;
}
