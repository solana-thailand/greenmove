import { useState, useEffect, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNetworkStore } from "../stores/networkStore";
import {
  PROGRAM_ID,
  ENERGY_RECORD_ACCOUNT_SIZE,
  ENERGY_RECORD_DEVICE_OFFSET,
} from "../lib/program";
import type { OnchainEnergyRecord } from "../lib/program";
import { parseEnergyRecord } from "../lib/accountParser";

interface UseOnchainRecordsReturn {
  records: OnchainEnergyRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOnchainRecords(devicePubkey: string | null): UseOnchainRecordsReturn {
  const { connection } = useConnection();
  const { isMock } = useNetworkStore();
  const [records, setRecords] = useState<OnchainEnergyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (isMock || !devicePubkey) {
      setRecords([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchRecords() {
      setIsLoading(true);
      setError(null);

      try {
        const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
          filters: [
            { dataSize: ENERGY_RECORD_ACCOUNT_SIZE },
            {
              memcmp: {
                offset: ENERGY_RECORD_DEVICE_OFFSET,
                bytes: devicePubkey,
              },
            },
          ],
        });

        if (cancelled) return;

        const parsed: OnchainEnergyRecord[] = [];
        for (const { pubkey, account } of accounts) {
          const record = parseEnergyRecord(account.data, pubkey.toBase58());
          if (record) {
            parsed.push(record);
          }
        }

        parsed.sort((a, b) => a.recordIndex - b.recordIndex);

        setRecords(parsed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch energy records",
        );
        setIsLoading(false);
      }
    }

    fetchRecords();

    return () => {
      cancelled = true;
    };
  }, [isMock, connection, devicePubkey, refreshKey]);

  return { records, isLoading, error, refetch };
}
