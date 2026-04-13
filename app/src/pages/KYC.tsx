import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  UserCheck,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface KYCData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  idType: string;
}

function KYC() {
  const [isVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kycData, setKycData] = useState<KYCData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    idNumber: "",
    idType: "passport",
  });

  const handleInputChange = (field: keyof KYCData, value: string) => {
    setKycData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const getKYCStatus = () => {
    if (isVerified)
      return { icon: CheckCircle, text: "Verified", color: "text-green-500" };
    if (isSubmitted)
      return { icon: Clock, text: "Under Review", color: "text-yellow-500" };
    return { icon: XCircle, text: "Not Verified", color: "text-red-500" };
  };

  const status = getKYCStatus();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          KYC Verification
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-8 w-8 ${status.color}`} />
            <div>
              <div className={`text-2xl font-bold ${status.color}`}>
                {status.text}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isVerified
                  ? "Your KYC has been verified. You can access all features."
                  : isSubmitted
                  ? "Your KYC application is under review. This usually takes 1-2 business days."
                  : "Complete KYC verification to access all platform features."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isVerified && !isSubmitted && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="Full Name"
                  value={kycData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Enter your full legal name"
                />
              </div>
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  value={kycData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("email", e.target.value)
                  }
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  value={kycData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("phone", e.target.value)
                  }
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Input
                  label="Residential Address"
                  value={kycData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("address", e.target.value)
                  }
                  placeholder="Enter your full address"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  label="ID Type"
                  value={kycData.idType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("idType", e.target.value)
                  }
                  placeholder="Select ID type"
                />
              </div>
              <div>
                <Input
                  label="ID Number"
                  value={kycData.idNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("idNumber", e.target.value)
                  }
                  placeholder="Enter your ID number"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Front of ID
                  </label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 dark:border-gray-700 dark:bg-gray-900/50">
                    <Upload className="mr-2 h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Back of ID
                  </label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 dark:border-gray-700 dark:bg-gray-900/50">
                    <Upload className="mr-2 h-8 w-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Additional Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Proof of Address
                </label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 dark:border-gray-700 dark:bg-gray-900/50">
                  <Upload className="mr-2 h-8 w-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      Utility bill or bank statement (PDF, PNG, JPG up to 10MB)
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Selfie with ID
                </label>
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 dark:border-gray-700 dark:bg-gray-900/50">
                  <Upload className="mr-2 h-8 w-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSubmit}>
              Submit KYC Application
            </Button>
          </div>
        </>
      )}

      {isVerified && (
        <Card>
          <CardContent className="py-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              KYC Verification Complete
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              You now have full access to all Greenmove features including token
              swaps and advanced analytics.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default KYC;
