import { subDays } from "date-fns";
import type { KYCData } from "../types";

export const mockKYCData: KYCData = {
  id: "kyc-1",
  userId: "user-1",
  status: "submitted",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  dateOfBirth: new Date("1990-05-15"),
  idDocument: {
    front: "/mock/id-front.jpg",
    back: "/mock/id-back.jpg",
    type: "passport",
    number: "AB1234567",
  },
  proofOfAddress: "/mock/proof-address.pdf",
  selfie: "/mock/selfie.jpg",
  submittedAt: subDays(new Date(), 2),
};
