import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import Select from "../components/ui/Select";
import { Sun, Coins, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { mockSolarHistory, mockMonthlyComparisonData } from "../mock/solar";

function Consumption() {
  const [selectedMonth, setSelectedMonth] = useState("current");

  const solarGeneration = mockSolarHistory.currentMonth.generation;
  const solarPrevious = mockSolarHistory.previousMonth.generation;
  const tokensMinted = mockSolarHistory.currentMonth.tokensMinted;
  const tokensPrevious = mockSolarHistory.previousMonth.tokensMinted;

  const solarChange = ((solarGeneration - solarPrevious) / solarPrevious) * 100;
  const tokensChange = ((tokensMinted - tokensPrevious) / tokensPrevious) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Solar Generation Tracking
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
              <Sun className="h-5 w-5 text-green-500" />
              Solar Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <div className="text-4xl font-bold text-green-500">
                  {solarGeneration}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kilowatt-hours (kWh)
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {solarChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      +{solarChange.toFixed(1)}% vs last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">
                      {solarChange.toFixed(1)}% vs last month
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
              <Coins className="h-5 w-5 text-yellow-500" />
              Tokens Minted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div>
                <div className="text-4xl font-bold text-yellow-500">
                  {tokensMinted}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tokens
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tokensChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">
                      +{tokensChange.toFixed(1)}% vs last month
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">
                      {tokensChange.toFixed(1)}% vs last month
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
                  {mockMonthlyComparisonData.data.map((_month, index) => (
                    <th
                      key={`${_month.year}-${_month.month}`}
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
                <div className="h-4 w-4 rounded bg-green-400" />
                <span>Low Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-yellow-400" />
                <span>Medium Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-red-600" />
                <span>High Generation</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Consumption;
