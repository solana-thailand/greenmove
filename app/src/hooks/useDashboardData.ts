import { useMemo } from "react";
import { mockDashboardData } from "../mock/dashboard";
import { useNetworkStore } from "../stores/networkStore";
import { useOnchainDevices } from "./useOnchainDevices";

export function useDashboardData() {
  const { isMock } = useNetworkStore();
  const { devices, isLoading, error } = useOnchainDevices();

  const onchainResult = useMemo(() => {
    const totalSolarGeneration = devices.reduce(
      (sum, d) => sum + d.totalEnergyWh,
      0
    );
    const activeUsers = new Set(devices.map((d) => d.owner)).size;
    const totalTransactions = devices.reduce(
      (sum, d) => sum + d.recordCount,
      0
    );

    return {
      totalSupply: 1_000_000_000,
      totalSolarGeneration,
      totalTokensMinted: Math.round(totalSolarGeneration * 1.5),
      solarTrend: [] as Array<{ date: string; value: number }>,
      tokensTrend: [] as Array<{ date: string; value: number }>,
      solarChange: 0,
      tokensChange: 0,
      activeUsers,
      totalTransactions,
      recentActivity: [] as Array<{
        id: string;
        type: string;
        amount: number;
        timestamp: string;
        status: string;
      }>,
      isLoading,
      error,
    };
  }, [devices, isLoading, error]);

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

  return isMock ? mockResult : onchainResult;
}
