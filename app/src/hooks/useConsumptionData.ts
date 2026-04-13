import { useState, useMemo } from "react";
import {
  mockConsumptionHistory,
  mockMonthlyComparisonData,
} from "../mock/consumption";
import { mockSwapTransactions } from "../mock/swap";
import type { ConsumptionRecord, MonthlyComparisonData } from "../types";

interface UseConsumptionDataReturn {
  selectedMonth: "current" | "last" | "3months" | "6months" | "12months";
  setSelectedMonth: (
    month: "current" | "last" | "3months" | "6months" | "12months"
  ) => void;
  waterConsumption: number;
  electricConsumption: number;
  waterPrevious: number;
  electricPrevious: number;
  waterChange: number;
  electricChange: number;
  records: ConsumptionRecord[];
  isLoading: boolean;
  error: null;
}

export const useConsumptionData = (): UseConsumptionDataReturn => {
  const [selectedMonth, setSelectedMonth] = useState<
    "current" | "last" | "3months" | "6months" | "12months"
  >("current");

  const { currentMonth, previousMonth, yearlyData } = mockConsumptionHistory;

  const waterConsumption = useMemo(() => {
    return currentMonth.water;
  }, [currentMonth]);

  const electricConsumption = useMemo(() => {
    return currentMonth.electric;
  }, [currentMonth]);

  const waterPrevious = useMemo(() => {
    return previousMonth.water;
  }, [previousMonth]);

  const electricPrevious = useMemo(() => {
    return previousMonth.electric;
  }, [previousMonth]);

  const waterChange = useMemo(() => {
    return ((waterConsumption - waterPrevious) / waterPrevious) * 100;
  }, [waterConsumption, waterPrevious]);

  const electricChange = useMemo(() => {
    return ((electricConsumption - electricPrevious) / electricPrevious) * 100;
  }, [electricConsumption, electricPrevious]);

  const records = useMemo(() => {
    return yearlyData;
  }, [yearlyData]);

  return {
    selectedMonth,
    setSelectedMonth,
    waterConsumption,
    electricConsumption,
    waterPrevious,
    electricPrevious,
    waterChange,
    electricChange,
    records,
    isLoading: false,
    error: null,
  };
};

interface UseMonthlyComparisonReturn {
  data: MonthlyComparisonData;
  isLoading: boolean;
  error: null;
}

export const useMonthlyComparison = (): UseMonthlyComparisonReturn => {
  const data = useMemo(() => {
    return mockMonthlyComparisonData;
  }, []);

  return {
    data,
    isLoading: false,
    error: null,
  };
};

interface UseTransactionHistoryReturn {
  transactions: typeof mockSwapTransactions;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  paginatedTransactions: typeof mockSwapTransactions;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  isLoading: boolean;
  error: null;
}

export const useTransactionHistory = (): UseTransactionHistoryReturn => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = useMemo(() => {
    return Math.ceil(mockSwapTransactions.length / itemsPerPage);
  }, []);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockSwapTransactions.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

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

  return {
    transactions: mockSwapTransactions,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedTransactions,
    goToPage,
    nextPage,
    previousPage,
    isLoading: false,
    error: null,
  };
};
