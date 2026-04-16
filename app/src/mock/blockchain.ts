import type { BlockchainBlock, HistoryRecord, MonthlyBlock } from "../types";

export const mockBlockchainActivity = [
  { week: 1, solarActivity: 0.4, tokenActivity: 0.6 },
  { week: 2, solarActivity: 0.7, tokenActivity: 0.5 },
  { week: 3, solarActivity: 0.3, tokenActivity: 0.4 },
  { week: 4, solarActivity: 0.9, tokenActivity: 0.8 },
  { week: 5, solarActivity: 0.5, tokenActivity: 0.3 },
  { week: 6, solarActivity: 1.0, tokenActivity: 0.9 },
  { week: 7, solarActivity: 0.4, tokenActivity: 0.5 },
  { week: 8, solarActivity: 0.8, tokenActivity: 0.7 },
  { week: 9, solarActivity: 0.6, tokenActivity: 0.5 },
  { week: 10, solarActivity: 0.2, tokenActivity: 0.3 },
];

export const generateBlockchainBlocks = (): BlockchainBlock[] => {
  return Array.from({ length: 52 }, (_, i) => {
    const solarGeneration =
      Math.random() > 0.3 ? Number((Math.random() * 1000).toFixed(2)) : 0;
    const tokensMinted =
      solarGeneration > 0
        ? Math.round(solarGeneration * 1.5 + Math.random() * 100)
        : 0;

    return {
      week: i + 1,
      solarGeneration,
      tokensMinted,
    };
  });
};

export const generateHistoryRecords = (
  blocks: BlockchainBlock[],
  sortBy: "week" | "generation" | "tokens"
): HistoryRecord[] => {
  return blocks
    .filter((block) => block.solarGeneration > 0 || block.tokensMinted > 0)
    .map((block) => {
      const timestamp =
        Date.now() - (52 - block.week) * 7 * 24 * 60 * 60 * 1000;
      return {
        id: `block-${block.week}`,
        week: block.week,
        solarGeneration: block.solarGeneration,
        tokensMinted: block.tokensMinted,
        timestamp: new Date(timestamp).toISOString(),
        status: "confirmed" as const,
      };
    })
    .sort((a, b) => {
      if (sortBy === "week") return b.week - a.week;
      if (sortBy === "generation") return b.solarGeneration - a.solarGeneration;
      return b.tokensMinted - a.tokensMinted;
    });
};

export const mockBlockchainBlocks = generateBlockchainBlocks();

export const generateMonthlyBlocks = (): MonthlyBlock[] => {
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

  const maxSolarGeneration = 1000;
  const baseGeneration = 500;
  const variation = 500;

  return Array.from({ length: 12 }, (_, i) => {
    const generation = Math.random() * variation + baseGeneration;
    const ratio = Math.min(generation / maxSolarGeneration, 1);

    return {
      month: i,
      monthName: monthNames[i],
      usage: parseFloat(generation.toFixed(1)),
      ratio: parseFloat(ratio.toFixed(2)),
    };
  });
};

export const mockMonthlySolarBlocks = generateMonthlyBlocks();
