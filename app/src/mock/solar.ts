import { subMonths } from "date-fns";
import type {
  SolarRecord,
  WeeklyBlock,
  MonthlyRow,
  MonthlyComparisonData,
} from "../types";

export const generateSolarRecords = (count: number = 12): SolarRecord[] => {
  const records: SolarRecord[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = subMonths(now, count - 1 - i);
    const currentGeneration = 500 + Math.random() * 500;
    const previousGeneration = 480 + Math.random() * 450;
    const currentTokens = Math.round(currentGeneration * 1.5);
    const previousTokens = Math.round(previousGeneration * 1.5);
    const trend =
      currentGeneration > previousGeneration
        ? "up"
        : currentGeneration < previousGeneration
        ? "down"
        : "stable";

    records.push({
      id: `solar-${i}`,
      type: "solar",
      date,
      generation: parseFloat(currentGeneration.toFixed(2)),
      tokensMinted: currentTokens,
      unit: "kWh",
      trend,
      previousGeneration: parseFloat(previousGeneration.toFixed(2)),
      previousTokens,
    });
  }

  return records;
};

export const mockSolarRecords = generateSolarRecords();

export const mockSolarHistory = {
  currentMonth: {
    generation: 1250.5,
    tokensMinted: 1875,
  },
  previousMonth: {
    generation: 1189.2,
    tokensMinted: 1783,
  },
  yearlyData: mockSolarRecords,
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_COLOR_MAP = {
  gray: "#f3f4f6", // gray-100 (empty)
  low: "#4ade80", // green-400 (low generation)
  medium: "#fcd34d", // yellow-300 (medium generation)
  high: "#991b1b", // red-800 (high generation)
  mixed: [
    { max: 0.25, color: "#dcfce7" }, // green-100 (very low)
    { max: 0.5, color: "#86efac" }, // green-300 (low)
    { max: 0.75, color: "#fcd34d" }, // yellow-300 (medium)
    { max: 1.0, color: "#991b1b" }, // red-800 (high)
  ],
};

function getColorForRatio(generationRatio: number): string {
  if (generationRatio === 0) {
    return WEEK_COLOR_MAP.gray;
  }

  if (generationRatio <= 0.25) {
    return WEEK_COLOR_MAP.mixed[0].color;
  }

  if (generationRatio <= 0.5) {
    return WEEK_COLOR_MAP.mixed[1].color;
  }

  if (generationRatio <= 0.75) {
    return WEEK_COLOR_MAP.mixed[2].color;
  }

  return WEEK_COLOR_MAP.mixed[3].color;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateWeeklyBlocks(month: number, year: number): WeeklyBlock[] {
  const weeks: WeeklyBlock[] = [];
  const baseGenerationRatio = 0.3 + Math.random() * 0.4;

  for (let week = 1; week <= 4; week++) {
    const isEmpty = Math.random() > 0.9;
    const generationRatio = isEmpty
      ? 0
      : Math.min(
          1,
          Math.max(0.1, baseGenerationRatio + (Math.random() - 0.5) * 0.3)
        );
    const totalGeneration = isEmpty
      ? 0
      : Math.round(generationRatio * 1000 + Math.random() * 200);
    const tokensGenerated = Math.round(totalGeneration * 1.5);
    const blockColor = getColorForRatio(generationRatio);

    weeks.push({
      weekNumber: week,
      generationRatio: parseFloat(generationRatio.toFixed(2)),
      isEmpty,
      color: blockColor,
      mixColor: blockColor,
      totalGeneration,
      tokensGenerated,
    });
  }

  return weeks;
}

export const generateMonthlyComparisonData = (
  monthsCount: number = 12
): MonthlyComparisonData => {
  const now = new Date();
  const data: MonthlyRow[] = [];
  let maxGenerationRatio = 0;

  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (monthsCount - 1 - i),
      1
    );
    const weeks = generateWeeklyBlocks(date.getMonth(), date.getFullYear());

    const totalSolarGeneration = weeks.reduce(
      (sum, week) => sum + (week.totalGeneration || 0),
      0
    );
    const totalTokensGenerated = weeks.reduce(
      (sum, week) => sum + (week.tokensGenerated || 0),
      0
    );

    const maxWeekGeneration = Math.max(...weeks.map((w) => w.generationRatio));

    maxGenerationRatio = Math.max(maxGenerationRatio, maxWeekGeneration);

    data.push({
      month: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear(),
      weeks,
      totalSolarGeneration: parseFloat(totalSolarGeneration.toFixed(2)),
      totalTokensGenerated,
    });
  }

  return {
    data,
    startDate: new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1),
    endDate: new Date(now.getFullYear(), now.getMonth(), 1),
    maxGenerationRatio: parseFloat(maxGenerationRatio.toFixed(2)),
  };
};

export const mockMonthlyComparisonData = generateMonthlyComparisonData();
