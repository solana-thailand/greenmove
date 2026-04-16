export type Trend = "up" | "down" | "stable";

export interface SolarRecord {
  id: string;
  type: "solar";
  date: Date;
  generation: number;
  tokensMinted: number;
  unit: string;
  trend: Trend;
  previousGeneration: number;
  previousTokens: number;
}

export interface MonthlySolar {
  generation: number;
  tokensMinted: number;
}

export interface SolarHistory {
  currentMonth: MonthlySolar;
  previousMonth: MonthlySolar;
  yearlyData: SolarRecord[];
}

export interface WeeklyBlock {
  weekNumber: number;
  generationRatio: number;
  isEmpty: boolean;
  color: string;
  mixColor: string;
  totalGeneration: number;
  tokensGenerated?: number;
}

export interface MonthlyRow {
  month: string;
  year: number;
  weeks: WeeklyBlock[];
  totalSolarGeneration: number;
  totalTokensGenerated: number;
}

export interface MonthlyComparisonData {
  data: MonthlyRow[];
  startDate: Date;
  endDate: Date;
  maxGenerationRatio: number;
}
