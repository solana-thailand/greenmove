import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWalletStore } from "../stores/walletStore";
import { useNetworkStore } from "../stores/networkStore";

const MOCK_TOKEN_SYMBOL = "GREENMOVE";

interface WalletConnectionState {
  isConnected: boolean;
  address: string | undefined;
  balance: number;
  tokenSymbol: string;
  isConnecting: boolean;
  error: string | null;
  isMock: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useWalletConnection(): WalletConnectionState {
  const { isMock } = useNetworkStore();

  if (isMock) {
    return useMockWallet();
  }

  return useSolanaWallet();
}

function useMockWallet(): WalletConnectionState {
  const {
    isConnected,
    address,
    balance,
    connectionStatus,
    error,
    connect,
    disconnect,
  } = useWalletStore();

  return {
    isConnected,
    address,
    balance,
    tokenSymbol: MOCK_TOKEN_SYMBOL,
    isConnecting: connectionStatus === "connecting",
    error,
    isMock: true,
    connect: () => {
      void connect();
    },
    disconnect,
  };
}

function useSolanaWallet(): WalletConnectionState {
  const { publicKey, connected, connecting, connect, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { updateBalance, setError } = useWalletStore();

  const address = publicKey?.toBase58();

  const handleConnect = () => {
    try {
      setVisible(true);
      void connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    try {
      void disconnect();
      updateBalance(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect wallet");
    }
  };

  return {
    isConnected: connected,
    address,
    balance: 0,
    tokenSymbol: MOCK_TOKEN_SYMBOL,
    isConnecting: connecting,
    error: null,
    isMock: false,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}
