import { subMonths, subDays } from "date-fns";

export interface ConsumptionRecord {
  id: string;
  type: "water" | "electric";
  date: Date;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  previousValue: number;
}

export interface KYCData {
  id: string;
  userId: string;
  status: "not_started" | "in_progress" | "submitted" | "approved" | "rejected";
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  idDocument?: {
    front?: string;
    back?: string;
    type?: string;
    number?: string;
  };
  proofOfAddress?: string;
  selfie?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface SwapTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  txHash?: string;
}

export interface WalletData {
  isConnected: boolean;
  address?: string;
  balance: number;
  tokenSymbol: string;
}

export const mockWalletData: WalletData = {
  isConnected: true,
  address: "8xHt...k3Lm",
  balance: 150000,
  tokenSymbol: "GREENMOVE",
};

export const generateConsumptionRecords = (
  count: number = 12
): ConsumptionRecord[] => {
  const records: ConsumptionRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = subMonths(now, count - 1 - i);
    const isWater = i % 2 === 0;
    const currentValue = isWater
      ? 100 + Math.random() * 50
      : 500 + Math.random() * 200;
    const previousValue = isWater
      ? 95 + Math.random() * 45
      : 480 + Math.random() * 180;
    const trend =
      currentValue > previousValue
        ? "up"
        : currentValue < previousValue
        ? "down"
        : "stable";

    records.push({
      id: `consumption-${i}`,
      type: isWater ? "water" : "electric",
      date,
      value: parseFloat(currentValue.toFixed(2)),
      unit: isWater ? "m³" : "kWh",
      trend,
      previousValue: parseFloat(previousValue.toFixed(2)),
    });
  }

  return records;
};

export const mockConsumptionRecords = generateConsumptionRecords();

export const mockKYCData: KYCData = {
  id: "kyc-1",
  userId: "user-1",
  status: "submitted",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  dateOfBirth: new Date("1990-05-15"),
  idDocument: {
    front: "/mock/id-front.jpg",
    back: "/mock/id-back.jpg",
    type: "passport",
    number: "AB1234567",
  },
  proofOfAddress: "/mock/proof-address.pdf",
  selfie: "/mock/selfie.jpg",
  submittedAt: subDays(new Date(), 2),
};

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

export const mockBlockchainActivity = [
  { week: 1, waterActivity: 0.2, electricActivity: 0.3 },
  { week: 2, waterActivity: 0.5, electricActivity: 0.4 },
  { week: 3, waterActivity: 0.1, electricActivity: 0.2 },
  { week: 4, waterActivity: 0.8, electricActivity: 0.7 },
  { week: 5, waterActivity: 0.3, electricActivity: 0.1 },
  { week: 6, waterActivity: 0.9, electricActivity: 0.8 },
  { week: 7, waterActivity: 0.2, electricActivity: 0.2 },
  { week: 8, waterActivity: 0.6, electricActivity: 0.5 },
  { week: 9, waterActivity: 0.4, electricActivity: 0.3 },
  { week: 10, waterActivity: 0.1, electricActivity: 0.1 },
];

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

export const mockConsumptionHistory = {
  currentMonth: {
    water: 1250.5,
    electric: 850.3,
  },
  previousMonth: {
    water: 1189.2,
    electric: 877.6,
  },
  yearlyData: mockConsumptionRecords,
};
