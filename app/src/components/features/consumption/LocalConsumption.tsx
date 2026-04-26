import { useState } from "react";
import { AlertCircle, ServerOff, RefreshCw } from "lucide-react";
import { useConsumptionData } from "../../../hooks/useConsumptionData";
import SolarGenerationCard from "./SolarGenerationCard";
import TokensMintedCard from "./TokensMintedCard";
import MonthlyComparisonTable from "./MonthlyComparisonTable";
import Select from "../../ui/Select";

function LocalConsumption() {
  const {
    solarGeneration,
    tokensMinted,
    solarChange,
    tokensChange,
    monthlyComparison,
    isLoading,
    error,
  } = useConsumptionData();

  const [selectedMonth, setSelectedMonth] = useState("current");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertCircle className="h-8 w-8 mb-3" />
        <p className="text-sm mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const hasData = solarGeneration > 0 || tokensMinted > 0;

  if (!isLoading && !hasData) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <SolarGenerationCard generationKwh={0} change={0} isLoading={false} />
          <TokensMintedCard tokens={0} change={0} isLoading={false} />
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
          <ServerOff className="h-8 w-8 mb-3" />
          <p className="text-sm">No on-chain energy records found.</p>
          <p className="text-xs mt-1">
            Switch to Localnet and register a device to see consumption data.
          </p>
        </div>
      </div>
    );
  }

  const comparisonData =
    selectedMonth === "current"
      ? monthlyComparison
      : selectedMonth === "last"
      ? monthlyComparison
      : monthlyComparison;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Select
          value={selectedMonth}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedMonth(e.target.value)
          }
          options={[
            { value: "current", label: "Current Month" },
            { value: "last", label: "Last Month" },
            { value: "3months", label: "Last 3 Months" },
          ]}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SolarGenerationCard
          generationKwh={solarGeneration}
          change={solarChange}
          isLoading={isLoading}
        />
        <TokensMintedCard
          tokens={tokensMinted}
          change={tokensChange}
          isLoading={isLoading}
        />
      </div>

      <MonthlyComparisonTable data={comparisonData} isLoading={isLoading} />
    </div>
  );
}

export default LocalConsumption;
