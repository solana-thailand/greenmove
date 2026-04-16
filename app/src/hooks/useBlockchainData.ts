import { useState, useMemo } from "react";
import type { BlockchainBlock, HistoryRecord, MonthlyBlock } from "../types";
import {
  mockBlockchainBlocks,
  generateHistoryRecords,
  mockMonthlySolarBlocks,
} from "../mock/blockchain";

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
}

export const useBlockchainData = (): UseBlockchainDataReturn => {
  const [sortBy, setSortBy] = useState<"week" | "generation" | "tokens">(
    "week"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const blocks = mockBlockchainBlocks;
  const history = generateHistoryRecords(blocks, sortBy);
  const monthlySolarBlocks = mockMonthlySolarBlocks;

  const totalPages = useMemo(() => {
    return Math.ceil(history.length / itemsPerPage);
  }, [history.length]);

  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return history.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, history]);

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
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  return {
    blocks,
    history,
    monthlySolarBlocks,
    sortBy,
    setSortBy: handleSortByChange,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedHistory,
    goToPage,
    nextPage,
    previousPage,
  };
};
