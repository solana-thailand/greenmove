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
