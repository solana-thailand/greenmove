import { create } from "zustand";
import type { ConsumptionRecord, MonthlyConsumption } from "../types";

interface ConsumptionState {
  consumptionRecords: ConsumptionRecord[];
  currentMonthConsumption: MonthlyConsumption;
  previousMonthConsumption: MonthlyConsumption;
  selectedMonth: Date;
  isLoading: boolean;
  error: string | null;

  setConsumptionRecords: (records: ConsumptionRecord[]) => void;
  setCurrentMonthConsumption: (consumption: MonthlyConsumption) => void;
  setPreviousMonthConsumption: (consumption: MonthlyConsumption) => void;
  addConsumptionRecord: (record: ConsumptionRecord) => void;
  updateConsumptionRecord: (
    id: string,
    updates: Partial<ConsumptionRecord>
  ) => void;
  setSelectedMonth: (month: Date) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialMonthConsumption: MonthlyConsumption = {
  water: 0,
  electric: 0,
};

export const useConsumptionStore = create<ConsumptionState>((set) => ({
  consumptionRecords: [],
  currentMonthConsumption: initialMonthConsumption,
  previousMonthConsumption: initialMonthConsumption,
  selectedMonth: new Date(),
  isLoading: false,
  error: null,

  setConsumptionRecords: (records) =>
    set({
      consumptionRecords: records,
    }),

  setCurrentMonthConsumption: (consumption) =>
    set({
      currentMonthConsumption: consumption,
    }),

  setPreviousMonthConsumption: (consumption) =>
    set({
      previousMonthConsumption: consumption,
    }),

  addConsumptionRecord: (record) =>
    set((state) => ({
      consumptionRecords: [...state.consumptionRecords, record],
    })),

  updateConsumptionRecord: (id, updates) =>
    set((state) => ({
      consumptionRecords: state.consumptionRecords.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      ),
    })),

  setSelectedMonth: (month) =>
    set({
      selectedMonth: month,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      consumptionRecords: [],
      currentMonthConsumption: initialMonthConsumption,
      previousMonthConsumption: initialMonthConsumption,
      selectedMonth: new Date(),
      isLoading: false,
      error: null,
    }),
}));
