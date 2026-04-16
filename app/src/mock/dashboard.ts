export const mockDashboardData = {
  totalSupply: 1000000000,
  totalSolarGeneration: 1250.5,
  totalTokensMinted: 1875,
  solarTrend: "up" as const,
  tokensTrend: "up" as const,
  solarChange: 5.2,
  tokensChange: 7.8,
  activeUsers: 1250,
  totalTransactions: 8532,
  recentActivity: [
    {
      type: "solar",
      message: "Solar generation recorded",
      time: "2 hours ago",
    },
    {
      type: "tokens",
      message: "Tokens minted from solar",
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
