import { useMemo } from "react";
import { mockDashboardData } from "../mock/dashboard";

export function useDashboardData() {
  const data = useMemo(() => mockDashboardData, []);

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
}
