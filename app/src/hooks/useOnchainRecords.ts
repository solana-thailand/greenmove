import { useState, useEffect, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNetworkStore } from "../stores/networkStore";
import {
  PROGRAM_ID,
  ANCHOR_DISCRIMINATOR_SIZE,
  PUBKEY_SIZE,
} from "../lib/program";
import type { OnchainEnergyRecord } from "../lib/program";
import { parseEnergyRecord } from "../lib/accountParser";

const ENERGY_RECORD_MIN_SIZE =
  ANCHOR_DISCRIMINATOR_SIZE + PUBKEY_SIZE + PUBKEY_SIZE + 8 + 8 + 8 + 8 + 8 + 1;
const DEVICE_PUBKEY_OFFSET = ANCHOR_DISCRIMINATOR_SIZE;

interface UseOnchainRecordsReturn {
  records: OnchainEnergyRecord[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOnchainRecords(
  devicePubkey: string | null
): UseOnchainRecordsReturn {
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
    if (isMock) {
      const id = requestAnimationFrame(() => {
        setRecords([]);
        setIsLoading(false);
        setError(null);
      });
      return () => cancelAnimationFrame(id);
    }

    let cancelled = false;

    async function fetchRecords() {
      setIsLoading(true);
      setError(null);

      try {
        const accounts = devicePubkey
          ? await connection.getProgramAccounts(PROGRAM_ID, {
              filters: [
                {
                  memcmp: {
                    offset: DEVICE_PUBKEY_OFFSET,
                    bytes: devicePubkey,
                  },
                },
              ],
            })
          : await connection.getProgramAccounts(PROGRAM_ID);

        if (cancelled) return;

        const parsed: OnchainEnergyRecord[] = [];
        for (const { pubkey, account } of accounts) {
          if (account.data.length < ENERGY_RECORD_MIN_SIZE) continue;
          const record = parseEnergyRecord(account.data, pubkey.toBase58());
          if (record) {
            if (devicePubkey && record.device !== devicePubkey) continue;
            parsed.push(record);
          }
        }

        parsed.sort((a, b) => a.recordIndex - b.recordIndex);
        setRecords(parsed);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch energy records"
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
