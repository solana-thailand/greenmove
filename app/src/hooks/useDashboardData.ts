import { useMemo } from "react";
import { mockDashboardData } from "../mock/dashboard";

export function useDashboardData() {
  const data = useMemo(() => mockDashboardData, []);

  return {
    totalSupply: data.totalSupply,
    totalWaterConsumption: data.totalWaterConsumption,
    totalElectricConsumption: data.totalElectricConsumption,
    waterTrend: data.waterTrend,
    electricTrend: data.electricTrend,
    waterChange: data.waterChange,
    electricChange: data.electricChange,
    activeUsers: data.activeUsers,
    totalTransactions: data.totalTransactions,
    recentActivity: data.recentActivity,
    isLoading: false,
    error: null,
  };
}
