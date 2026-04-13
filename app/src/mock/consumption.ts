import { subMonths } from "date-fns";
import type {
  ConsumptionRecord,
  WeeklyBlock,
  MonthlyRow,
  MonthlyComparisonData,
} from "../types";

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
  blue: "#3b82f6", // blue-500 (100% water)
  yellow: "#eab308", // yellow-500 (100% electric)
  mixed: [
    { max: 0.1, color: "#fef3c7" }, // yellow-100 (mostly electric)
    { max: 0.3, color: "#fcd34d" }, // yellow-300
    { max: 0.5, color: "#86efac" }, // green-300 (balanced)
    { max: 0.7, color: "#4ade80" }, // green-400
    { max: 0.9, color: "#3b82f6" }, // blue-500 (mostly water)
  ],
};

function getColorForRatio(waterRatio: number, electricRatio: number): string {
  if (waterRatio === 0 && electricRatio === 0) {
    return WEEK_COLOR_MAP.gray;
  }

  if (waterRatio === 1 && electricRatio === 0) {
    return WEEK_COLOR_MAP.blue;
  }

  if (waterRatio === 0 && electricRatio === 1) {
    return WEEK_COLOR_MAP.yellow;
  }

  // Mixed case - calculate ratio and use green gradient
  const waterElectricRatio = waterRatio / (waterRatio + electricRatio);
  const colorMap = WEEK_COLOR_MAP.mixed;
  for (const entry of colorMap) {
    if (waterElectricRatio <= entry.max) {
      return entry.color;
    }
  }
  return colorMap[colorMap.length - 1].color;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateWeeklyBlocks(_month: number, _year: number): WeeklyBlock[] {
  const weeks: WeeklyBlock[] = [];
  const baseWaterRatio = 0.3 + Math.random() * 0.4;
  const baseElectricRatio = 0.3 + Math.random() * 0.4;

  for (let week = 1; week <= 4; week++) {
    const isEmpty = Math.random() > 0.9;
    const waterRatio = isEmpty
      ? 0
      : Math.min(
          1,
          Math.max(0.1, baseWaterRatio + (Math.random() - 0.5) * 0.3)
        );
    const electricRatio = isEmpty
      ? 0
      : Math.min(
          1,
          Math.max(0.1, baseElectricRatio + (Math.random() - 0.5) * 0.3)
        );
    const totalUsage = isEmpty
      ? 0
      : Math.round((waterRatio + electricRatio) * 500 + Math.random() * 200);
    const blockColor = getColorForRatio(waterRatio, electricRatio);

    weeks.push({
      weekNumber: week,
      waterRatio: parseFloat(waterRatio.toFixed(2)),
      electricRatio: parseFloat(electricRatio.toFixed(2)),
      isEmpty,
      color: blockColor,
      mixColor: blockColor,
      totalUsage,
    });
  }

  return weeks;
}

export const generateMonthlyComparisonData = (
  monthsCount: number = 12
): MonthlyComparisonData => {
  const now = new Date();
  const data: MonthlyRow[] = [];
  let maxWaterRatio = 0;
  let maxElectricRatio = 0;

  for (let i = 0; i < monthsCount; i++) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (monthsCount - 1 - i),
      1
    );
    const weeks = generateWeeklyBlocks(date.getMonth(), date.getFullYear());

    const totalWaterUsage = weeks.reduce(
      (sum, week) => sum + week.waterRatio * week.totalUsage,
      0
    );
    const totalElectricUsage = weeks.reduce(
      (sum, week) => sum + week.electricRatio * week.totalUsage,
      0
    );

    const maxWeekWater = Math.max(...weeks.map((w) => w.waterRatio));
    const maxWeekElectric = Math.max(...weeks.map((w) => w.electricRatio));

    maxWaterRatio = Math.max(maxWaterRatio, maxWeekWater);
    maxElectricRatio = Math.max(maxElectricRatio, maxWeekElectric);

    data.push({
      month: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear(),
      weeks,
      totalWaterUsage: parseFloat(totalWaterUsage.toFixed(2)),
      totalElectricUsage: parseFloat(totalElectricUsage.toFixed(2)),
    });
  }

  return {
    data,
    startDate: new Date(now.getFullYear(), now.getMonth() - monthsCount + 1, 1),
    endDate: new Date(now.getFullYear(), now.getMonth(), 1),
    maxWaterRatio: parseFloat(maxWaterRatio.toFixed(2)),
    maxElectricRatio: parseFloat(maxElectricRatio.toFixed(2)),
  };
};

export const mockMonthlyComparisonData = generateMonthlyComparisonData();
