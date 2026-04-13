export const mockDashboardData = {
  totalSupply: 1000000000,
  totalWaterConsumption: 1250.5,
  totalElectricConsumption: 850.3,
  waterTrend: "up" as const,
  electricTrend: "down" as const,
  waterChange: 5.2,
  electricChange: -3.1,
  activeUsers: 1250,
  totalTransactions: 8532,
  recentActivity: [
    {
      type: "water",
      message: "Water reading submitted",
      time: "2 hours ago",
    },
    {
      type: "electric",
      message: "Electric reading submitted",
      time: "4 hours ago",
    },
    {
      type: "swap",
      message: "Token swap completed",
      time: "1 day ago",
    },
    {
      type: "kyc",
      message: "KYC verification approved",
      time: "2 days ago",
    },
  ],
};
