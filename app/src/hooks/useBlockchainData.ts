import { useState, useEffect, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import type { BlockchainBlock, HistoryRecord, MonthlyBlock } from "../types";
import {
  mockBlockchainBlocks,
  generateHistoryRecords,
  mockMonthlySolarBlocks,
} from "../mock/blockchain";
import { useNetworkStore } from "../stores/networkStore";
import {
  PROGRAM_ID,
  ANCHOR_DISCRIMINATOR_SIZE,
  PUBKEY_SIZE,
} from "../lib/program";
import type { OnchainEnergyRecord } from "../lib/program";
import { parseEnergyRecord } from "../lib/accountParser";
import { getISOWeek, getMonth } from "date-fns";

const MONTH_NAMES = [
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

const ITEMS_PER_PAGE = 10;
const ENERGY_RECORD_MIN_SIZE =
  ANCHOR_DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + 8 + 8 + 8 + 8 + 8 + 1;
const MAX_SOLAR_GENERATION = 1000;
const TOKENS_MULTIPLIER = 1.5;

function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

interface UseBlockchainDataReturn {
  blocks: BlockchainBlock[];
  history: HistoryRecord[];
  monthlySolarBlocks: MonthlyBlock[];
  sortBy: "week" | "generation" | "tokens";
  setSortBy: (sortBy: "week" | "generation" | "tokens") => void;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  paginatedHistory: HistoryRecord[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  isLoading: boolean;
  error: string | null;
}

function recordToHistory(record: OnchainEnergyRecord): HistoryRecord | null {
  const date = new Date(record.timestamp * 1000);
  if (!isValidDate(date)) return null;
  return {
    id: record.pubkey,
    week: getISOWeek(date),
    solarGeneration: record.energyWh,
    tokensMinted: Math.round(record.energyWh * TOKENS_MULTIPLIER),
    timestamp: date.toISOString(),
    status: "confirmed" as const,
  };
}

function aggregateWeekly(records: OnchainEnergyRecord[]): BlockchainBlock[] {
  const weekMap = new Map<number, { solar: number; tokens: number }>();

  for (const rec of records) {
    const date = new Date(rec.timestamp * 1000);
    if (!isValidDate(date)) continue;
    const week = getISOWeek(date);
    const entry = weekMap.get(week) ?? { solar: 0, tokens: 0 };
    entry.solar += rec.energyWh;
    entry.tokens += Math.round(rec.energyWh * TOKENS_MULTIPLIER);
    weekMap.set(week, entry);
  }

  return Array.from(weekMap.entries())
    .map(([week, data]) => ({
      week,
      solarGeneration: data.solar,
      tokensMinted: data.tokens,
    }))
    .sort((a, b) => a.week - b.week);
}

function aggregateMonthly(records: OnchainEnergyRecord[]): MonthlyBlock[] {
  const monthMap = new Map<number, number>();

  for (const rec of records) {
    const date = new Date(rec.timestamp * 1000);
    if (!isValidDate(date)) continue;
    const month = getMonth(date);
    monthMap.set(month, (monthMap.get(month) ?? 0) + rec.energyWh);
  }

  return Array.from(monthMap.entries())
    .map(([month, usage]) => ({
      month,
      monthName: MONTH_NAMES[month],
      usage: parseFloat(usage.toFixed(1)),
      ratio: parseFloat(Math.min(usage / MAX_SOLAR_GENERATION, 1).toFixed(2)),
    }))
    .sort((a, b) => a.month - b.month);
}

function sortHistory(
  records: HistoryRecord[],
  sortBy: "week" | "generation" | "tokens"
): HistoryRecord[] {
  return [...records].sort((a, b) => {
    if (sortBy === "week") return b.week - a.week;
    if (sortBy === "generation") return b.solarGeneration - a.solarGeneration;
    return b.tokensMinted - a.tokensMinted;
  });
}

export const useBlockchainData = (): UseBlockchainDataReturn => {
  const { isMock } = useNetworkStore();
  const { connection } = useConnection();
  const [sortBy, setSortByState] = useState<"week" | "generation" | "tokens">(
    "week"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onchainRecords, setOnchainRecords] = useState<OnchainEnergyRecord[]>(
    []
  );

  useEffect(() => {
    if (isMock) {
      const id = requestAnimationFrame(() => {
        setOnchainRecords([]);
        setIsLoading(false);
        setError(null);
      });
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    async function fetchRecords() {
      setIsLoading(true);
      setError(null);

      try {
        const accounts = await connection.getProgramAccounts(PROGRAM_ID);

        if (cancelled) return;

        const parsed: OnchainEnergyRecord[] = [];
        for (const { pubkey, account } of accounts) {
          if (account.data.length < ENERGY_RECORD_MIN_SIZE) continue;
          const record = parseEnergyRecord(account.data, pubkey.toBase58());
          if (record) parsed.push(record);
        }

        parsed.sort((a, b) => a.recordIndex - b.recordIndex);
        setOnchainRecords(parsed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch blockchain data"
        );
        setIsLoading(false);
      }
    }

    fetchRecords();

    return () => {
      cancelled = true;
    };
  }, [isMock, connection]);

  const onchainBlocks = useMemo(
    () => aggregateWeekly(onchainRecords),
    [onchainRecords]
  );
  const onchainMonthly = useMemo(
    () => aggregateMonthly(onchainRecords),
    [onchainRecords]
  );
  const onchainHistoryRaw = useMemo(
    () =>
      onchainRecords
        .map(recordToHistory)
        .filter((r): r is HistoryRecord => r !== null),
    [onchainRecords]
  );

  const blocks = isMock ? mockBlockchainBlocks : onchainBlocks;
  const monthlySolarBlocks = isMock ? mockMonthlySolarBlocks : onchainMonthly;

  const history = useMemo(() => {
    if (isMock) return generateHistoryRecords(blocks, sortBy);
    return sortHistory(onchainHistoryRaw, sortBy);
  }, [isMock, blocks, sortBy, onchainHistoryRaw]);

  const totalPages = useMemo(
    () => Math.ceil(history.length / ITEMS_PER_PAGE),
    [history.length]
  );

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return history.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, history]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSortByChange = (newSortBy: "week" | "generation" | "tokens") => {
    setSortByState(newSortBy);
    setCurrentPage(1);
  };

  return {
    blocks,
    history,
    monthlySolarBlocks,
    sortBy,
    setSortBy: handleSortByChange,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    totalPages,
    paginatedHistory,
    goToPage,
    nextPage,
    previousPage,
    isLoading: isMock ? false : isLoading,
    error: isMock ? null : error,
  };
};
