import { useMemo } from "react";
import { mockKYCData } from "../mock/kyc";

export function useKYCData() {
  const data = useMemo(() => mockKYCData, []);

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
}
