import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Select from "../components/ui/Select";
import {
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { mockMonthlyComparisonData } from "../mock/consumption";

function Consumption() {
  const [selectedMonth, setSelectedMonth] = useState("current");

  const waterConsumption = 1250.5;
  const waterPrevious = 1180.2;
  const electricConsumption = 850.3;
  const electricPrevious = 795.8;

  const waterChange =
    ((waterConsumption - waterPrevious) / waterPrevious) * 100;
  const electricChange =
    ((electricConsumption - electricPrevious) / electricPrevious) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Consumption Tracking
        </h2>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Water Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <div className="text-4xl font-bold text-blue-500">
                  {waterConsumption}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cubic meters (m³)
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {waterChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">
                      +{waterChange.toFixed(1)}% vs last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      {waterChange.toFixed(1)}% vs last month
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Electric Consumption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <div className="text-4xl font-bold text-yellow-500">
                  {electricConsumption}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kilowatt-hours (kWh)
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {electricChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">
                      +{electricChange.toFixed(1)}% vs last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      {electricChange.toFixed(1)}% vs last month
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-20">
                    Week
                  </th>
                  {mockMonthlyComparisonData.data.map((month, index) => (
                    <th
                      key={`${month.year}-${month.month}`}
                      className="py-2 px-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 min-w-[60px]"
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((weekNum) => (
                  <tr
                    key={weekNum}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">
                      Week {weekNum}
                    </td>
                    {mockMonthlyComparisonData.data.map((month) => {
                      const week = month.weeks.find(
                        (w) => w.weekNumber === weekNum
                      );
                      return (
                        <td
                          key={`${month.year}-${month.month}-${weekNum}`}
                          className="py-2 px-2"
                        >
                          {week && week.isEmpty ? (
                            <div className="h-12 w-12 mx-auto rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                          ) : (
                            <div
                              className="h-12 w-12 mx-auto rounded-md border border-white dark:border-gray-700 shadow-sm"
                              style={{
                                backgroundColor: week?.color || "#f3f4f6",
                              }}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-blue-500" />
                <span>100% Water</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-500" />
                <span>100% Electric</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-gradient-to-r from-yellow-300 via-green-300 to-blue-500" />
                <span>Mixed (Water : Electric)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Consumption;
