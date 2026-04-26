import { useState, useEffect, useMemo } from "react";
import type { BlockchainBlock, HistoryRecord, MonthlyBlock } from "../types";
import {
  mockBlockchainBlocks,
  generateHistoryRecords,
  mockMonthlySolarBlocks,
} from "../mock/blockchain";
import { useNetworkStore } from "../stores/networkStore";

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

export const useBlockchainData = (): UseBlockchainDataReturn => {
  const { isMock, rpcEndpoint } = useNetworkStore();
  const [sortBy, setSortBy] = useState<"week" | "generation" | "tokens">(
    "week"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testnetBlocks, setTestnetBlocks] = useState<BlockchainBlock[]>([]);
  const [testnetMonthlyBlocks, setTestnetMonthlyBlocks] = useState<
    MonthlyBlock[]
  >([]);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isMock) return;

    let cancelled = false;

    async function fetchBlockchainData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(rpcEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getSlot",
          }),
        });

        if (!response.ok) {
          throw new Error(`RPC request failed: ${response.status}`);
        }

        if (!cancelled) {
          setTestnetBlocks([]);
          setTestnetMonthlyBlocks([]);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch blockchain data"
          );
          setIsLoading(false);
        }
      }
    }

    fetchBlockchainData();

    return () => {
      cancelled = true;
    };
  }, [isMock, rpcEndpoint]);

  const mockBlocks = mockBlockchainBlocks;
  const mockMonthly = mockMonthlySolarBlocks;

  const blocks = isMock ? mockBlocks : testnetBlocks;
  const monthlySolarBlocks = isMock ? mockMonthly : testnetMonthlyBlocks;

  const history = useMemo(
    () => generateHistoryRecords(blocks, sortBy),
    [blocks, sortBy]
  );

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
    isLoading: isMock ? false : isLoading,
    error: isMock ? null : error,
  };
};
