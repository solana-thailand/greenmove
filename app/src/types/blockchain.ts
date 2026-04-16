export interface BlockchainBlock {
  week: number;
  solarGeneration: number;
  tokensMinted: number;
}

export interface HistoryRecord {
  id: string;
  week: number;
  solarGeneration: number;
  tokensMinted: number;
  timestamp: string;
  status: "confirmed" | "pending";
}

export interface MonthlyBlock {
  month: number;
  monthName: string;
  usage: number;
  ratio: number;
}

export type BlockchainSortBy = "week" | "generation" | "tokens";
export type BlockchainFilterType = "all" | "solar" | "tokens" | "mixed";
export type UtilityType = "solar" | "tokens";
