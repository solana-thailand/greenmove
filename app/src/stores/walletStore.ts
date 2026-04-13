import { create } from "zustand";
import type { WalletData, WalletConnectionStatus } from "../types";

interface WalletStore extends WalletData {
  connectionStatus: WalletConnectionStatus;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  updateBalance: (balance: number) => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  isConnected: false,
  address: undefined,
  balance: 0,
  tokenSymbol: "GREENMOVE",
  connectionStatus: "disconnected",
  error: null,

  connect: async () => {
    set({ connectionStatus: "connecting", error: null });

    try {
      const mockWalletAddress = "8xHt...k3Lm";
      const mockBalance = 150000;

      set({
        isConnected: true,
        address: mockWalletAddress,
        balance: mockBalance,
        connectionStatus: "connected",
        error: null,
      });
    } catch (err) {
      set({
        connectionStatus: "error",
        error: err instanceof Error ? err.message : "Failed to connect wallet",
        isConnected: false,
      });
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: undefined,
      balance: 0,
      connectionStatus: "disconnected",
      error: null,
    });
  },

  updateBalance: (balance) => {
    set({ balance });
  },

  setError: (error) => {
    set({ error });
  },
}));
