export type KYCStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "approved"
  | "rejected";

export interface IDDocument {
  front?: string;
  back?: string;
  type?: string;
  number?: string;
}

export interface KYCData {
  id: string;
  userId: string;
  status: KYCStatus;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  idDocument?: IDDocument;
  proofOfAddress?: string;
  selfie?: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  rejectionReason?: string;
}

export interface KYCSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  nationality: string;
  address: KYCData["address"];
  idDocument: IDDocument;
  proofOfAddress: string;
  selfie: string;
}

export interface KYCVerificationRequest {
  id: string;
  userId: string;
  data: KYCSubmission;
  submittedAt: Date;
}

export interface KYCVerificationResult {
  kycId: string;
  userId: string;
  status: KYCStatus;
  reviewedAt: Date;
  reviewerId?: string;
  rejectionReason?: string;
}

export interface KYCRequirements {
  minAge: number;
  requiredDocuments: Array<"id_document" | "proof_of_address" | "selfie">;
  acceptedNationalities: string[];
  requiredFields: Array<keyof KYCSubmission>;
}

export const DEFAULT_KYC_REQUIREMENTS: KYCRequirements = {
  minAge: 18,
  requiredDocuments: ["id_document", "proof_of_address", "selfie"],
  acceptedNationalities: [],
  requiredFields: [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dateOfBirth",
    "nationality",
    "address",
  ],
};

export function isKYCDataComplete(data: KYCData): boolean {
  return !!(
    data.firstName &&
    data.lastName &&
    data.email &&
    data.phone &&
    data.dateOfBirth &&
    data.nationality &&
    data.address?.street &&
    data.address?.city &&
    data.address?.state &&
    data.address?.postalCode &&
    data.address?.country &&
    data.idDocument?.front &&
    data.idDocument?.back &&
    data.idDocument?.type &&
    data.idDocument?.number &&
    data.proofOfAddress &&
    data.selfie
  );
}

export function getKYCStatusDisplay(status: KYCStatus): string {
  const STATUS_DISPLAY: Record<KYCStatus, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    submitted: "Under Review",
    approved: "Approved",
    rejected: "Rejected",
  };

  return STATUS_DISPLAY[status];
}

export function getKYCStatusColor(status: KYCStatus): string {
  const STATUS_COLORS: Record<KYCStatus, string> = {
    not_started: "gray",
    in_progress: "blue",
    submitted: "yellow",
    approved: "green",
    rejected: "red",
  };

  return STATUS_COLORS[status];
}
