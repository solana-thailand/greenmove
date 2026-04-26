import { useState, useEffect, useMemo } from "react";
import { mockKYCData } from "../mock/kyc";
import { useNetworkStore } from "../stores/networkStore";

interface KYCTestnetData {
  id: string;
  userId: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  idDocument: string | null;
  proofOfAddress: string | null;
  selfie: string | null;
  submittedAt: Date | null;
}

export function useKYCData() {
  const { isMock, rpcEndpoint } = useNetworkStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testnetData, setTestnetData] = useState<KYCTestnetData | null>(null);

  useEffect(() => {
    if (isMock) return;

    let cancelled = false;

    async function fetchKYCData() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(rpcEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getHealth",
          }),
        });

        if (!response.ok) {
          throw new Error(`RPC request failed: ${response.status}`);
        }

        if (!cancelled) {
          setTestnetData(null);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch KYC data"
          );
          setIsLoading(false);
        }
      }
    }

    fetchKYCData();

    return () => {
      cancelled = true;
    };
  }, [isMock, rpcEndpoint]);

  const mockResult = useMemo(() => {
    const data = mockKYCData;
    return {
      id: data.id,
      userId: data.userId,
      status: data.status,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      idDocument: data.idDocument,
      proofOfAddress: data.proofOfAddress,
      selfie: data.selfie,
      submittedAt: data.submittedAt,
      isLoading: false,
      error: null,
    };
  }, []);

  const testnetResult = useMemo(
    () => ({
      id: testnetData?.id ?? "",
      userId: testnetData?.userId ?? "",
      status: testnetData?.status ?? "not_started",
      firstName: testnetData?.firstName ?? "",
      lastName: testnetData?.lastName ?? "",
      email: testnetData?.email ?? "",
      phone: testnetData?.phone ?? "",
      dateOfBirth: testnetData?.dateOfBirth ?? "",
      idDocument: testnetData?.idDocument ?? null,
      proofOfAddress: testnetData?.proofOfAddress ?? null,
      selfie: testnetData?.selfie ?? null,
      submittedAt: testnetData?.submittedAt ?? null,
      isLoading,
      error,
    }),
    [testnetData, isLoading, error]
  );

  return isMock ? mockResult : testnetResult;
}
