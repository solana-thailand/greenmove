export type ConsumptionType = "water" | "electric";

export type Trend = "up" | "down" | "stable";

export interface ConsumptionRecord {
  id: string;
  type: ConsumptionType;
  date: Date;
  value: number;
  unit: string;
  trend: Trend;
  previousValue: number;
}

export interface MonthlyConsumption {
  water: number;
  electric: number;
}

export interface ConsumptionHistory {
  currentMonth: MonthlyConsumption;
  previousMonth: MonthlyConsumption;
  yearlyData: ConsumptionRecord[];
}

export interface ElectricMeterLevel {
  ratio: number;
  color: string;
}

export interface WeeklyBlock {
  weekNumber: number;
  waterRatio: number;
  electricRatio: number;
  isEmpty: boolean;
  color: string;
  mixColor: string;
  totalUsage: number;
}

export interface MonthlyRow {
  month: string;
  year: number;
  weeks: WeeklyBlock[];
  totalWaterUsage: number;
  totalElectricUsage: number;
}

export interface MonthlyComparisonData {
  data: MonthlyRow[];
  startDate: Date;
  endDate: Date;
  maxWaterRatio: number;
  maxElectricRatio: number;
}
