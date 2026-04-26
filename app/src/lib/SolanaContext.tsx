import { type ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useNetworkStore } from "../stores/networkStore";

import "@solana/wallet-adapter-react-ui/styles.css";

const FALLBACK_ENDPOINT = "https://api.devnet.solana.com";

const WALLET_ERROR_HANDLER = (error: Error) => {
  console.error("[SolanaWallet]", error);
};

interface SolanaContextProps {
  children: ReactNode;
}

function SolanaContext({ children }: SolanaContextProps) {
  const { rpcEndpoint } = useNetworkStore();

  const endpoint = rpcEndpoint || FALLBACK_ENDPOINT;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={WALLET_ERROR_HANDLER}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaContext;
