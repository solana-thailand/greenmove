import { useState, useEffect, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNetworkStore } from "../stores/networkStore";
import { PROGRAM_ID } from "../lib/program";
import type { OnchainSolarDevice } from "../lib/program";
import { parseSolarDevice } from "../lib/accountParser";

const SOLAR_DEVICE_MIN_SIZE = 8 + 32 + 4 + 4 + 8 + 8 + 8 + 1 + 8 + 8 + 1;

interface UseOnchainDevicesReturn {
  devices: OnchainSolarDevice[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOnchainDevices(): UseOnchainDevicesReturn {
  const { connection } = useConnection();
  const { isMock } = useNetworkStore();
  const [devices, setDevices] = useState<OnchainSolarDevice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (isMock) {
      const id = requestAnimationFrame(() => {
        setDevices([]);
        setIsLoading(false);
        setError(null);
      });
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    async function fetchDevices() {
      setIsLoading(true);
      setError(null);

      try {
        const accounts = await connection.getProgramAccounts(PROGRAM_ID);

        if (cancelled) return;

        const parsed: OnchainSolarDevice[] = [];
        for (const { pubkey, account } of accounts) {
          if (account.data.length < SOLAR_DEVICE_MIN_SIZE) continue;
          const device = parseSolarDevice(account.data, pubkey.toBase58());
          if (device) {
            parsed.push(device);
          }
        }

        setDevices(parsed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch devices"
        );
        setIsLoading(false);
      }
    }

    fetchDevices();

    return () => {
      cancelled = true;
    };
  }, [isMock, connection, refreshKey]);

  return { devices, isLoading, error, refetch };
}
