import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

import Select from "../components/ui/Select";
import { Calendar, Zap, Droplets, ArrowLeft, ArrowRight } from "lucide-react";
import { useBlockchainData } from "../hooks/useBlockchainData";
import ContributionGraph from "../components/features/blockchain/ContributionGraph";

function Blockchain() {
  const {
    paginatedHistory,
    monthlyWaterBlocks,
    monthlyElectricBlocks,
    sortBy,
    setSortBy,
    currentPage,
    itemsPerPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
  } = useBlockchainData();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Blockchain History
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Usage (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionGraph
              blocks={monthlyWaterBlocks}
              type="water"
              title="Water Consumption"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Electric Usage (Monthly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContributionGraph
              blocks={monthlyElectricBlocks}
              type="electric"
              title="Electric Consumption"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as "week" | "water" | "electric")
                }
                options={[
                  { value: "week", label: "Sort by Week" },
                  { value: "water", label: "Sort by Water" },
                  { value: "electric", label: "Sort by Electric" },
                ]}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Week
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Water (m³)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Electric (kWh)
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedHistory.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                      {record.week}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-900 dark:text-white">
                          {record.waterConsumption}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-gray-900 dark:text-white">
                          {record.electricConsumption}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} of{" "}
            {totalPages * itemsPerPage} records
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Blockchain;
