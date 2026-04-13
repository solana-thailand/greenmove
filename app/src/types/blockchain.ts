export interface BlockchainBlock {
  week: number;
  water: number;
  electric: number;
}

export interface HistoryRecord {
  id: string;
  week: number;
  waterConsumption: number;
  electricConsumption: number;
  timestamp: string;
  status: "confirmed" | "pending";
}

export interface MonthlyBlock {
  month: number;
  monthName: string;
  usage: number;
  ratio: number;
}

export type BlockchainSortBy = "week" | "water" | "electric";
export type BlockchainFilterType = "all" | "water" | "electric" | "mixed";
export type UtilityType = "water" | "electric";
