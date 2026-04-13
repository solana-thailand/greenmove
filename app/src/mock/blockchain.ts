import type { BlockchainBlock, HistoryRecord, MonthlyBlock } from "../types";

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

export const generateBlockchainBlocks = (): BlockchainBlock[] => {
  return Array.from({ length: 52 }, (_, i) => ({
    week: i + 1,
    water: Math.random() > 0.3 ? Number((Math.random() * 100).toFixed(2)) : 0,
    electric:
      Math.random() > 0.3 ? Number((Math.random() * 100).toFixed(2)) : 0,
  }));
};

export const generateHistoryRecords = (
  blocks: BlockchainBlock[],
  sortBy: "week" | "water" | "electric"
): HistoryRecord[] => {
  return blocks
    .filter((block) => block.water > 0 || block.electric > 0)
    .map((block) => {
      const timestamp =
        Date.now() - (52 - block.week) * 7 * 24 * 60 * 60 * 1000;
      return {
        id: `block-${block.week}`,
        week: block.week,
        waterConsumption: block.water,
        electricConsumption: block.electric,
        timestamp: new Date(timestamp).toISOString(),
        status: "confirmed" as const,
      };
    })
    .sort((a, b) => {
      if (sortBy === "week") return b.week - a.week;
      if (sortBy === "water") return b.waterConsumption - a.waterConsumption;
      return b.electricConsumption - a.electricConsumption;
    });
};

export const mockBlockchainBlocks = generateBlockchainBlocks();

export const generateMonthlyBlocks = (
  type: "water" | "electric"
): MonthlyBlock[] => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const maxWaterUsage = 150;
  const maxElectricUsage = 200;
  const baseUsage = type === "water" ? 100 : 500;
  const variation = type === "water" ? 50 : 200;

  return Array.from({ length: 12 }, (_, i) => {
    const usage = Math.random() * variation + baseUsage;
    const maxUsage = type === "water" ? maxWaterUsage : maxElectricUsage;
    const ratio = Math.min(usage / maxUsage, 1);

    return {
      month: i,
      monthName: monthNames[i],
      usage: parseFloat(usage.toFixed(1)),
      ratio: parseFloat(ratio.toFixed(2)),
    };
  });
};

export const mockMonthlyWaterBlocks = generateMonthlyBlocks("water");
export const mockMonthlyElectricBlocks = generateMonthlyBlocks("electric");
