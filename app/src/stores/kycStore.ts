import { create } from "zustand";
import type { KYCData, KYCStatus, IDDocument, KYCSubmission } from "../types";

interface KYCState {
  kycData: KYCData;
  isLoading: boolean;
  error: string | null;

  setKYCData: (data: Partial<KYCData>) => void;
  setStatus: (status: KYCStatus) => void;
  setIdDocument: (document: IDDocument) => void;
  setProofOfAddress: (proof: string) => void;
  setSelfie: (selfie: string) => void;
  submitKYC: (submission: KYCSubmission) => Promise<void>;
  resetKYC: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: KYCData = {
  id: "kyc-default",
  userId: "user-default",
  status: "not_started",
};

export const useKYCStore = create<KYCState>((set) => ({
  kycData: initialState,
  isLoading: false,
  error: null,

  setKYCData: (data) =>
    set((state) => ({
      kycData: { ...state.kycData, ...data },
    })),

  setStatus: (status) =>
    set((state) => ({
      kycData: { ...state.kycData, status },
    })),

  setIdDocument: (document) =>
    set((state) => ({
      kycData: { ...state.kycData, idDocument: document },
    })),

  setProofOfAddress: (proof) =>
    set((state) => ({
      kycData: { ...state.kycData, proofOfAddress: proof },
    })),

  setSelfie: (selfie) =>
    set((state) => ({
      kycData: { ...state.kycData, selfie },
    })),

  submitKYC: async (submission) => {
    set({ isLoading: true, error: null });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      set((state) => ({
        kycData: {
          ...state.kycData,
          ...submission,
          id: `kyc-${Date.now()}`,
          status: "submitted",
          submittedAt: new Date(),
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to submit KYC",
      });
    }
  },

  resetKYC: () =>
    set({
      kycData: initialState,
      isLoading: false,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),
}));
