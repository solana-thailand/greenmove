import { create } from "zustand";
import {
  NETWORK_MOCK,
  SOLANA_RPC_ENDPOINTS,
  SOLANA_WS_ENDPOINTS,
  type NetworkType,
} from "../constants/network";

interface NetworkStore {
  network: NetworkType;
  rpcEndpoint: string;
  wsEndpoint: string;
  isMock: boolean;
  setNetwork: (network: NetworkType) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  network: NETWORK_MOCK,
  rpcEndpoint: SOLANA_RPC_ENDPOINTS[NETWORK_MOCK],
  wsEndpoint: SOLANA_WS_ENDPOINTS[NETWORK_MOCK],
  isMock: true,

  setNetwork: (network) =>
    set({
      network,
      rpcEndpoint: SOLANA_RPC_ENDPOINTS[network],
      wsEndpoint: SOLANA_WS_ENDPOINTS[network],
      isMock: network === NETWORK_MOCK,
    }),
}));
