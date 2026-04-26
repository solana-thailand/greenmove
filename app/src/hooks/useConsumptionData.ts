import { useState, useEffect, useMemo } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNetworkStore } from "../stores/networkStore";
import {
  PROGRAM_ID,
  ANCHOR_DISCRIMINATOR_SIZE,
  PUBKEY_SIZE,
} from "../lib/program";
import type { OnchainEnergyRecord } from "../lib/program";
import { parseEnergyRecord } from "../lib/accountParser";
import { mockSolarHistory, mockMonthlyComparisonData } from "../mock/solar";
import type { MonthlyComparisonData, MonthlyRow, WeeklyBlock } from "../types";
import { getMonth, getYear, subMonths } from "date-fns";

const TOKENS_PER_WH = 1.5;
const WH_TO_KWH = 0.001;
const MAX_SOLAR_GENERATION = 1000;
const MONTHS_TO_SHOW = 12;
const WEEKS_PER_MONTH = 4;
const ENERGY_RECORD_MIN_SIZE =
  ANCHOR_DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + 8 + 8 + 8 + 8 + 8 + 1;

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

function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

function colorForRatio(ratio: number): string {
  if (ratio <= 0) return "#f3f4f6";
  if (ratio <= 0.25) return "#dcfce7";
  if (ratio <= 0.5) return "#86efac";
  if (ratio <= 0.75) return "#fcd34d";
  return "#991b1b";
}

function weekBucket(date: Date): number {
  const day = date.getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
}

function computeTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function buildOnchainComparison(
  records: OnchainEnergyRecord[]
): MonthlyComparisonData {
  const now = new Date();
  const monthAgg = new Map<
    string,
    { month: string; year: number; weeks: Map<number, number>; total: number }
  >();

  for (let i = 0; i < MONTHS_TO_SHOW; i++) {
    const d = subMonths(now, MONTHS_TO_SHOW - 1 - i);
    const key = `${getYear(d)}-${String(getMonth(d)).padStart(2, "0")}`;
    monthAgg.set(key, {
      month: MONTH_NAMES[getMonth(d)],
      year: getYear(d),
      weeks: new Map(),
      total: 0,
    });
  }

  for (const rec of records) {
    const date = new Date(rec.timestamp * 1000);
    if (!isValidDate(date)) continue;
    const key = `${getYear(date)}-${String(getMonth(date)).padStart(2, "0")}`;
    const agg = monthAgg.get(key);
    if (!agg) continue;

    const wk = weekBucket(date);
    agg.weeks.set(wk, (agg.weeks.get(wk) ?? 0) + rec.energyWh);
    agg.total += rec.energyWh;
  }

  let maxWeekGen = 0;
  for (const agg of monthAgg.values()) {
    for (const wGen of agg.weeks.values()) {
      if (wGen > maxWeekGen) maxWeekGen = wGen;
    }
  }

  const rows: MonthlyRow[] = [];
  let maxRatio = 0;

  for (const agg of monthAgg.values()) {
    const weeks: WeeklyBlock[] = [];

    for (let w = 1; w <= WEEKS_PER_MONTH; w++) {
      const gen = agg.weeks.get(w) ?? 0;
      const ratio =
        maxWeekGen > 0
          ? parseFloat((gen / MAX_SOLAR_GENERATION).toFixed(2))
          : 0;
      const clamped = Math.min(ratio, 1);
      if (clamped > maxRatio) maxRatio = clamped;
      const color = colorForRatio(clamped);

      weeks.push({
        weekNumber: w,
        generationRatio: clamped,
        isEmpty: gen === 0,
        color,
        mixColor: color,
        totalGeneration: gen,
        tokensGenerated: Math.round(gen * TOKENS_PER_WH),
      });
    }

    rows.push({
      month: agg.month,
      year: agg.year,
      weeks,
      totalSolarGeneration: parseFloat(agg.total.toFixed(2)),
      totalTokensGenerated: Math.round(agg.total * TOKENS_PER_WH),
    });
  }

  const startYear = getYear(subMonths(now, MONTHS_TO_SHOW - 1));
  const startMonth = getMonth(subMonths(now, MONTHS_TO_SHOW - 1));

  return {
    data: rows,
    startDate: new Date(startYear, startMonth, 1),
    endDate: new Date(getYear(now), getMonth(now), 1),
    maxGenerationRatio: parseFloat(maxRatio.toFixed(2)),
  };
}

export interface ConsumptionData {
  solarGeneration: number;
  tokensMinted: number;
  solarChange: number;
  tokensChange: number;
  monthlyComparison: MonthlyComparisonData;
  isLoading: boolean;
  error: string | null;
}

export function useConsumptionData(): ConsumptionData {
  const { isMock } = useNetworkStore();
  const { connection } = useConnection();
  const [records, setRecords] = useState<OnchainEnergyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isMock) {
      const id = requestAnimationFrame(() => {
        setRecords([]);
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
        setRecords(parsed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch consumption data"
        );
        setIsLoading(false);
      }
    }

    fetchRecords();

    return () => {
      cancelled = true;
    };
  }, [isMock, connection]);

  const onchainResult = useMemo<ConsumptionData>(() => {
    const now = new Date();
    const currentMonthIdx = getMonth(now);
    const currentYear = getYear(now);
    const prevDate = subMonths(now, 1);
    const prevMonthIdx = getMonth(prevDate);
    const prevYear = getYear(prevDate);

    let currentEnergyWh = 0;
    let prevEnergyWh = 0;

    for (const rec of records) {
      const date = new Date(rec.timestamp * 1000);
      if (!isValidDate(date)) continue;
      const m = getMonth(date);
      const y = getYear(date);

      if (y === currentYear && m === currentMonthIdx) {
        currentEnergyWh += rec.energyWh;
      } else if (y === prevYear && m === prevMonthIdx) {
        prevEnergyWh += rec.energyWh;
      }
    }

    const solarKwh = parseFloat((currentEnergyWh * WH_TO_KWH).toFixed(2));
    const tokens = Math.round(currentEnergyWh * TOKENS_PER_WH);
    const prevSolarKwh = parseFloat((prevEnergyWh * WH_TO_KWH).toFixed(2));
    const prevTokens = Math.round(prevEnergyWh * TOKENS_PER_WH);

    return {
      solarGeneration: solarKwh,
      tokensMinted: tokens,
      solarChange: computeTrend(solarKwh, prevSolarKwh),
      tokensChange: computeTrend(tokens, prevTokens),
      monthlyComparison: buildOnchainComparison(records),
      isLoading,
      error,
    };
  }, [records, isLoading, error]);

  const mockResult = useMemo<ConsumptionData>(() => {
    const cur = mockSolarHistory.currentMonth;
    const prev = mockSolarHistory.previousMonth;

    return {
      solarGeneration: cur.generation,
      tokensMinted: cur.tokensMinted,
      solarChange: computeTrend(cur.generation, prev.generation),
      tokensChange: computeTrend(cur.tokensMinted, prev.tokensMinted),
      monthlyComparison: mockMonthlyComparisonData,
      isLoading: false,
      error: null,
    };
  }, []);

  return isMock ? mockResult : onchainResult;
}
